import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Swiper } from 'swiper/bundle'
import { ProductsService } from '../service/product/products.service';
import { Products } from '../service/product/products';
import { filter, from, toArray } from 'rxjs';
import { PreviousUrlService } from '../service/previousUrl/previous-url.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CartBadgeService } from '../service/cartBadge/cart-badge.service';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.scss'
})
export class ProductInfoComponent implements OnInit, AfterViewInit {
  @ViewChild('main') first!: ElementRef;
  @ViewChild('spin') spin!: ElementRef;

  constructor(private route: ActivatedRoute, private api: ProductsService, private url: PreviousUrlService,
    private router:Router
  ) { }

  productData!: Products
  images: string[] = []
  ratings: number = 0;
  productId: string = '0';
  allProducts: Products[] = [];

  ngOnInit(): void {
    this.api.getAllProducts().subscribe({
      next: (data) => {
        this.allProducts.push(...data);
      }
    })
    this.getProduct();
    console.warn = () => { };
    this.url.getPreviour();
    this.previousPage = this.url.previousPage;
    this.queryParams = this.url.queryParams;
  }

  ngAfterViewInit(): void {
    setTimeout(this.swiperInit, 800)
    setTimeout(() => {
      this.first.nativeElement.style.display = 'block';
      this.spin.nativeElement.style.display = 'none';
    }, 1000);
  }

  swiperInit() {
    const swiper = new Swiper('.firstSwiper', {
      // Optional parameters
      direction: 'horizontal',
      loop: true,
      autoplay: true,
      speed: 1000,
      effect: "coverflow",
      coverflowEffect: {
        depth: 30,
        rotate: 200,
        modifier: 1,
        stretch: 10
      },

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });

    const secondSwiper = new Swiper('.secondSwiper', {
      // Optional parameters
      direction: 'vertical',
      loop: true,
      autoplay: true,
      speed: 1000,


      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      }
    });
  }

  getProduct() {
    this.route.params.subscribe({
      next: (param) => {
        this.productId = param['id'];
        this.getProducts(this.productId);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getProducts(id: string) {
    this.api.getProduct(id).subscribe({
      next: (data) => {
        if (data) {
          this.productData = data;
          this.ratings = data.rating
        }
      },
      error: (err) => console.error(err),
      complete: () => {
        this.images = this.productData.images;
      }
    })
  }

  //For table
  show: boolean = false;
  filteredProducts: Products[] = []
  column: string[] = ['Data'];
  @ViewChild(MatPaginator) paginaotr!: MatPaginator;
  dataSource = new MatTableDataSource<Products>(this.filteredProducts);

  getRelatedProducts(tag: string) {
    from(this.allProducts).pipe(
      filter((products) => products.tags.includes(tag)),
      toArray()
    ).subscribe({
      next: (data) => {
        let index = data.findIndex((product) => product.id == this.productData.id);
        if (index != -1) {
          data.splice(index, 1)
        }
        this.filteredProducts = data;
        this.dataSource = new MatTableDataSource<Products>(this.filteredProducts);
      }, error: (err) => {
        console.error(err)
      },
      complete: () => {
        this.show = true;
        setTimeout(() => {
          this.dataSource.paginator = this.paginaotr;
          window.scrollTo(0, document.body.scrollHeight)
        }, 500)
      }
    })
  }

  //For add to cart functionality
  product: any[] = JSON.parse(localStorage.getItem('Cart') || '[]');
  count = inject(CartBadgeService);
  addToCart(data: Products, e: Event) {
    e.stopImmediatePropagation();
    this.count.addToCart(data);
  }

  //for previous page
  previousPage: string = '';
  queryParams!: Params;

  //for selected product to route
  newProduct(id: string) {
    this.router.navigate([`/products/${id}`]);
  }
}
