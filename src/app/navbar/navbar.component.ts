import { Component, computed, DoCheck, effect, ElementRef, Inject, inject, Injector, input, OnChanges, OnInit, Signal, signal, SimpleChanges, ViewChild, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Products } from '../service/product/products';
import { CartBadgeService } from '../service/cartBadge/cart-badge.service';
import { UserService } from '../service/user/user.service';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent implements OnInit {

  constructor(private count:CartBadgeService) {
  }

  product = input<Products[]>(JSON.parse(localStorage.getItem('Cart')));

  ngOnInit(): void {
    console.error = () => {};
    this.count.getCount().subscribe({
      next: count => {
        this.badgeCount = count;
      }
    });
  }

  @ViewChild('hideNav') nav!:ElementRef;
  isHidden:boolean = true;
  toggleNav() {
    if(this.isHidden) {
      this.nav.nativeElement.classList.add('nav-close');
      this.nav.nativeElement.classList.add('nav-show');
      this.isHidden = false
      setTimeout(()=>{
        this.nav.nativeElement.classList.remove('nav-show');
      },500)
    } else {
      this.nav.nativeElement.classList.add('nav-hide');
      this.isHidden = true
      setTimeout(() => {
        this.nav.nativeElement.classList.remove('nav-close');
        this.nav.nativeElement.classList.remove('nav-hide');
      }, 300)
    }
  }

  badgeCount:number = 0;
}
