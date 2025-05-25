import { query } from "./strapi";
import { isServer } from "@builder.io/qwik/build";

export function getCommentNotificationInfo(id?: number, populate: string = "*") {
  if (isServer) {
    console.log("Estamos en el servidor, no en el navegador");
    return Promise.resolve([]);
  }
  
  let url = "notifications";
  
  if (id) {
    url += `/${id}`;
  }
  
  url += `?populate=${populate}`;
  
  return query(url)
    .then(res => {
      if (res && res.data) {
        // Asegurarse de que siempre devolvemos un array
        return Array.isArray(res.data) ? res.data : [res.data];
      }
      return [];
    })
    .catch(error => {
      console.error("Error al obtener información de notification:", error);
      return [];
    });
}