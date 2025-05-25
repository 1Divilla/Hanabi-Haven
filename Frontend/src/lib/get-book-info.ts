import { Book } from "./interface/book";
import { query } from "./strapi";
import { isServer } from "@builder.io/qwik/build";

export function getBookInfo(id?: number, populate: string = "*") {
  let url = "books";
  
  if (id) {
    url += `/${id}`;
  }
  
  url += `?populate=${populate}`;
  
  return query(url)
    .then(res => {
      if (res && res.data) {
        // Ensure we always return an array
        return Array.isArray(res.data) ? res.data : [res.data];
      }
      return [];
    })
    .catch(error => {
      console.error("Error al obtener información del libro:", error);
      return [];
    });
}

export function getBookByDocumentId(documentId: string, populate: string = "*") {
  if (!documentId) return Promise.resolve([]);
  const url = `books/${documentId}?populate=${populate}`;
  return query(url)
    .then(res => {
      if (res && res.data) {
        return Array.isArray(res.data) ? res.data : [res.data];
      }
      return [];
    })
    .catch(error => {
      console.error("Error al obtener libro por documentId:", error);
      return [];
    });
}

export function getBookByDocumentIdAndChapters(documentId: string, populate: string = "*") : Promise<Book | null> {
  if (!documentId) return Promise.resolve(null);
  const url = `books/${documentId}?${populate}`;
  console.log(url);
  return query(url)
    .then(res => res?.data || null)
    .catch(error => {
      console.error("Error al obtener libro por documentId:", error);
      return null;
    });
}