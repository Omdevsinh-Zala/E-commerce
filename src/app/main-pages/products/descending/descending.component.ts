import {
  Component,
  input,
  OnChanges,
  output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';

@Component({
  selector: 'app-descending',
  templateUrl: './descending.component.html',
  styleUrl: './descending.component.scss',
})
export class DescendingComponent implements OnChanges {
  recentValue = input<string[]>();

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.descendingForm.setValue(null);
    if (this.recentValue().length != 0 && this.recentValue()[2] != undefined) {
      if (this.recentValue()[2][0] == 'des') {
        this.descendingForm.setValue(this.recentValue()[2][1]);
      }
    }
  }

  descendingCategory: string[] = ['By-rating', 'By-price', 'By-discount'];
  descendingForm: FormControl = new FormControl();

  clearSignal = input<boolean>();

  descendingValue = output<string>();

  temporarySignal = output<boolean>();
  changeDescendingValue(e: MatRadioChange) {
    this.router.navigate(['/products'], {
      queryParams: { sort: ['des', e.value] },
      queryParamsHandling: 'merge',
    });
    this.temporarySignal.emit(false);
    this.descendingValue.emit(e.value);
  }

  clearButton() {
    this.descendingForm.setValue(null);
    this.router.navigate([], {
      queryParams: { sort: null },
      queryParamsHandling: 'merge',
    });
  }
}
