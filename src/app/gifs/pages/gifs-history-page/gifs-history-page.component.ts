import { Component, computed, inject, input } from '@angular/core';
import { GifListItemComponent } from '../../components/gif-list/gif-list-item/gif-list-item.component';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gif.service';

@Component({
  selector: 'app-gifs-history-page',
  imports: [GifListItemComponent, GifListComponent],
  templateUrl: './gifs-history-page.component.html',
  styles: ``,
})
export default class GifsHistoryPageComponent {
  query = input.required<string>();

  gifService = inject(GifService);

  gifsByKey = computed(() => this.gifService.getHistoryGifs(this.query()));
}
