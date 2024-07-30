import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CartCardComponent } from './cart-card/cart-card.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    CartComponent,
    CartCardComponent,
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    MatIconModule,
    MatBadgeModule,
    MatTableModule,
    MatPaginatorModule,
    SharedModule
  ]
})
export class CartModule { }
