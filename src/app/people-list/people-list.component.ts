import { Component, OnInit } from '@angular/core';
import { PersonService } from '../person.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit {
  people: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private service: PersonService, public router: Router) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.service.getPeople().subscribe((res: any) => {
      this.people = res || [];
      this.loading = false;
    }, (err: any) => {
      this.error = err && err.message ? err.message : 'Failed to load people';
      this.loading = false;
    });
  }

  edit(id: string) {
    this.router.navigate(['/people/edit', id]);
  }

  del(id: string) {
    this.router.navigate(['/people/delete', id]);
  }

  add() {
    this.router.navigate(['/people/edit', 'new']);
  }
}
