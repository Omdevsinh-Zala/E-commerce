import { Component, ElementRef, inject, input, OnInit, output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../service/user/user.service';
import { Products } from '../service/product/products';
import { filter, from, map, Observable, toArray } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  account = inject(UserService);
  ngOnInit(): void {
    this.account.user$.subscribe({
      next: (user) => {
        this.user = user;
      }
    })
  }
  @ViewChild('expand') accountInfo!: ElementRef;
  user: string | undefined | null | unknown = '';

  isShown: boolean = false;
  toggleAccount() {
    if (this.isShown) {
      this.accountInfo.nativeElement.classList.add('hide');
      setTimeout(() => {
        this.accountInfo.nativeElement.classList.remove('hide');
        this.accountInfo.nativeElement.classList.remove('toggle');
      }, 200)
      this.isShown = false;
    } else {
      this.accountInfo.nativeElement.classList.add('toggle');
      this.accountInfo.nativeElement.classList.add('show');
      setTimeout(() => {
        this.accountInfo.nativeElement.classList.remove('show');
      }, 400);
      this.isShown = true;
    }
  }

  service = inject(UserService)
  logout() {
    this.service.logoutUser().subscribe();
  }

  router = inject(Router);
  login() {
    this.router.navigate(['/login'])
  }

  data= input<Products[]>();
  productName:Observable<string[]>

  @ViewChild('span') span!: ElementRef;
  @ViewChild('search') search!: ElementRef;
  @ViewChild('list') list!: ElementRef;
  @ViewChild('wrap') wrap!: ElementRef;
  onInput() {
    if(this.search.nativeElement.value.length != 0) {
      this.span.nativeElement.style.display = 'none';
      this.productName = from(this.data()).pipe(
        map((products) => {
          return products.title
        }),
        filter((product) => {
          return product.toLowerCase().includes(this.search.nativeElement.value.toLowerCase())
        }),
        toArray()
      );
      this.productName.subscribe({
        next:(data) => {
          if(data.length < 5) {
            this.list.nativeElement.style.height = `${data.length * 60}px`
          } else {
            this.list.nativeElement.style.height = '300px'
          }
        }
      })
    } else {
      this.productName = from(this.data()).pipe(
        map((products) => {
          return products.title;
        }),
        toArray()
      );
      this.list.nativeElement.style.height = '300px'
      this.span.nativeElement.style.display = 'block';
      this.product.emit('');
    }
  }

  onFocus() {
    if(this.search.nativeElement.value.length == 0) {
      this.productName = from(this.data()).pipe(
        map((products) => {
          return products.title
        }),
        toArray()
      );
      from(this.data()).pipe(
        map((products) => {
          return products.title
        }),
        toArray()
      ).subscribe({
        next:(data) => {
          if(data.length < 5) {
            this.list.nativeElement.style.height = `${data.length * 60}px`
          } else {
            this.list.nativeElement.style.height = '300px';
          }
        }
      })
    }
    this.wrap.nativeElement.style.display = 'block';
  }

  onBlur() {
    setTimeout(() => {
        this.wrap.nativeElement.style.display = 'none';
    },100)
  }

  product = output<string>()
  displayProduct(value: string) {
    this.search.nativeElement.value = value;
    this.span.nativeElement.style.display = 'none';
    this.product.emit(value)
  }
}
