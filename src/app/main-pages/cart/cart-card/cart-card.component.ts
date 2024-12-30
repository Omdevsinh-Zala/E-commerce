import {
  Component,
  inject,
  input,
  OnChanges,
  OnInit,
  output,
} from '@angular/core';
import { Products } from '../../../service/product/products';
import { CartBadgeService } from '../../../service/cartBadge/cart-badge.service';
import { UserService } from '../../../service/user/user.service';

@Component({
  selector: 'app-cart-card',
  templateUrl: './cart-card.component.html',
  styleUrl: './cart-card.component.scss',
})
export class CartCardComponent implements OnChanges, OnInit {
  constructor(private count: CartBadgeService) {}
  service = inject(UserService);
  product: any[] = JSON.parse(localStorage.getItem('Cart') || '[]');

  products = input<Products>();

  signal = output<boolean>();

  ngOnInit(): void {
    this.service.user$.subscribe({
      next: (user) => {
        this.user = user;
      },
    });
    this.changeTotal();
  }

  user: string | null | unknown = null;
  ngOnChanges(): void {
    if (this.user) {
      this.product = JSON.parse(localStorage.getItem('UserCart') || '[]');
    } else {
      this.product = JSON.parse(localStorage.getItem('Cart') || '[]');
    }
  }

  increaseQuantity(data: string, e: Event) {
    e.stopImmediatePropagation();
    if (this.user) {
      this.product = JSON.parse(localStorage.getItem('UserCart') || '[]');
      const userIndex = this.product.findIndex(
        (cart) => cart.user == this.user
      );
      const index = this.product[userIndex].products.findIndex(
        (product) => product.id == data
      );
      this.product[userIndex].products[index].quantity++;
      localStorage.setItem('UserCart', JSON.stringify(this.product));
    } else {
      this.product = JSON.parse(localStorage.getItem('Cart') || '[]');
      const index = this.product.findIndex((product) => product.id == data);
      this.product[index].quantity++;
      localStorage.setItem('Cart', JSON.stringify(this.product));
    }
    this.signal.emit(false);
    this.changeTotal();
    this.count.product = this.product;
  }

  decreaseQuantity(data: string, e: Event) {
    e.stopImmediatePropagation();
    this.count.decreaseQuantity(data);
    this.signal.emit(false);
    this.changeTotal();
  }

  total = output<boolean>();

  changeTotal() {
    this.total.emit(false);
  }

  //remove product
  removeProduct(data: Products, e: Event) {
    e.stopImmediatePropagation();
    this.count.removeProduct(data);
    this.signal.emit(false);
    this.changeTotal();
  }
}
