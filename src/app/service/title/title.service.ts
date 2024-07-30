import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ProductsService } from '../product/products.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  constructor(private product:ProductsService) { }
  resolve(router:ActivatedRouteSnapshot) {
    const id = router.paramMap.get('id');
    return this.product.getProduct(id).pipe(
      map((data) => {
        return `Products | ${data.title}`
      })
    )
  }
}
