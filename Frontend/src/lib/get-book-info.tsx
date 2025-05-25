import { query } from "./strapi";
import { isServer } from "@builder.io/qwik/build";

export function getBookInfo(id?: number, populate: string = "*") {
  if (isServer) {
    console.log("Estamos en el servidor, no en el navegador");
    return Promise.resolve([]);
  }
  
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
  const url = `books?filters[documentId][$eq]=${documentId}&populate=${populate}`;
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