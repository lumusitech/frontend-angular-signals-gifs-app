import { Component, input } from '@angular/core';

import { Gif } from '../../interfaces/gif.interface';
import { GifListItemComponent } from './gif-list-item/gif-list-item.component';

@Component({
  selector: 'gifs-list',
  imports: [GifListItemComponent],
  templateUrl: './gif-list.component.html',
  styles: ``,
})
export class GifListComponent {
  gifs = input.required<Gif[]>();
}
