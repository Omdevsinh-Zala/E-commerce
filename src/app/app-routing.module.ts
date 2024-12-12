import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductInfoComponent } from './product-info/product-info.component';
import { TitleService } from './service/title/title.service';
import { MainRouterComponent } from './main-router/main-router.component';
import { LoginComponent } from './form/login/login.component';
import { SignupComponent } from './form/signup/signup.component';
import { UpdateComponent } from './form/update/update.component';
import { ResetComponent } from './form/reset/reset.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'sign-up',
    component: SignupComponent,
  },
  {
    path: 'update-profile',
    component: UpdateComponent,
  },
  {
    path: 'login/update-password',
    component: ResetComponent,
  },
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainRouterComponent,
    children: [
      {
        path: 'products',
        loadChildren: () =>
          import('./main-pages/products/products.module').then(
            (m) => m.ProductsModule
          ),
        title: 'Products',
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./main-pages/cart/cart.module').then((m) => m.CartModule),
        title: 'Cart',
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./main-pages/home/home.module').then((m) => m.HomeModule),
        title: 'Home',
      },
      {
        path: 'products/:id',
        component: ProductInfoComponent,
        // title: TitleService
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
