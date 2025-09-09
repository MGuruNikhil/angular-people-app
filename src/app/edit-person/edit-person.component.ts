import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../person.service';

@Component({
  selector: 'app-edit-person',
  templateUrl: './edit-person.component.html'
  ,
  styleUrls: ['./edit-person.component.scss']
})
export class EditPersonComponent implements OnInit {
  form: FormGroup;
  id: string;
  loading = false;
  saving = false;
  error: string | null = null;
  // server-side field errors mapped to controls
  errorSummary: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: PersonService
  ) {
    // validators: name required, age required & numeric, mobile optional but digits-only (7-15 digits)
    this.form = this.fb.group({
      name: ['', [Validators.required]],
  age: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
  // gender optional, but if present must be one of the allowed values
  gender: ['', [Validators.pattern(/^(Male|Female|Other)?$/)]],
  // allow optional leading + and 7-15 digits (basic international format); for country-aware validation install libphonenumber-js
  mobile: ['', [Validators.pattern(/^\+?\d{7,15}$/)]]
    });
  }

  // convenience getter for template
  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id && this.id !== 'new') {
      this.loading = true;
      this.service.getPersonById(this.id).subscribe((p: any) => {
        this.form.patchValue(p || {});
        this.loading = false;
      }, () => (this.loading = false));
    }
  }

  save() {
    if (this.saving) return; // prevent double submit
    this.error = null;
    this.saving = true;
    // client-side validation: prevent submit and show validation messages
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Please fix validation errors before saving.';
      this.saving = false;
      return;
    }
    const payload = { ...this.form.value };
    // ensure age is sent as a number
    if (payload.age !== undefined && payload.age !== null && payload.age !== '') payload.age = Number(payload.age);

    if (!this.id || this.id === 'new') {
      // create
      this.service.createPerson(payload).subscribe(() => {
        this.saving = false;
        this.router.navigate(['/people']);
      }, (err: any) => {
        // Map server validation details to controls if present
        this.errorSummary = [];
        if (err && err.original && err.original.error && err.original.error.details) {
          const details = err.original.error.details;
          Object.keys(details).forEach(k => {
            const ctrl = this.form.get(k);
            const msg = details[k] && details[k].message ? details[k].message : details[k];
            if (ctrl) {
              ctrl.setErrors({ server: msg });
            } else {
              this.errorSummary.push(msg);
            }
          });
          this.error = 'Please fix the highlighted errors.';
        } else {
          this.error = err && err.message ? err.message : 'Failed to create person';
        }
        this.saving = false;
      });
      return;
    }
    this.service.updatePerson(this.id, payload).subscribe(() => {
      this.saving = false;
      this.router.navigate(['/people']);
    }, (err: any) => {
      this.errorSummary = [];
      if (err && err.original && err.original.error && err.original.error.details) {
        const details = err.original.error.details;
        Object.keys(details).forEach(k => {
          const ctrl = this.form.get(k);
          const msg = details[k] && details[k].message ? details[k].message : details[k];
          if (ctrl) ctrl.setErrors({ server: msg });
          else this.errorSummary.push(msg);
        });
        this.error = 'Please fix the highlighted errors.';
      } else {
        this.error = err && err.message ? err.message : 'Failed to update person';
      }
      this.saving = false;
    });
  }
}
