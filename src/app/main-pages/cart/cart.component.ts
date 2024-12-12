import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Products } from '../../service/product/products';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { from, map, Observable, scan, takeLast } from 'rxjs';
import { Params, Router } from '@angular/router';
import { UserService } from '../../service/user/user.service';
import { UserCart } from '../../service/cartBadge/user-cart';
import { CartBadgeService } from '../../service/cartBadge/cart-badge.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, AfterViewInit {
  constructor() {}

  user: string | null | unknown = null;
  service = inject(UserService);
  ProductData: Products[] = [];
  columns: string[] = ['Cart'];
  index: number = 0;
  dataSource = new MatTableDataSource<Products>(this.getProducts());
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  primary: string = 'blue';
  totalPrice: number = 0;

  total: number = 0;
  ngOnInit(): void {
    this.service.user$.subscribe({
      next: (user) => {
        this.user = user;
        this.getProducts();
        this.dataSource = new MatTableDataSource<Products>(this.ProductData);
        this.getTotal().subscribe({
          next: (data) => {
            this.total = data;
          },
        });
      },
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getProducts(): Products[] {
    if (this.user) {
      let data: UserCart[] = JSON.parse(
        localStorage.getItem('UserCart') || '[]'
      );
      let userIndex = data.findIndex((product) => product.user == this.user);
      return (this.ProductData = data[userIndex].products);
    } else {
      return (this.ProductData = JSON.parse(
        localStorage.getItem('Cart') || '[]'
      ));
    }
  }

  getTotal() {
    let products: Observable<Products> = from(this.getProducts());
    let total = products.pipe(
      map((data) => {
        return data.price;
      }),
      scan((acc, curr) => acc + curr, 0)
    );

    return total;
  }

  onCatch(value: boolean) {
    this.dataSource = new MatTableDataSource<Products>(this.getProducts());
    this.dataSource.paginator = this.paginator;
  }

  runTotal(value: boolean) {
    this.getProducts();
    let total$ = from(this.ProductData)
      .pipe(
        map((products) => {
          return (
            (products.price -
              products.price * (products.discountPercentage / 100)) *
            products.quantity
          );
        }),
        scan((acc, curr) => acc + curr, 0),
        takeLast(1)
      )
      .subscribe((x) => {
        this.totalPrice = x;
      });
  }

  //for buying producst
  count = inject(CartBadgeService);
  router = inject(Router);
  buyNow() {
    if (this.user) {
      let data: UserCart[] = JSON.parse(
        localStorage.getItem('UserCart') || '[]'
      );
      let userIndex = data.findIndex((cart) => cart.user == this.user);
      if (userIndex != -1) {
        data.splice(userIndex, 1);
        localStorage.setItem('UserCart', JSON.stringify(data));
        this.dataSource = new MatTableDataSource<Products>(null);
        this.dataSource.paginator = this.paginator;
        this.totalPrice = 0;
        this.ProductData.length = 0;
        this.count.updateCount();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
