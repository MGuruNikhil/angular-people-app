import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
    <app-alert></app-alert>
      <h1>People App — Angular 8</h1>
  <nav><a routerLink="/people">People</a> | <a routerLink="/people">List</a></nav>
      <hr />
      <router-outlet></router-outlet>
    </div>
  `
  ,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
