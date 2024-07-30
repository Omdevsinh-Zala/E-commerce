import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  firstName:string | unknown | null = null;
  lasName:string | unknown | null = null;
  email:string | unknown | null = null;
  phoneNumber:number | unknown | null = null;
  gender:string | unknown | null = null
  address:string | unknown | null = null;
}
