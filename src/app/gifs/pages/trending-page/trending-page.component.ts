import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';

import { ScrollStateService } from 'src/app/shared/services/scroll-state.service';
import { GifService } from '../../services/gif.service';

@Component({
  selector: 'gifs-trending-page',
  // imports: [GifListComponent],
  templateUrl: './trending-page.component.html',
  styles: ``,
})
export default class TrendingPageComponent implements AfterViewInit {
  gifService = inject(GifService);
  scrollStateService = inject(ScrollStateService);

  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  constructor() {
    this.gifService.trendingGifsGroup();
  }

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;

    if (!scrollDiv) return;

    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
  }

  onScroll(e: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;

    if (!scrollDiv) return;

    const scrollTop = scrollDiv.scrollTop;
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeight = scrollDiv.scrollHeight;
    // Pixels before the bottom to trigger the infinite scroll
    // With this, you can adjust the distance from the bottom to trigger the infinite scroll
    const fireLoadingBefore = 300;

    const isAtBottom: boolean =
      scrollTop + clientHeight + fireLoadingBefore >= scrollHeight;

    // preserve the scroll position
    this.scrollStateService.trendingScrollState.set(scrollTop);

    if (isAtBottom) {
      this.gifService.loadTrendingGifs();
    }
  }
}
