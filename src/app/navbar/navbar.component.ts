import {
  Component,
  ElementRef,
  input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from '../service/product/products';
import { CartBadgeService } from '../service/cartBadge/cart-badge.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  constructor(private count: CartBadgeService) {}

  product = input<Products[]>(JSON.parse(localStorage.getItem('Cart')));

  ngOnInit(): void {
    console.error = () => {};
  }

  @ViewChild('hideNav') nav!: ElementRef;
  isHidden = true;
  toggleNav() {
    if (this.isHidden) {
      this.nav.nativeElement.classList.add('nav-close');
      this.nav.nativeElement.classList.add('nav-show');
      this.isHidden = false;
      setTimeout(() => {
        this.nav.nativeElement.classList.remove('nav-show');
      }, 500);
    } else {
      this.nav.nativeElement.classList.add('nav-hide');
      this.isHidden = true;
      setTimeout(() => {
        this.nav.nativeElement.classList.remove('nav-close');
        this.nav.nativeElement.classList.remove('nav-hide');
      }, 300);
    }
  }

  badgeCount: Observable<number> = this.count.getCount();
}
