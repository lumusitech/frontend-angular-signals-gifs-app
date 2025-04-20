import { Component, input } from '@angular/core';

@Component({
  selector: 'app-gif-list-item',
  imports: [],
  templateUrl: './gif-list-item.component.html',
  styles: ``,
})
export class GifListItemComponent {
  title = input.required<string>();
  url = input.required<string>();
}
