import { Component, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrl: './discount.component.scss'
})
export class DiscountComponent implements OnChanges {
  recentValue = input<string[]>();
  ngOnChanges(changes: SimpleChanges): void {
    this.radioForm.setValue(null);
    if (this.recentValue().length != 0 && this.recentValue()[1] != undefined) {
      let value = this.recentValue()[1] as unknown as string[]
      let index = this.disconts.findIndex((data) => {
        const lower = Number(data[0])
        const upper = Number(data[1]);
        return Number(value[0]) == lower && Number(value[1]) == upper
      })
      this.radioForm.setValue(this.disconts[index]);
    }
  }

  constructor(private router: Router, private route: ActivatedRoute) { }

  disconts: string[][] = [
    ['0', '10'],
    ['10', '20'],
    ['20', '30'],
    ['30', '40'],
    ['40', '50'],
    ['50', '60'],
    ['60', '70'],
    ['70', '80'],
    ['80', '90'],
    ['90', '100'],
  ]

  radioForm: FormControl = new FormControl();

  clearSignal = input<boolean>();

  temprarySignal = output<boolean>()
  ChangeDiscount(e: MatRadioChange) {
    this.router.navigate(['/products'], { queryParams: { discount: e.value }, queryParamsHandling: 'merge' });
    this.temprarySignal.emit(false);
  }

  clearDiscount() {
    this.radioForm.setValue(null);
        this.router.navigate([], { queryParams: { discount: null }, queryParamsHandling: 'merge' });
        this.temprarySignal.emit(false);
  }
}
