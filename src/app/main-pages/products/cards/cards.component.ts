import { Component, inject, input, } from '@angular/core';
import { Products } from '../../../service/product/products';
import { CartBadgeService } from '../../../service/cartBadge/cart-badge.service';
import { UserService } from '../../../service/user/user.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent {

  product: any[] = JSON.parse(localStorage.getItem('Cart') || '[]');
  service = inject(UserService);
  constructor(private count:CartBadgeService) {
    this.service.user$.subscribe({
      next: (user) => {
        this.user = user
      }
    })
  }

  products = input<Products>();
  rating = 5;
  user:string | null | unknown = null

  addToCart(data: Products, e: Event) {
    e.stopImmediatePropagation();
    this.count.addToCart(data);
  }
}
