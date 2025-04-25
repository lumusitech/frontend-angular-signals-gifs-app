# Gifs App - Angular 19 with signals

Temas practicados en este proyecto:

- LazyLoad

- Separación de rutas

- Rutas hijas

- Variables de entorno de Angular

- Angular CLI

- inputs

- Comunicación entre componentes

- RouterOutlets anidados

- Señales

- Propiedades de componentes

- Tailwind

- Manejo de rutas dinámicas

- Manejo de LocalStorage

- Observables a Señales

- Reutilización de componentes

- Peticiones HTTP

- Manejo de caché

- Mapeo de información

- Preservar estado del scroll

- Hacer scroll infinito

- Diseño masonry

- Técnicas y herramientas para depurar

## Scroll Infinito

```typescript
import { Component, ElementRef, inject, viewChild } from "@angular/core";

import { GifService } from "../../services/gif.service";

@Component({
  selector: "gifs-trending-page",
  // imports: [GifListComponent],
  templateUrl: "./trending-page.component.html",
  styles: ``,
})
export default class TrendingPageComponent {
  gifService = inject(GifService);

  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>("groupDiv");

  constructor() {
    this.gifService.trendingGifsGroup();
  }

  onScroll(e: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;

    if (!scrollDiv) return;

    const scrollTop = scrollDiv.scrollTop;
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeight = scrollDiv.scrollHeight;

    if (scrollTop + clientHeight >= scrollHeight) {
      console.log("load more gifs");
    }
  }
}
```

Explicación:

Estos tres elementos (scrollTop, clientHeight, scrollHeight) son fundamentales para implementar el scroll infinito en una página web. Entender cómo interactúan te permitirá detectar cuándo el usuario ha llegado (o está cerca) del final de un contenedor con scroll.
¡Claro! Estos tres elementos (scrollTop, clientHeight, scrollHeight) son fundamentales para implementar el scroll infinito en una página web. Entender cómo interactúan te permitirá detectar cuándo el usuario ha llegado (o está cerca) del final de un contenedor con scroll. Vamos a desglosarlos:

1. scrollTop:
   ¿Qué es? Representa la distancia vertical, en píxeles, que el contenido de un elemento ha sido desplazado hacia arriba desde su estado inicial.
   En otras palabras: Es la cantidad de contenido oculto en la parte superior del área visible del elemento debido al desplazamiento del scroll.
   Valor: Un número entero que indica la cantidad de píxeles desplazados. Si el scroll está en la parte superior, scrollTop será 0. A medida que el usuario hace scroll hacia abajo, este valor aumenta.
   Aplicación en el scroll infinito: Estarás monitoreando este valor para saber cuánto ha avanzado el usuario a través del contenido.
2. clientHeight:
   ¿Qué es? Representa la altura interior visible de un elemento en píxeles, incluyendo el padding pero excluyendo la barra de scroll (si está presente), el borde (border) y el margen (margin).
   En otras palabras: Es la altura del área que el usuario realmente ve del elemento.
   Valor: Un número entero que indica la altura en píxeles. Este valor es constante mientras el tamaño del viewport del elemento no cambie.
   Aplicación en el scroll infinito: Esta es la "ventana" a través de la cual el usuario ve el contenido.
3. scrollHeight:
   ¿Qué es? Representa la altura total del contenido de un elemento en píxeles, incluyendo la parte que actualmente no está visible debido al scroll. Incluye el padding, pero no el borde ni el margen.
   En otras palabras: Es la altura total de todo el contenido que podría ser mostrado si el usuario hiciera scroll hasta el final.
   Valor: Un número entero que indica la altura total en píxeles. Este valor será mayor o igual a clientHeight si el contenido excede el área visible y se necesita scroll.
   Aplicación en el scroll infinito: Esta es la "longitud total" del contenido que se puede desplazar.
   ¿Cómo se combinan para el scroll infinito?

La lógica principal detrás del scroll infinito es detectar cuándo el usuario está lo suficientemente cerca del final del contenido visible para que se dispare la carga de más elementos antes de que llegue al final absoluto. Esto se logra comparando estos tres valores.

Una condición común para disparar la carga de más contenido es cuando la suma del scrollTop (lo que ya se ha desplazado) y el clientHeight (lo que actualmente se ve) es mayor o igual a una cierta distancia del scrollHeight (la altura total).

Por ejemplo:

```JavaScript
const scrollDiv = document.getElementById('tuDivConScroll');
const umbral = 20; // Pixeles antes del final para cargar más

scrollDiv.addEventListener('scroll', () => {
  const scrollTop = scrollDiv.scrollTop;
  const clientHeight = scrollDiv.clientHeight;
  const scrollHeight = scrollDiv.scrollHeight;

  // Comprobamos si estamos cerca del final
  if (scrollTop + clientHeight >= scrollHeight - umbral) {
    // Aquí es donde llamas a tu función para cargar más datos de la API
    cargarMasElementos();
  }
});

function cargarMasElementos() {
  console.log('¡Cargando más elementos!');
  // Aquí iría tu lógica para hacer la petición a la API y añadir los nuevos elementos al DOM
}
```

Desglose de la condición scrollTop + clientHeight >= scrollHeight - umbral:

scrollTop + clientHeight: Representa la posición actual del borde inferior del área visible del contenedor. Es decir, cuánta distancia total se ha recorrido desde la parte superior hasta la parte inferior de la ventana visible.
scrollHeight - umbral: Representa un punto que está umbral píxeles antes del final absoluto del contenido.
Cuando la posición del borde inferior visible (scrollTop + clientHeight) alcanza o sobrepasa este umbral, significa que el usuario está a umbral píxeles o menos del final del contenido, y es el momento de cargar más elementos.

Consideraciones importantes:

Umbral: El valor del umbral es crucial. Si es demasiado pequeño, podrías hacer demasiadas llamadas a la API muy seguidas. Si es demasiado grande, el usuario podría llegar al final antes de que se carguen los nuevos elementos. Experimenta para encontrar un valor adecuado para tu aplicación.
Control de carga: Asegúrate de implementar un mecanismo para evitar múltiples llamadas a la API mientras se están cargando los datos. Puedes usar una bandera (boolean) para indicar si una carga está en curso.
Fin del contenido: Debes tener una forma de saber cuándo has cargado todos los elementos de la API para dejar de intentar cargar más.
Rendimiento: Cargar grandes cantidades de datos de golpe puede afectar el rendimiento. Considera cargar los datos en lotes razonables.
Experiencia del usuario: Proporciona alguna indicación visual (como un spinner o un mensaje) mientras se están cargando los nuevos elementos para que el usuario sepa que la aplicación está trabajando.
