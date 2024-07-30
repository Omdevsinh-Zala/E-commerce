import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Products } from '../product/products';
import { UserService } from '../user/user.service';
import { UserCart } from './user-cart';

@Injectable({
  providedIn: 'root'
})
export class CartBadgeService {

  service = inject(UserService)
  constructor() {
    this.service.setUser();
    this.service.user$.subscribe({
      next:(user) => {
        this.user = user
        this.getIndex();
      }
    })
  }
  user:string | null | unknown = null
  userIndex:number = 0;
  product: UserCart[] = JSON.parse(localStorage.getItem('UserCart') || '[]');
  products: Products[] = JSON.parse(localStorage.getItem('Cart') || '[]');
  private count = new BehaviorSubject<number>(0);
  private count$ = this.count.asObservable();


  addToCart(data:Products) {
    if(this.user) {
      let userIndex = this.product.findIndex((cart) => cart.user == this.user);
      if(userIndex != -1) {
        this.userIndex = userIndex;
        let index = this.product[userIndex].products.findIndex((product) => product.id == data.id);
        if(index != -1) {
          this.product[userIndex].products[index].quantity++;
        } else {
          data.quantity = 1;
          this.product[userIndex].products.push(data); 
        }
        this.count.next(this.product[userIndex].products.length)
      } else {
        let newData:UserCart = {
          products:[data],
          user: this.user,
          completeOrder: false
        }
        this.product.push(newData);
        this.count.next(this.product.length)
      }
      localStorage.setItem('UserCart', JSON.stringify(this.product));
    } else {
    this.products = JSON.parse(localStorage.getItem('Cart') || '[]');
    let index = this.products.findIndex((product) => product.id === data.id);
    if (index !== -1) {
      this.products[index].quantity++;
    } else {
      data.quantity = 1;
      this.products.push(data);
    }
      localStorage.setItem('Cart', JSON.stringify(this.products));
      this.count.next(this.products.length);
    }
  }

  getIndex() {
    if(this.user) {
      let userIndex = this.product.findIndex((cart) => cart.user == this.user);
      if (userIndex != -1) {
        this.count.next(this.product[userIndex].products.length)
      } else {
        this.count.next(0);
      }
    } else {
      this.count.next(this.products.length);
    }
  }

  getCount() {
    return this.count$;
  }

  decreaseQuantity(data: string) {
    if(this.user) {
      let userIndex = this.product.findIndex((cart) => cart.user == this.user);
      let index = this.product[userIndex].products.findIndex((product) => product.id == data);
      if(this.product[userIndex].products[index].quantity > 1) {
        this.product[userIndex].products[index].quantity--;
      } else {
        this.product[userIndex].products.splice(index,1);
      }
      localStorage.setItem('UserCart', JSON.stringify(this.product));
      this.count.next(this.product[userIndex].products.length)
    } else {
      this.products = JSON.parse(localStorage.getItem('Cart') || '[]');
      let index = this.products.findIndex(product => product.id == data);
      if (this.products[index].quantity > 1) {
        this.products[index].quantity--;
      } else {
        this.products.splice(index, 1);
      }
      localStorage.setItem('Cart', JSON.stringify(this.products));
      this.count.next(this.products.length);
    }
  }

  removeProduct(data: Products) {
    if(this.user) {
      let userIndex = this.product.findIndex((cart) => cart.user == this.user);
      let index = this.product[userIndex].products.findIndex((product) => product.id == data.id);
      this.product[userIndex].products.splice(index,1);
      localStorage.setItem('UserCart', JSON.stringify(this.product));
      this.count.next(this.product[userIndex].products.length)
    } else {
      this.products = JSON.parse(localStorage.getItem('Cart') || '[]');
      let index = this.products.findIndex(product => product.id == data.id);
      this.products.splice(index, 1);
      localStorage.setItem('Cart', JSON.stringify(this.products));
      this.count.next(this.products.length);
    }
  }
}
