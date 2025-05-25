import { component$, useStylesScoped$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { getBookInfo } from "~/lib/get-book-info";
import styless from "./featured-carousel.css?inline";
import type { Book } from "~/lib/interface/book";

export const FeaturedCarousel = component$(() => {
  useStylesScoped$(styless);
  
  const featuredBooks = useSignal<Book[]>([]);
  const currentIndex = useSignal(0);
  const isLoading = useSignal(true);
  const strapiHost = useSignal("");
  const autoplayEnabled = useSignal(true);
  
  // Función para obtener los libros destacados
  useVisibleTask$(async () => {
    try {
      isLoading.value = true;
      strapiHost.value = import.meta.env.PUBLIC_STRAPI_HOST || "";
      const books = await getBookInfo(undefined, "coverImage");
      // Filtrar solo los libros con featured = true
      featuredBooks.value = books.filter((book: Book) => book.featured);
      console.log("Libros cargados:", featuredBooks.value.length);
    } catch (error) {
      console.error("Error al cargar los libros destacados:", error);
    } finally {
      isLoading.value = false;
    }
  });
  
  // Configurar el cambio automático de slides en una tarea separada
  useVisibleTask$(({ cleanup }) => {
    console.log("Configurando autoplay, libros:", featuredBooks.value.length);
    
    // Función para cambiar de slide
    const changeSlide = () => {
      if (featuredBooks.value.length > 1 && autoplayEnabled.value) {
        console.log("Cambiando slide de", currentIndex.value, "a", (currentIndex.value + 1) % featuredBooks.value.length);
        currentIndex.value = (currentIndex.value + 1) % featuredBooks.value.length;
      }
    };
    
    // Configurar intervalo solo si hay más de un libro
    const intervalId = setInterval(changeSlide, 5000); // Cambiar cada 5 segundos
    
    // Limpiar el intervalo cuando el componente se desmonte
    cleanup(() => {
      console.log("Limpiando intervalo");
      clearInterval(intervalId);
    });
    
    // Detener autoplay cuando la ventana pierde el foco
    const handleVisibilityChange = () => {
      autoplayEnabled.value = document.visibilityState === "visible";
      console.log("Visibilidad cambiada:", autoplayEnabled.value);
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    cleanup(() => document.removeEventListener("visibilitychange", handleVisibilityChange));
  });
  
  // Función para obtener la URL de la imagen
  const getImageUrl = (book: Book) => {
    if (book && book.coverImage && book.coverImage.url) {
      return strapiHost.value + book.coverImage.url;
    }
    return "/default_coverImage.webp";
  };

  return (
    <section class="featured-carousel">
      {isLoading.value ? (
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Cargando obras destacadas...</p>
        </div>
      ) : featuredBooks.value.length > 0 ? (
        <div class="carousel-container">
          <div class="carousel-content">
            {featuredBooks.value.map((book, index) => (
              <div 
                key={book.id} 
                class={`carousel-item ${index === currentIndex.value ? 'active' : ''}`}
                style={index === currentIndex.value ? 'display: flex;' : 'display: none;'}
              >
                <div class="book-cover">
                  <img 
                    src={getImageUrl(book)} 
                    alt={`Portada de ${book.title}`} 
                    loading="lazy"
                  />
                </div>
                <div class="book-info">
                  <h3>{book.title}</h3>
                  <p>
                    <span class="book-type">{book.type}</span>
                    <span class="book-language">{book.language}</span>
                  </p>
                  {book.author && <p class="book-author">Por: {book.author}</p>}
                  <p class="book-description">{book.description}</p>
                  <div class="book-meta">
                    <span class="book-status">{book.bookStatus}</span>
                    <span class="book-views">Views {book.totalViews}</span>
                  </div>
                  <a href={`/book/${book.documentId}`} class="read-button">Leer ahora</a>
                </div>
              </div>
            ))}
          </div>
          
          <div class="carousel-indicators">
            {featuredBooks.value.map((_, index) => (
              <span 
                key={index} 
                class={`indicator ${index === currentIndex.value ? 'active' : ''}`}
                onClick$={() => currentIndex.value = index}
              ></span>
            ))}
          </div>
        </div>
      ) : (
        <div class="no-featured">
          <p>No hay obras destacadas disponibles en este momento.</p>
        </div>
      )}
    </section>
  );
});