import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EditPersonComponent } from './edit-person.component';
import { PersonService } from '../person.service';
import { of, throwError } from 'rxjs';

class MockPersonService {
  createPerson(data: any) { return of({}); }
  updatePerson(id: string, data: any) { return of({}); }
  getPersonById(id: string) { return of({ name: 'Test', age: 30, gender: 'M', mobile: '1234567' }); }
}

describe('EditPersonComponent', () => {
  let component: EditPersonComponent;
  let fixture: ComponentFixture<EditPersonComponent>;
  let svc: PersonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [EditPersonComponent],
      providers: [{ provide: PersonService, useClass: MockPersonService }]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPersonComponent);
    component = fixture.componentInstance;
    svc = TestBed.inject(PersonService);
    fixture.detectChanges();
  });

  it('should create form with required controls', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('name')).toBeDefined();
    expect(component.form.get('age')).toBeDefined();
    expect(component.form.get('mobile')).toBeDefined();
  });

  it('should invalidate age when non-digits entered', () => {
  const age = component.form.get('age');
  expect(age).toBeTruthy();
  age!.setValue('abc');
  expect(age!.valid).toBeFalse();
  expect(age!.errors && age!.errors.pattern).toBeTruthy();
  });

  it('should set server errors on controls when backend returns details', (done) => {
    const err = {
      status: 400,
      message: 'Validation failed',
      original: { error: { details: { age: { message: 'Age must be numeric' } } } }
    };
    spyOn(svc, 'createPerson').and.returnValue(throwError(() => err));
    component.form.get('name')!.setValue('Name');
    component.form.get('age')!.setValue('25');
    component.save();
    setTimeout(() => {
      const ageErr = component.form.get('age')!.errors && (component.form.get('age')!.errors as any).server;
      expect(ageErr).toBe('Age must be numeric');
      done();
    }, 10);
  });
});
