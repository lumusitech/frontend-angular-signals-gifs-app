import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Gif } from '../interfaces/gif.interface';
import type { GiphyResponse } from '../interfaces/giphy.interface';
import { GifMapper } from '../mappers/gif.mapper';

interface HistorySearchItem {
  [key: string]: Gif[];
}

@Injectable({
  providedIn: 'root',
})
export class GifService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  historySearch = signal<HistorySearchItem[]>([]);
  searchResults = signal<Gif[]>([]);

  menuHistory = signal<string[]>([]);

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    this.http
      .get<GiphyResponse>(`${environment.giphyBaseUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: '20',
        },
      })
      .subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
      });
  }

  searchGifs(query: string) {
    const cleanQuery = query.trim().toLowerCase();

    // search in history
    if (this.isItemInHistory(cleanQuery)) {
      this.getFromHistory(cleanQuery);
      console.log('load from history');
    } else {
      // search in API
      this.http
        .get<GiphyResponse>(`${environment.giphyBaseUrl}/gifs/search`, {
          params: {
            api_key: environment.giphyApiKey,
            q: cleanQuery,
            limit: '20',
          },
        })
        .subscribe((resp) => {
          const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
          this.searchResults.set(gifs);

          // update history
          this.updateHistory(cleanQuery, gifs);
        });

      console.log('load from APi');
    }
  }

  // helpers

  private isItemInHistory(query: string): boolean {
    return this.historySearch().some((item) => item[query]);
  }

  private getFromHistory(query: string) {
    const historyItem = this.historySearch().find((item) => item[query])!;
    const gifsFromHistory = historyItem[query];

    this.searchResults.set(gifsFromHistory);
  }

  private updateHistory(query: string, gifs: Gif[]) {
    this.historySearch.update((history) => {
      // create new history item
      const newHistoryItem: HistorySearchItem = {
        [query]: gifs,
      };

      // add new history item at the top
      return [newHistoryItem, ...history].splice(0, 5); // keep last 5 items searched
    });

    // update menu history keys
    this.menuHistory.update(
      (history) => [query, ...history].splice(0, 5) // splice last 5 items searched
    );
  }
}
