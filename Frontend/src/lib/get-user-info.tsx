import { query } from "./strapi";
import { isServer } from "@builder.io/qwik/build";

export function getUserInfo() {
  // Verificar explícitamente si estamos en el servidor
  if (isServer) {
    console.log("Estamos en el servidor, no en el navegador");
    return Promise.resolve(null);
  }
  
  // A partir de aquí, sabemos que estamos en el navegador
  const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
  
  if (token) {
    return query("users/me?populate=*", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        // Verificar la estructura de la respuesta
        if (res && res.data) {
          // Asegurarse de estructura correcta
          return res.data;
        } else if (res) {
          // Si res existe pero no tiene una propiedad data, devolver res directamente
          return res;
        }
        return null;
      })
      .catch(error => {
        console.error("Error al obtener información del usuario:", error);
        return null;
      });
  }
  
  console.log("No se encontró token en localStorage ni sessionStorage");
  return Promise.resolve(null);
}