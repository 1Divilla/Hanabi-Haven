import {
  component$,
  useStyles$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Footer } from "~/components/footer/footer";
import { Header } from "~/components/navbar/navbar";
import { getBookByDocumentId } from "~/lib/get-book-info";
import { getUserInfo } from "~/lib/get-user-info";
import styless from "~/styles/book.css?inline";
import type { Book } from "~/lib/interface/book";
import type { User } from "~/lib/interface/user";

export default component$(() => {
  useStyles$(styless);
  const loc = useLocation();
  const documentId = loc.params.documentId;
  const book = useSignal<Book | null>(null);
  const loading = useSignal(true);
  const strapiHost = useSignal("");
  const userInfo = useSignal<User | null>(null);
  const isAuthenticated = useSignal(false);
  const successMessage = useSignal("");
  const errorMessage = useSignal("");

  // Función para obtener la URL de la imagen
  const getImageUrl = (book: Book) => {
    if (book && book.coverImage && book.coverImage.url) {
      return strapiHost.value + book.coverImage.url;
    }
    return "/default_coverImage.webp";
  };

  // Cargar datos del libro
  useVisibleTask$(async () => {
    try {
      loading.value = true;
      strapiHost.value = import.meta.env.PUBLIC_STRAPI_HOST || "";

      // Verificar autenticación
      const token = localStorage.getItem("jwt");
      isAuthenticated.value = !!token;

      if (isAuthenticated.value) {
        const userData = await getUserInfo();
        if (userData) {
          userInfo.value = userData as User;
        }
      }

      // Obtener datos del libro
      const result = await getBookByDocumentId(documentId, "*");
      book.value = result && result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error al cargar el libro:", error);
      errorMessage.value =
        "Error al cargar el libro. Por favor, intenta de nuevo más tarde.";
    } finally {
      loading.value = false;
    }
  });
  return (
    <>
      <Header />
      <main class="book-detail-container">
        {loading.value ? (
          <div class="loading-container">
            <div class="spinner"></div>
            <p>Cargando información del libro...</p>
          </div>
        ) : book.value ? (
          <>
            {errorMessage.value && (
              <div class="error-message">{errorMessage.value}</div>
            )}
            {successMessage.value && (
              <div class="success-message">{successMessage.value}</div>
            )}

            <div class="book-header">
              <div class="book-cover-container">
                <img
                  src={getImageUrl(book.value)}
                  alt={`Portada de ${book.value.title}`}
                  class="book-cover"
                />
              </div>

              <div class="book-info-container">
                <h1 class="book-title">{book.value.title}</h1>

                <div class="book-meta">
                  <span class="book-type">{book.value.type}</span>
                  <span class="book-language">{book.value.language}</span>
                  <span class="book-status">{book.value.bookStatus}</span>
                </div>

                <div class="book-genres">
                  <div class="genres-list">
                    {book.value.genres && book.value.genres.length > 0 && (
                      book.value.genres.map((genre) => (
                        <span key={genre.id} class="genre-tag">
                          {genre.name}
                        </span>
                      ))
                    
                    )}
                  </div>
                </div>

                {book.value.author && (
                  <div class="book-author">
                    <span>Autor: {book.value.author}</span>
                  </div>
                )}

                <div class="book-stats">
                  <span class="book-views">
                    Vistas totales: {book.value.totalViews}
                  </span>
                </div>
              </div>
            </div>

            <div class="book-description">
              <h2>Descripción:</h2>
              <p>{book.value.description}</p>
            </div>

            <div class="book-chapters">
              <h2>Capítulos</h2>
              {book.value.chapters && book.value.chapters.length > 0 ? (
                <div class="chapters-grid">
                  {book.value.chapters
                    .slice()
                    .sort((a, b) => a.number - b.number)
                    .map((chapter) => (
                      <Link
                        key={chapter.id}
                        href={`/b/${book.value?.documentId}/c/${chapter.number}`}
                        class="chapter-card"
                      >
                        <div class="chapter-info">
                          <h3>Capítulo {chapter.number}</h3>
                          <p>{chapter.title}</p>
                          {chapter.publishedAt && (
                            <div class="chapter-meta">
                              <span>
                                Publicado:{" "}
                                {new Date(
                                  chapter.publishedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                </div>
              ) : (
                <div class="no-chapters">
                  <p>No hay capítulos disponibles para esta obra.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div class="not-found">
            <h2>Libro no encontrado</h2>
            <p>El libro que estás buscando no existe o no está disponible.</p>
            <Link href="/" class="back-button">
              Volver al inicio
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
});
