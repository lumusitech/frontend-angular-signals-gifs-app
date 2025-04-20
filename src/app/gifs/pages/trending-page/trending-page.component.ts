import { Component, signal } from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { Gif } from '../../interfaces/gif.interface';

const fakeGifs: Gif[] = [
  {
    id: '0',
    src: 'image.jpg',
    alt: 'test image',
  },
  {
    id: '1',
    src: 'image-1.jpg',
    alt: 'test image',
  },
  {
    id: '2',
    src: 'image-2.jpg',
    alt: 'test image',
  },
  {
    id: '3',
    src: 'image-3.jpg',
    alt: 'test image',
  },
  {
    id: '4',
    src: 'image-4.jpg',
    alt: 'test image',
  },
  {
    id: '5',
    src: 'image.jpg',
    alt: 'test image',
  },
  {
    id: '6',
    src: 'image-6.jpg',
    alt: 'test image',
  },
  {
    id: '7',
    src: 'image-7.jpg',
    alt: 'test image',
  },
  {
    id: '8',
    src: 'image-8.jpg',
    alt: 'test image',
  },
  {
    id: '9',
    src: 'image-9.jpg',
    alt: 'test image',
  },
  {
    id: '10',
    src: 'image-10.jpg',
    alt: 'test image',
  },
  {
    id: '11',
    src: 'image-11.jpg',
    alt: 'test image',
  },
];

@Component({
  selector: 'gifs-trending-page',
  imports: [GifListComponent],
  templateUrl: './trending-page.component.html',
  styles: ``,
})
export default class TrendingPageComponent {
  gifs = signal(fakeGifs);
}
