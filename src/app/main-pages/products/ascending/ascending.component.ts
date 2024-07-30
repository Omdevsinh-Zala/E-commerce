import { Component, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ascending',
  templateUrl: './ascending.component.html',
  styleUrl: './ascending.component.scss'
})
export class AscendingComponent implements OnChanges {
  recentValue = input<string[]>();
  constructor(private router:Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.ascendingForm.setValue(null)
    if (this.recentValue().length != 0 && this.recentValue()[2] != undefined) {
      if(this.recentValue()[2][0] == 'asc') {
        this.ascendingForm.setValue(this.recentValue()[2][1]);
      }
    }
  }

  ascendingGroup:string[] = [
    'By-rating',
    'By-price',
    'By-discount'
  ];

  ascendingForm:FormControl = new FormControl()

  closeSignal = input<boolean>()

  ascendingValue = output<string>();

  temporarySignal = output<boolean>();
  changeValue(e:MatRadioChange) {
    this.router.navigate(['/products'],{queryParams:{'sort':['asc',e.value]},queryParamsHandling:'merge'});
    this.temporarySignal.emit(false);
    this.ascendingValue.emit(e.value);
  }

  clearButton() {
    this.ascendingForm.setValue(null);
    this.router.navigate([], { queryParams: { sort: null }, queryParamsHandling: 'merge' });
  }
}
