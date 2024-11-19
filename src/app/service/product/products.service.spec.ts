import { TestBed } from '@angular/core/testing';

import { ProductsService } from './products.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ReciveData } from './products';
import 'zone.js';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ProductsService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should request get all Products', async () => {
    const products$ = service.getAllProducts();
    const productPromise = firstValueFrom(products$);
    const req = httpTesting.expectOne(
      'https://dummyjson.com/products?limit=0',
      'Request to get all products'
    );
    expect(req.request.method).toBe('GET');
    const reciveData = {
      products: [
        {
          id: '1',
          title: 'string',
          price: 100,
          discountPercentage: 10,
          rating: 4,
          stock: 7,
          tags: [''],
          brand: 'string',
          sku: 'string',
          weight: 5,
          dimensions: {
            width: 8,
            height: 8,
            depth: 8,
          },
          warrantyInformation: 'string',
          shippingInformation: 'string',
          availabilityStatus: 'string',
          reviews: [
            {
              rating: 3,
              comment: 'string',
              date: 'string',
              reviewerName: 'string',
              reviewerEmail: 'string',
            },
          ],
          returnPolicy: 'string',
          minimumOrderQuantity: 1,
          meta: {
            createdAt: 'string',
            updatedAt: 'string',
            barcode: 'string',
            qrCode: 'string',
          },
          images: [''],
          thumbnail: 'string',
          category: '',
          description: '',
          quantity: 2,
        },
      ],
      skip: 1,
      total: 1,
    };
    req.flush(reciveData);
    expect(await productPromise).toEqual(reciveData.products);
    httpTesting.verify();
  });

  it('should get categories', async () => {
    const category$ = service.categotriesLists();
    const categoriesPromise = firstValueFrom(category$);
    const request = httpTesting.expectOne(
      'https://dummyjson.com/products/category-list',
      'Requesting all the categories availables'
    );
    expect(request.request.method).toBe('GET');
    const recieveData = ['', ''];
    request.flush(recieveData);
    expect(await categoriesPromise).toEqual(recieveData);
  });

  it('sould return the product with matching id', async () => {
    const id = '1';
    const product$ = service.getProduct(id);
    const productPromise = firstValueFrom(product$);
    const request = httpTesting.expectOne(
      'https://dummyjson.com/products?limit=0',
      'Requesting the specific product with id'
    );
    expect(request.request.method).toBe('GET');
    const reciveData = {
      limit: 10,
      products:
        [
          {
          id: '1',
          title: 'string',
          price: 100,
          discountPercentage: 10,
          rating: 4,
          stock: 7,
          tags: [''],
          brand: 'string',
          sku: 'string',
          weight: 5,
          dimensions: {
            width: 8,
            height: 8,
            depth: 8,
          },
          warrantyInformation: 'string',
          shippingInformation: 'string',
          availabilityStatus: 'string',
          reviews: [
            {
              rating: 3,
              comment: 'string',
              date: 'string',
              reviewerName: 'string',
              reviewerEmail: 'string',
            },
          ],
          returnPolicy: 'string',
          minimumOrderQuantity: 1,
          meta: {
            createdAt: 'string',
            updatedAt: 'string',
            barcode: 'string',
            qrCode: 'string',
          },
          images: [''],
          thumbnail: 'string',
          category: '',
          description: '',
          quantity: 2,
        },
          {
          id: '4',
          title: 'string',
          price: 100,
          discountPercentage: 10,
          rating: 4,
          stock: 7,
          tags: [''],
          brand: 'string',
          sku: 'string',
          weight: 5,
          dimensions: {
            width: 8,
            height: 8,
            depth: 8,
          },
          warrantyInformation: 'string',
          shippingInformation: 'string',
          availabilityStatus: 'string',
          reviews: [
            {
              rating: 3,
              comment: 'string',
              date: 'string',
              reviewerName: 'string',
              reviewerEmail: 'string',
            },
          ],
          returnPolicy: 'string',
          minimumOrderQuantity: 1,
          meta: {
            createdAt: 'string',
            updatedAt: 'string',
            barcode: 'string',
            qrCode: 'string',
          },
          images: [''],
          thumbnail: 'string',
          category: '',
          description: '',
          quantity: 2,
        },
      ],
      skip: 1,
      total: 1,
    };
    const getProductWithId = (id: string, product:ReciveData) => {
      return product.products.find((product) => product.id == id);
    }
    const expectedResult = getProductWithId(id, reciveData)
    request.flush(reciveData);
    expect(await productPromise).toEqual(expectedResult);
  });
});
