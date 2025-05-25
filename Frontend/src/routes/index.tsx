import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { getBookInfo } from "~/lib/get-book-info";
import { Header } from "~/components/navbar/navbar";
import { Footer } from "~/components/footer/footer";
import { FeaturedCarousel } from "~/components/featured-carousel/featured-carousel";
import type { Book } from "~/lib/interface/book";

export default component$(() => {
  const strapiHost = useSignal("");
  const books = useSignal<Book[]>([]);

  useTask$(async () => {
    try {
      strapiHost.value = import.meta.env.PUBLIC_STRAPI_HOST || "";
      const fetchedBooks = await getBookInfo(undefined, "coverImage");
      books.value = fetchedBooks;
    } catch (error) {
      console.error("Error al cargar los libros destacados:", error);
    }
  });

  const getImageUrl = (book: Book) => {
    if (book && book.coverImage && book.coverImage.url) {
      return strapiHost.value + book.coverImage.url;
    }
    return "/default_coverImage.webp";
  };

  return (
    <>
      <Header />
      <main>
        <FeaturedCarousel />
        <div class="grid-container">
          <h2 class="grid-slog">Últimos Lanzamientos</h2>

          {books.value.length === 0 ? (
            <div class="no-books">
              <p>No hay libros disponibles en este momento.</p>
            </div>
          ) : (
            <div class="books-grid">
              {books.value
                .slice()
                .filter((book) => book.createdAt)
                .sort((a, b) => {
                  const dateA = a.createdAt
                    ? new Date(a.createdAt).getTime()
                    : 0;
                  const dateB = b.createdAt
                    ? new Date(b.createdAt).getTime()
                    : 0;
                  return dateB - dateA;
                })
                .slice(0, 10)
                .map((book, index) => (
                  <Link
                    key={book.id || index}
                    href={`/b/${book.documentId}`}
                    class="grid-item"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div class="book-cover">
                      <img
                        src={getImageUrl(book)}
                        alt={`Portada de ${book.title}`}
                        loading="lazy"
                      />
                    </div>
                    <div class="book-info">
                      <h3 class="book-title">{book.title}</h3>
                      <div class="book-meta-tags">
                        <span class="book-type">{book.type}</span>
                        <span class="book-language">{book.language}</span>
                      </div>
                      {book.chapters && book.chapters.length > 0 && (
                        <div class="chapter-info">
                          <span class="chapter-number">
                            Capítulo{" "}
                            {book.chapters[book.chapters.length - 1].number}
                          </span>
                        </div>
                      )}
                      <div class="book-status-container">
                        <span class="book-status">{book.bookStatus}</span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
});

export const head: DocumentHead = {
  title: "Hanabi Haven - Read Novels and Manhwas Online",
  meta: [
    {
      name: "description",
      content:
        "Discover and read the best novels and manhwas online for free at Hanabi Haven. Your ultimate destination for quality web novels and manga content.",
    },
    {
      name: "keywords",
      content:
        "novels, manhwa, manga, web novels, light novels, online reading, free novels, Hanabi Haven",
    },
    {
      property: "og:title",
      content: "Hanabi Haven - Your Haven for the Best Stories",
    },
    {
      property: "og:description",
      content:
        "Read the best novels and manhwas online for free at Hanabi Haven.",
    },
  ],
};
