import { server$ } from "@builder.io/qwik-city";


interface UserBasic {
  id: string;
  token: string;
}

export const putUserBookRead = server$(async function (
  bookId: string,
  chapterId: string,
  totalViews: number = 0,
  user?: UserBasic 
) {
  // Validaciones iniciales
  if (!user?.id || !user?.token) {
    throw new Error("Usuario no válido");
  }

  // Obtener variables de entorno
  const strapiHost = this.env.get("PUBLIC_STRAPI_HOST");
  const strapiToken = this.env.get("STRAPI_TOKEN_BOOK");
  let bookResponse = {}, userResponse= {};

  try {
    // Actualizar libro
    bookResponse = await fetch(`${strapiHost}/api/books/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${strapiToken}`,
      },
      body: JSON.stringify({
        data: { totalViews: totalViews + 1 } // Formato correcto para Strapi v5
      }),
    });

    // if (!bookResponse.ok) {
    //   throw new Error(`Error libro: ${bookResponse.statusText}`);
    // }
  } catch (error) {
    console.error("Error en putUserBookRead:", error);
    throw error;
  }
  try {
    // Actualizar usuario
    userResponse = await fetch(`${strapiHost}/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        data: { // Formato correcto para Strapi v5
          history: {
            register: {
              chapter: chapterId,
              date: new Date().toISOString(),
            },
          },
        },
      }),
    });

  } catch (error) {
    console.error("Error en putUserBookRead:", error);
    throw error;
  }
  return {
    book: await bookResponse.json(),  
    user: await userResponse.json(),
  };
});