import { Component, input, output } from '@angular/core';
import { Products } from '../../service/product/products';

@Component({
  selector: 'app-small-cards',
  templateUrl: './small-cards.component.html',
  styleUrl: './small-cards.component.scss',
})
export class SmallCardsComponent {
  data = input<Products>();
  signal = output<string>();
  emmit(id: string) {
    this.signal.emit(id);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 400);
  }
}
