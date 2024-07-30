import { Component, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { ProductsService } from '../../../service/product/products.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent implements OnInit, OnChanges {
  categories:string[] = []

  constructor(private api:ProductsService, private router:Router) {}

  ngOnInit(): void {
    this.getCategories();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.recentValue().length != 0 && this.recentValue()[0] != undefined) {
      this.categoryForm.setValue(this.recentValue()[0]);
    }
  }

  getCategories() {
    this.api.categotriesLists().subscribe((data) => {
      this.categories.push(...data);
    });
  }

  changedCategory = output<string>()
  temprarySignal = output<boolean>()

  categoryForm: FormControl = new FormControl();

  changeCategory(e:MatRadioChange) {
    this.temprarySignal.emit(false)
  }

  recentValue = input<string[]>();

  clearButton() {
    this.categoryForm.setValue(null);
    this.router.navigate([], { queryParams: { Category: null }, queryParamsHandling: 'merge' });
  }
}
