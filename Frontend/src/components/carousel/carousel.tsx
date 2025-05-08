import { component$, useSignal, useStylesScoped$, $ } from "@builder.io/qwik";
import styless from './carousel.css?inline';

interface CarouselProps {
    images: string[];
}

export const Carousel = component$<CarouselProps>(({ images }) => {
  useStylesScoped$(styless);
  
  const currentIndex = useSignal(0);

  return (
    <div class="carousel">
        {images.map((image, index) => (
        <div>
            <img 
            src={image} 
            alt={`Portada ${index + 1}`}
            class="cover-image"
            />
        </div>
        ))}
    </div>
  );
});
