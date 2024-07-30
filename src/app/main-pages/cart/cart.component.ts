import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Products } from '../../service/product/products';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, from, map, Observable, scan, takeLast } from 'rxjs';
import { Params } from '@angular/router';
import { PreviousUrlService } from '../../service/previousUrl/previous-url.service';
import { UserService } from '../../service/user/user.service';
import { UserCart } from '../../service/cartBadge/user-cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, AfterViewInit {

  constructor(private url:PreviousUrlService) {
  }

  user:string| null | unknown = null
  service = inject(UserService);
  ProductData:Products[] = [];
  columns:string[] = ['Cart'];
  index:number = 0;
  dataSource = new MatTableDataSource<Products>(this.getProducts())
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  primary:string = 'blue';
  totalPrice: number = 0;

  total:number =0;
  ngOnInit(): void {
    this.service.user$.subscribe({
      next: (user) => {
        this.user = user;
        this.getProducts();
        this.dataSource = new MatTableDataSource<Products>(this.ProductData);
        this.getTotal().subscribe({
          next: (data) => {
            this.total = data;
          }
        });
      }
    })
    this.url.getPreviour();
    this.previousPage = this.url.previousPage;
    this.queryParams = this.url.queryParams;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getProducts():Products[] {
    if(this.user) {
      let data:UserCart[] = JSON.parse(localStorage.getItem('UserCart') || '[]');
      let userIndex = data.findIndex((product) => product.user == this.user);
      return this.ProductData = data[userIndex].products
    } else {
      return this.ProductData = JSON.parse(localStorage.getItem('Cart') || '[]');
    }
  }

  getTotal() {
    let products:Observable<Products> = from(this.getProducts());
    let total = products.pipe(
      map((data) => {
        return data.price;
      }),
      scan((acc,curr) => acc+curr,0)
    );

    return total;
  }

  onCatch(value: boolean) {
    this.dataSource = new MatTableDataSource<Products>(this.getProducts());
    this.dataSource.paginator = this.paginator;
  }

  runTotal(value: boolean) {
    this.getProducts();
    let total$ = from(this.ProductData).pipe(
      map((products) => {
        return ((products.price) - (products.price * (products.discountPercentage / 100))) * products.quantity
      }),
      scan((acc,curr) => acc+curr,0),
      takeLast(1)
    ).subscribe(x => {
      this.totalPrice = x
    });
  }

  //for previous page
  previousPage: string = '';
  queryParams!: Params;
}
