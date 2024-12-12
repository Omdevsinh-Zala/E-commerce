import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ProductsService } from '../../service/product/products.service';
import { Products } from '../../service/product/products';
import { auditTime, filter, from, map, of, Subscription, toArray } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('main') main!: ElementRef;
  @ViewChild('spin') spin!: ElementRef;
  @ViewChild('secondary') secondary!: ElementRef;
  @ViewChild('more') more!: ElementRef;
  @ViewChild('maintable') maintable!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  productsData: Products[] = [];
  filteredData: Products[] = [];
  isFetched: boolean = false;
  isFiltered: boolean = false;
  fromFilter: boolean = false;
  isEmpty: boolean = false;
  products = new MatTableDataSource<Products>(this.productsData);
  column: string[] = ['Products'];
  fromDiscount: boolean = false;
  ChangeSignal: boolean = false;
  selectedValues!: string[];
  updatedProductsData: Products[] = [];
  searchedProduct: Products[] = [];
  isSearched: boolean = false;
  searchDataSource = new MatTableDataSource<Products>(this.searchedProduct);

  //for discount component
  clearDiscount: boolean = false;
  private runClear() {
    this.clearDiscount = !this.clearDiscount;
  }

  constructor(private api: ProductsService, private router: ActivatedRoute) {}

  auth = inject(UserService);

  ngOnInit(): void {
    this.selectOption();
    this.fetchData();
  }

  fetchData() {
    this.api.getAllProducts().subscribe(
      (data) => {
        this.productsData.push(...data);
      },
      (err) => {
        console.error(err);
      },
      () => {
        this.productsData.map((data) => {
          return data.category;
        });
        this.products = new MatTableDataSource<Products>(this.productsData);
        this.updatedProductsData = this.productsData;
        this.products.paginator = this.paginator;
        this.isFetched = true;
        this.filteringData();
      }
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.main.nativeElement.style.display = 'block';
      this.spin.nativeElement.style.display = 'none';
    }, 1500);
    this.products.paginator = this.paginator;
  }

  SignalChange(data: boolean) {
    this.ChangeSignal = data;
    this.filteringData();
  }

  private subscription!: Subscription;

  filteringData() {
    let option!: Params;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.router.queryParams.pipe(auditTime(0)).subscribe({
      next: (params) => {
        this.secondary.nativeElement.style.display = 'none';
        this.spin.nativeElement.style.display = 'block';
        if (params['Category'] && !params['discount'] && !params['sort']) {
          let category: string = params['Category'];
          this.categoryFiltering(category);
        } else if (
          !params['Category'] &&
          params['discount'] &&
          !params['sort']
        ) {
          let discount: string[] = params['discount'];
          this.discountFiltering(discount);
        } else if (
          !params['Category'] &&
          !params['discount'] &&
          params['sort']
        ) {
          this.sortFiltering(
            params['Category'],
            params['sort'],
            params['discount']
          );
        } else if (
          params['Category'] &&
          params['discount'] &&
          !params['sort']
        ) {
          this.withOutSort(params['Category'], params['discount']);
        } else if (
          params['Category'] &&
          !params['discount'] &&
          params['sort']
        ) {
          this.sortFiltering(
            params['Category'],
            params['sort'],
            params['discount']
          );
        } else if (
          !params['Category'] &&
          params['discount'] &&
          params['sort']
        ) {
          this.sortFiltering(
            params['Category'],
            params['sort'],
            params['discount']
          );
        } else if (params['Category'] && params['discount'] && params['sort']) {
          this.sortFiltering(
            params['Category'],
            params['sort'],
            params['discount']
          );
        } else if (
          !params['Category'] &&
          !params['discount'] &&
          !params['sort']
        ) {
          this.sortWithId();
        }
        setTimeout(() => {
          this.secondary.nativeElement.style.display = 'block';
          this.spin.nativeElement.style.display = 'none';
        }, 1000);
      },
    });
  }

  selectOption() {
    this.router.queryParams.subscribe({
      next: (params) => {
        this.selectedValues = [
          params['Category'],
          params['discount'],
          params['sort'],
        ];
      },
    });
  }

  //Only for category filtering
  categoryFiltering(category: string) {
    this.spin.nativeElement.style.display = 'block';
    this.secondary.nativeElement.style.display = 'none';
    this.runClear();
    let Data = from(this.productsData);
    Data.pipe(
      filter((products) => products.category === category),
      toArray()
    ).subscribe({
      next: (data) => {
        if (data.length == 0) {
          this.isEmpty = true;
        } else {
          this.isEmpty = false;
        }
        this.products = new MatTableDataSource<Products>(data);
        this.updatedProductsData = data;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.products.paginator = this.paginator;
        setTimeout(() => {
          this.secondary.nativeElement.style.display = 'block';
          this.spin.nativeElement.style.display = 'none';
        }, 1000);
      },
    });
  }

  //Only for discount filtering
  discountFiltering(discount: string[]) {
    this.spin.nativeElement.style.display = 'block';
    this.secondary.nativeElement.style.display = 'none';
    let data = from(this.productsData);
    data
      .pipe(
        filter(
          (products) =>
            products.discountPercentage > Number(discount[0]) &&
            products.discountPercentage < Number(discount[1])
        ),
        toArray()
      )
      .subscribe({
        next: (data) => {
          if (data.length == 0) {
            this.isEmpty = true;
          } else {
            this.isEmpty = false;
          }
          this.products = new MatTableDataSource<Products>(data);
          this.updatedProductsData = data;
          this.products.paginator = this.paginator;
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.filteredData = [];
          setTimeout(() => {
            this.secondary.nativeElement.style.display = 'block';
            this.spin.nativeElement.style.display = 'none';
          }, 1000);
        },
      });
  }

  // for sort filtering
  sortFiltering(category: string, sort: string[], discount: string[]) {
    this.spin.nativeElement.style.display = 'block';
    this.secondary.nativeElement.style.display = 'none';
    let data = of(this.productsData);
    if (category != null && discount == null) {
      data
        .pipe(
          map((products) => {
            return products.filter((product) => product.category === category);
          })
        )
        .subscribe((c) => (data = of(c)));
    } else if (category == null && discount != null) {
      data
        .pipe(
          map((products) => {
            return products.filter(
              (product) =>
                product.discountPercentage > Number(discount[0]) &&
                product.discountPercentage < Number(discount[1])
            );
          })
        )
        .subscribe((c) => (data = of(c)));
    } else if (category != null && discount != null) {
      data
        .pipe(
          map((products) => {
            return products.filter((product) => product.category === category);
          }),
          map((data) => {
            return data.filter(
              (product) =>
                product.discountPercentage > Number(discount[0]) &&
                product.discountPercentage < Number(discount[1])
            );
          })
        )
        .subscribe((c) => (data = of(c)));
    }
    if (sort[0] === 'asc') {
      switch (sort[1]) {
        case 'By-rating': {
          data
            .pipe(
              map((products) => {
                return products.sort((a, b) => {
                  return b.rating - a.rating;
                });
              })
            )
            .subscribe({
              next: (data) => {
                if (data.length == 0) {
                  this.isEmpty = true;
                } else {
                  this.isEmpty = false;
                }
                this.products = new MatTableDataSource<Products>(data);
                this.updatedProductsData = data;
              },
              error: (err) => {
                console.error(err);
              },
              complete: () => {
                this.products.paginator = this.paginator;
                setTimeout(() => {
                  this.secondary.nativeElement.style.display = 'block';
                  this.spin.nativeElement.style.display = 'none';
                }, 1000);
              },
            });
          break;
        }
        case 'By-price': {
          // let data = of(this.productsData);
          data
            .pipe(
              map((products) => {
                return products.sort((a, b) => {
                  return (
                    b.price -
                    b.price * (b.discountPercentage / 100) -
                    (a.price - a.price * (a.discountPercentage / 100))
                  );
                });
              })
            )
            .subscribe({
              next: (data) => {
                if (data.length == 0) {
                  this.isEmpty = true;
                } else {
                  this.isEmpty = false;
                }
                this.products = new MatTableDataSource<Products>(data);
                this.updatedProductsData = data;
              },
              error: (err) => {
                console.error(err);
              },
              complete: () => {
                this.products.paginator = this.paginator;
                setTimeout(() => {
                  this.secondary.nativeElement.style.display = 'block';
                  this.spin.nativeElement.style.display = 'none';
                }, 1000);
              },
            });
          break;
        }
        case 'By-discount': {
          // let data = of(this.productsData);
          data
            .pipe(
              map((products) => {
                return products.sort((a, b) => {
                  return b.discountPercentage - a.discountPercentage;
                });
              })
            )
            .subscribe({
              next: (data) => {
                if (data.length == 0) {
                  this.isEmpty = true;
                } else {
                  this.isEmpty = false;
                }
                this.products = new MatTableDataSource<Products>(data);
                this.updatedProductsData = data;
              },
              error: (err) => {
                console.error(err);
              },
              complete: () => {
                this.products.paginator = this.paginator;
                setTimeout(() => {
                  this.secondary.nativeElement.style.display = 'block';
                  this.spin.nativeElement.style.display = 'none';
                }, 1000);
              },
            });
          break;
        }
      }
    } else {
      switch (sort[1]) {
        case 'By-rating': {
          // let data = of(this.productsData);
          data
            .pipe(
              map((products) => {
                return products.sort((a, b) => {
                  return a.rating - b.rating;
                });
              })
            )
            .subscribe({
              next: (data) => {
                if (data.length == 0) {
                  this.isEmpty = true;
                } else {
                  this.isEmpty = false;
                }
                this.products = new MatTableDataSource<Products>(data);
                this.updatedProductsData = data;
              },
              error: (err) => {
                console.error(err);
              },
              complete: () => {
                this.products.paginator = this.paginator;
                setTimeout(() => {
                  this.secondary.nativeElement.style.display = 'block';
                  this.spin.nativeElement.style.display = 'none';
                }, 1000);
              },
            });
          break;
        }
        case 'By-price': {
          // let data = of(this.productsData);
          data
            .pipe(
              map((products) => {
                return products.sort((a, b) => {
                  return (
                    a.price -
                    a.price * (a.discountPercentage / 100) -
                    (b.price - b.price * (b.discountPercentage / 100))
                  );
                });
              })
            )
            .subscribe({
              next: (data) => {
                if (data.length == 0) {
                  this.isEmpty = true;
                } else {
                  this.isEmpty = false;
                }
                this.products = new MatTableDataSource<Products>(data);
                this.updatedProductsData = data;
              },
              error: (err) => {
                console.error(err);
              },
              complete: () => {
                this.products.paginator = this.paginator;
                setTimeout(() => {
                  this.secondary.nativeElement.style.display = 'block';
                  this.spin.nativeElement.style.display = 'none';
                }, 1000);
              },
            });
          break;
        }
        case 'By-discount': {
          // let data = of(this.productsData);
          data
            .pipe(
              map((products) => {
                return products.sort((a, b) => {
                  return a.discountPercentage - b.discountPercentage;
                });
              })
            )
            .subscribe({
              next: (data) => {
                if (data.length == 0) {
                  this.isEmpty = true;
                } else {
                  this.isEmpty = false;
                }
                this.products = new MatTableDataSource<Products>(data);
                this.updatedProductsData = data;
              },
              error: (err) => {
                console.error(err);
              },
              complete: () => {
                this.products.paginator = this.paginator;
                setTimeout(() => {
                  this.secondary.nativeElement.style.display = 'block';
                  this.spin.nativeElement.style.display = 'none';
                }, 1000);
              },
            });
          break;
        }
      }
    }
  }

  //for both Category and discount
  withOutSort(category: string, discount: string[]) {
    this.spin.nativeElement.style.display = 'block';
    this.secondary.nativeElement.style.display = 'none';
    let data = from(this.productsData);
    data
      .pipe(
        filter((products) => products.category === category),
        filter((product) => {
          return (
            product.discountPercentage > Number(discount[0]) &&
            product.discountPercentage < Number(discount[1])
          );
        }),
        toArray()
      )
      .subscribe({
        next: (data) => {
          this.products = new MatTableDataSource<Products>(data);
          this.updatedProductsData = data;
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.products.paginator = this.paginator;
          setTimeout(() => {
            this.secondary.nativeElement.style.display = 'block';
            this.spin.nativeElement.style.display = 'none';
          }, 1000);
        },
      });
  }

  //for non query
  sortWithId() {
    this.spin.nativeElement.style.display = 'block';
    this.secondary.nativeElement.style.display = 'none';
    let data = of(this.productsData);
    data
      .pipe(
        map((products) => {
          return products.sort((a, b) => {
            return Number(a.id) - Number(b.id);
          });
        })
      )
      .subscribe({
        next: (data) => {
          if (data.length == 0) {
            this.isEmpty = true;
          } else {
            this.isEmpty = false;
          }
          this.products = new MatTableDataSource<Products>(data);
          this.updatedProductsData = data;
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.products.paginator = this.paginator;
          setTimeout(() => {
            this.secondary.nativeElement.style.display = 'block';
            this.spin.nativeElement.style.display = 'none';
          }, 1000);
        },
      });
  }

  searchedProductName(value: string) {
    if (value.length == 0) {
      this.isSearched = false;
    } else {
      this.isSearched = true;
    }
    from(this.productsData)
      .pipe(
        filter((products) => {
          return products.title.toLowerCase() == value.toLowerCase();
        }),
        toArray()
      )
      .subscribe({
        next: (data) => {
          if (data.length != 0) {
            this.searchDataSource = new MatTableDataSource<Products>(data);
            this.searchDataSource.paginator = this.paginator;
          } else {
            this.isSearched = false;
          }
        },
      });
  }

  changePage() {
    this.maintable.nativeElement.style.display = 'none';
    this.spin.nativeElement.style.display = 'block';
    setTimeout(() => {
      this.maintable.nativeElement.style.display = 'block';
      this.spin.nativeElement.style.display = 'none';
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
