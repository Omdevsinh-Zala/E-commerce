import { Injectable } from '@angular/core';
// import { NavigationEnd, Params, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PreviousUrlService {
  //   private previousUrl:string;
  //   private cureentUrl : string;
  //   constructor(private router:Router) {
  //     this.router.events.pipe(
  //     ).subscribe({
  //       next:(event) => {
  //         if(event instanceof NavigationEnd) {
  //           this.previousUrl = this.cureentUrl;
  //           this.cureentUrl = event.url;
  //         }
  //       }
  //     })
  //   }
  //   public getPreviousUrl(){
  //     return this.previousUrl;
  //   }
  //for previous page
  //   public previousPage: string = '';
  //   public queryParams!: Params;
  //   public getPreviour() {
  //     let wholeUrl = this.getPreviousUrl() || '';
  //     if (wholeUrl.includes('?')) {
  //       this.previousPage = wholeUrl.split('?')[0];
  //       let params = wholeUrl.split('?')[1];
  //       let array = params.split('&');
  //       let categoryvalue;
  //       let discountValue;
  //       let sortValue;
  // for category
  //   if (array.some((params) => params.split('=').includes('Category'))) {
  //     let categoryArray = array.filter((params) => params.includes('Category'));
  //     categoryvalue = categoryArray[0].split('=')[1];
  //   } else {
  //     categoryvalue = null;
  //   }
  //for discount
  //   if (array.some((params) => params.split('=').includes('discount'))) {
  //     let discountArray = array.filter((params) => params.includes('discount'));
  //     discountValue = [discountArray[0].split('=')[1], discountArray[1].split('=')[1]]
  //   } else {
  //     discountValue = null;
  //   }
  //for sort
  //   if (array.some((params) => params.split('=').includes('sort'))) {
  //     let sortArray = array.filter((params) => params.includes('sort'))
  //     sortValue = [sortArray[0].split('=')[1], sortArray[1].split('=')[1]];
  //   } else {
  //     sortValue = null
  //   }
  //   this.queryParams = {
  //     Category: categoryvalue,
  //     discount: discountValue,
  //     sort: sortValue
  //   };
  // } else {
  //   let url = wholeUrl;
  //   this.previousPage = url
  // this.queryParams = {
  //   Category: null,
  //   discount: null,
  //   sort: null
  // }
  // let index = url.lastIndexOf('/');
  // if(index > 3) {
  //   this.previousPage = url.split('/')[0];
  // } else {
  //   this.previousPage = url;
  // }
  //     }
  //   }
}
