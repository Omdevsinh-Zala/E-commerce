import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReciveData } from './products';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http:HttpClient) { }

  getAllProducts() {
    return this.http.get<ReciveData>('https://dummyjson.com/products?limit=0').pipe(
      map((products)=>{
        return products.products
      })
    );
  }

  categotriesLists() {
    return this.http.get<string[]>('https://dummyjson.com/products/category-list')
  }

  getProduct(id:string) {
    return this.http.get<ReciveData>('https://dummyjson.com/products?limit=0').pipe(
      map((data) => {
        return data.products.find((product) => {return product.id == id})
      })
    )
  }
}
