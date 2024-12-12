import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SearchComponent } from '../search/search.component';
import { MatIcon } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [SearchComponent],
  imports: [CommonModule, MatIcon, MatOptionModule, AsyncPipe, RouterLink],
  exports: [SearchComponent],
})
export class SharedModule {}
