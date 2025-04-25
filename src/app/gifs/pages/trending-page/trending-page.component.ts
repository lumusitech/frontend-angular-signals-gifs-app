import { Component, inject } from '@angular/core';

import { GifService } from '../../services/gif.service';

@Component({
  selector: 'gifs-trending-page',
  // imports: [GifListComponent],
  templateUrl: './trending-page.component.html',
  styles: ``,
})
export default class TrendingPageComponent {
  gifService = inject(GifService);

  constructor() {
    this.gifService.trendingGifsGroup();
  }
}
