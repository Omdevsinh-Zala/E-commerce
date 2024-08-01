import { Component, inject, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { Products } from '../../../service/product/products';
import { CartBadgeService } from '../../../service/cartBadge/cart-badge.service';
import { UserService } from '../../../service/user/user.service';
import { UserCart } from '../../../service/cartBadge/user-cart';

@Component({
  selector: 'app-cart-card',
  templateUrl: './cart-card.component.html',
  styleUrl: './cart-card.component.scss'
})
export class CartCardComponent implements OnChanges, OnInit {

  constructor(private count:CartBadgeService) {
    this.service.user$.subscribe({
      next:(user) => {
        this.user = user;
      }
    })
  }
  service = inject(UserService);
  product: any[] = JSON.parse(localStorage.getItem('Cart') || '[]');

  products = input<Products>();

  signal = output<boolean>();

  ngOnInit(): void {
    this.changeTotal()
  }

  user:string | null | unknown = null;
  ngOnChanges(changes: SimpleChanges): void {
    if(this.user) {
      this.product = JSON.parse(localStorage.getItem('UserCart') || '[]');
    } else {
      this.product = JSON.parse(localStorage.getItem('Cart') || '[]');
    }
  }

  increaseQuantity(data: string,e:Event) {
    e.stopImmediatePropagation();
    if(this.user) {
      this.product = JSON.parse(localStorage.getItem('UserCart') || '[]');
      let userIndex = this.product.findIndex((cart) => cart.user);
      let index = this.product[userIndex].products.findIndex((product) => product.id == data);
      console.log(userIndex, index)
      this.product[userIndex].products[index].quantity++;
      localStorage.setItem('UserCart', JSON.stringify(this.product));
    } else {
      this.product = JSON.parse(localStorage.getItem('Cart') || '[]');
      let index = this.product.findIndex(product => product.id == data);
      this.product[index].quantity++;
      localStorage.setItem('Cart', JSON.stringify(this.product));
    }
    this.signal.emit(false);
    this.changeTotal();
    this.count.product = this.product
  }

  decreaseQuantity(data: string, e: Event) {
    e.stopImmediatePropagation();
    this.count.decreaseQuantity(data);
    this.signal.emit(false);
    this.changeTotal();
  }

  total = output<boolean>()

  changeTotal() {
    this.total.emit(false);
  }

  //remove product
  removeProduct(data: Products, e:Event) {
    e.stopImmediatePropagation();
    this.count.removeProduct(data);
    this.signal.emit(false);
    this.changeTotal();
  }
}
