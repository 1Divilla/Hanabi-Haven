import {
  component$,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Footer } from "~/components/footer/footer";
import { Header } from "~/components/navbar/navbar";
import { getBookByDocumentIdAndChapters } from "~/lib/get-book-info";
import { getChapterInfo } from "~/lib/get-chapter-info";
import { getUserInfo } from "~/lib/get-user-info";
import { User } from "~/lib/interface/user";
import type { Book } from "~/lib/interface/book";
import type { Chapter } from "~/lib/interface/chapter";
import styless from "~/styles/chapter.css?inline";
import { routeLoader$ } from '@builder.io/qwik-city';
import { NavigationButtons } from "~/components/chapter/NavigationButton";
import { putUserBookRead } from "~/lib/put-user-book-read";

export const useChapterLoader = routeLoader$(async ({ params, redirect, fail }) => {
  try {
    const populateFields = [
        'chapters',
        'chapters.imageContent',
    ];

    const populateParams = populateFields.map((field, index) => `populate[${index}]=${field}`);

    const chapterNumber = Number(params.number);

    const paramsStrapi = [
      `filters[chapters][number][$eq]=${encodeURIComponent(chapterNumber)}`,
      ...populateParams
    ].join('&');

    const documentId = params.documentId;
    
    // Fetch libro
    const book = await getBookByDocumentIdAndChapters(documentId, paramsStrapi);
    if (!book) throw new Error('Libro no encontrado');

    // Buscar capítulo
    const chapter = book.chapters?.find(ch => ch.number === chapterNumber);
    if (!chapter) throw new Error('Capítulo no existe');
    
    return {
      book: book as Book,
      chapter: chapter as Chapter,
      navigation: {
        prev: book.chapters?.find(ch => ch.number === chapterNumber - 1)?.number as number || -1,
        next: book.chapters?.find(ch => ch.number === chapterNumber + 1)?.number as number || -1
      }
    };
  } catch (error) {
    console.error('Loader Error:', error);
    redirect(308, '/error');
    return {};
  }
});

export default component$(() => {
  useStyles$(styless);
  const strapiHost = useSignal(import.meta.env.PUBLIC_STRAPI_HOST || "");
  const loc = useLocation();
  const { book, chapter, navigation } = useChapterLoader().value;
  const { prev, next } = navigation || { prev: -1, next: -1 };

useVisibleTask$(async ({ track }) => {
  track(() => loc.url.pathname);
  const token = localStorage.getItem("jwt");
  track(() => token);
  
  if (token) { // Asegurar que token no es null
    const user = await getUserInfo();
    if (user?.documentId) { // Verificar que user y documentId existen
      const userP = {
        id: user.id,
        token: token // token es string aquí porque está dentro del if
      };
      
      putUserBookRead(
        book?.documentId as string, 
        chapter?.documentId as string,
        book?.totalViews, 
        userP
      ).then();
    }
  }
});

  return (
    <>
      <Header />
      <main class="chapter-container">
        <div class="chapter-header">
          <div class="book-info">
            <h1 class="book-title">{book?.title}</h1>
            <h2 class="chapter-title">
              Capítulo {chapter?.number}: {chapter?.title}
            </h2>
          </div>
          <div class="chapter-navigation">
            <NavigationButtons prev={prev} next={next} documentId={book?.documentId as string}/>
          </div>
        </div>
        
        <div class="chapter-content">
          {book?.type === "novel" ? (
            <div class="text-content">
              {chapter?.textContent?.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <div class="image-content">
              {chapter?.imageContent?.map((image, index) => (
                <div key={index} class="manga-page">
                  <img src={strapiHost.value + image.url} alt={`Página ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div class="chapter-footer">
          <NavigationButtons prev={prev} next={next} documentId={book?.documentId as string}/>
        </div>
      </main>
      <Footer />
    </>
  );
});
