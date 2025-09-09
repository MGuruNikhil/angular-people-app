import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../person.service';

@Component({ selector: 'app-delete-person', templateUrl: './delete-person.component.html', styleUrls: ['./delete-person.component.scss'] })
export class DeletePersonComponent implements OnInit {
  id: string;
  person: any;
  loading = false;
  deleting = false;
  error: string | null = null;

  constructor(private route: ActivatedRoute, public router: Router, private service: PersonService) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.loading = true;
      this.service.getPersonById(this.id).subscribe((p: any) => {
        this.person = p;
        this.loading = false;
      }, () => (this.loading = false));
    }
  }

  confirm() {
    if (!this.id) return;
    this.deleting = true;
    this.error = null;
    this.service.deletePerson(this.id).subscribe(() => {
      this.deleting = false;
      this.router.navigate(['/people']);
    }, (err: any) => {
      this.deleting = false;
      this.error = err && err.message ? err.message : 'Failed to delete person';
    });
  }
}
