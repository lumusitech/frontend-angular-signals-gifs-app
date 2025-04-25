import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { map, Observable, tap } from 'rxjs';
import { Gif } from '../interfaces/gif.interface';
import type { GiphyResponse } from '../interfaces/giphy.interface';
import { GifMapper } from '../mappers/gif.mapper';

const GIF_KEY = 'gifs';

@Injectable({
  providedIn: 'root',
})
export class GifService {
  private http = inject(HttpClient);
  private router = inject(Router);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  // [[gif,gif,gif],[gif,gif,gif],[gif,gif,gif],[gif,gif,gif],[gif,gif,gif]]
  trendingGifsGroup = computed<Gif[][]>(() => {
    const groups = this.groupArray(this.trendingGifs(), 3);
    console.log({ groups });
    return groups;
  });

  gifs = signal<Gif[]>([]);
  searchHistory = signal<Record<string, Gif[]>>(this.getFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();
  }

  saveGifsToLocalStorage = effect(() => {
    this.saveToLocalStorage(GIF_KEY, this.searchHistory());
  });

  groupArray(arreglo: Gif[], n: number): Gif[][] {
    const resultado: Gif[][] = [];
    for (let i = 0; i < arreglo.length; i += n) {
      const grupo = arreglo.slice(i, i + n);
      resultado.push(grupo);
    }
    return resultado;
  }

  loadTrendingGifs(): void {
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

  searchGifs(query: string): Observable<Gif[]> {
    return this.http
      .get<GiphyResponse>(`${environment.giphyBaseUrl}/gifs/search`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: '20',
          q: query,
        },
      })
      .pipe(
        map(({ data }) => data),
        map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

        // History
        tap((items) => {
          this.searchHistory.update((history) => ({
            [query.toLowerCase().trim()]: items,
            ...history,
          }));
        })
      );
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query.toLowerCase().trim()] ?? [];
  }

  private getFromLocalStorage(): Record<string, Gif[]> {
    const gifsFromLoacalStorage = localStorage.getItem(GIF_KEY) ?? '{}';

    try {
      const gifs: Record<string, Gif[]> = JSON.parse(gifsFromLoacalStorage);
      return gifs ?? {};
    } catch (error) {
      localStorage.removeItem(GIF_KEY);
      this.router.navigate(['dashboard']);
      return {};
    }
  }

  private saveToLocalStorage(key: string, gifs: Record<string, Gif[]>): void {
    localStorage.setItem(key, JSON.stringify(gifs));
  }
}
