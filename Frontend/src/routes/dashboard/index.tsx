import {
  $,
  component$,
  noSerialize,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Footer } from "~/components/footer/footer";
import { Header } from "~/components/navbar/navbar";
import { User } from "~/lib/interface/user";
import { getUserInfo } from "~/lib/get-user-info";
import { getBookInfo } from "~/lib/get-book-info";
import styless from "~/styles/dashboard.css?inline";
import { uploadMultipleOrSingleAction } from "~/lib/uploadMultipleOrSingleAction";

export default component$(() => {
  useStylesScoped$(styless);
  const userInfo = useSignal<User>({} as User);
  const strapiHost = useSignal(import.meta.env.PUBLIC_STRAPI_HOST || "");
  const activeTab = useSignal("my-works");
  const activeWorksBox = useSignal("all");
  const isAuthenticated = useSignal(false);
  const imagePreview = useSignal("");
  const selectedFile = useSignal<ReturnType<typeof noSerialize<File>> | null>(
    null
  );
  const uploadingImage = useSignal(false);
  const uploadError = useSignal<string | null>(null);
  const uploadSuccess = useSignal<string | null>(null);
  const bookData = useSignal<any[]>([]);
  const selectedBook = useSignal<any>(null);
  const isOperationInProgress = useSignal(false);

  const handleImageChange = $((event: any) => {
    const file = event.target.files[0];
    if (file) {
      selectedFile.value = noSerialize(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  });

  const handleUploadCoverImage = $(async () => {
    if (!selectedFile.value) {
      alert("Por favor, selecciona una imagen");
      return null;
    }

    try {
      uploadingImage.value = true;
      uploadError.value = null;
      uploadSuccess.value = null;

      const img = new Image();
      img.src = imagePreview.value;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const formData = new FormData();
      formData.append("files", selectedFile.value);

      const rawTitle =
        (document.getElementById("title") as HTMLInputElement)?.value || "";

      const sanitizedTitle = rawTitle
        .substring(0, 25)
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "")
        .toLowerCase();

      const uniqueFileName = `${sanitizedTitle}_${Date.now()}_coverImage`;

      const result = await uploadMultipleOrSingleAction(
        formData,
        uniqueFileName
      );

      if (result.uploadError) {
        console.error("Error al subir imagen:", result.uploadError);
        uploadError.value = result.uploadError;
        return null;
      }

      uploadSuccess.value = result.uploadSuccess || null;
      console.log("Imagen subida exitosamente:", result.data);

      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        return result.data[0].id;
      }

      return null;
    } catch (error) {
      console.error("Error en el proceso de subida de imagen:", error);
      uploadError.value = (error as Error).message;
      return null;
    } finally {
      uploadingImage.value = false;
    }
  });

  const handleNewWork = $(async (event: any) => {
    event.preventDefault();
    try {
      const token =
        localStorage.getItem("jwt") || sessionStorage.getItem("jwt");

      if (!token) {
        console.error("No se encontró token de autenticación");
        alert("No estás autenticado");
        return;
      }

      const updateData: any = {
        title: (document.getElementById("title") as HTMLInputElement)?.value,
        author: (document.getElementById("author") as HTMLInputElement)?.value,
        description: (
          document.getElementById("description") as HTMLTextAreaElement
        )?.value,
        bookStatus: (document.getElementById("status") as HTMLSelectElement)
          .value,
        language: (document.getElementById("language") as HTMLSelectElement)
          .value,
        type: (document.getElementById("type") as HTMLSelectElement).value,
        users_permissions_user: userInfo.value.id,
      };

      updateData.coverImage = 225;
      let uploadedImageId = null;

      if (selectedFile.value) {
        uploadedImageId = await handleUploadCoverImage();

        if (!uploadedImageId) {
          alert(
            "No se pudo subir la imagen de portada. La imagen es obligatoria para crear una obra."
          );
          return;
        } else {
          updateData.coverImage = uploadedImageId;
        }
      } else {
        alert("Por favor selecciona una imagen de portada");
        return;
      }

      if (Object.keys(updateData).length > 0) {
        try {
          const userResponse = await fetch(`${strapiHost.value}/api/books`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: updateData }),
            cache: "no-cache",
          });

          if (!userResponse.ok) {
            console.error("Error en respuesta de Strapi:", userResponse.status);
            const errorText = await userResponse
              .text()
              .catch((e) => "No se pudo leer el cuerpo del error");

            try {
              const errorJson = JSON.parse(errorText);
              console.error(
                "Detalles completos del error:",
                JSON.stringify(errorJson, null, 2)
              );

              if (errorJson.error && errorJson.error.message) {
                alert(`Error: ${errorJson.error.message}`);
              } else if (
                errorJson.error &&
                errorJson.error.details &&
                errorJson.error.details.errors
              ) {
                const errorMessages = errorJson.error.details.errors
                  .map((err: any) => `${err.path.join(".")}: ${err.message}`)
                  .join("\n");
                alert(`Errores de validación:\n${errorMessages}`);
                console.error(
                  "Errores específicos:",
                  errorJson.error.details.errors
                );
              } else {
                alert(`Error al crear obra: ${userResponse.status}`);
              }
              return;
            } catch (e) {
              console.error("Error al procesar respuesta de error:", e);
              alert(`Error al crear obra: ${userResponse.status}`);
              return;
            }
          } else {
            console.log("Obra creada exitosamente");
            alert("Obra creada exitosamente");
          }

          // Actualizar la lista de libros
          const books = await getBookInfo();
          if (books) {
            bookData.value = Array.isArray(books) ? books : [];
          }

          // Limpiar el formulario
          (document.getElementById("title") as HTMLInputElement).value = "";
          (
            document.getElementById("description") as HTMLTextAreaElement
          ).value = "";
          (document.getElementById("author") as HTMLInputElement).value = "";
          imagePreview.value = "";
          selectedFile.value = null;
        } catch (fetchError) {
          console.error("Error en fetch:", fetchError);
          throw fetchError;
        }
      }
    } catch (error) {
      console.error("Error general al crear obra:", error);
      alert("Error al crear la nueva obra. Por favor, inténtalo de nuevo.");
    }
  });

  const handleNewChapter = $(async (event: any) => {
    event.preventDefault();

    // Verificar si ya hay una operación en curso
    if (isOperationInProgress.value) {
      console.log("[DEBUG] Operación en curso, evitando duplicación");
      return;
    }

    // Establecer la bandera de operación en curso
    isOperationInProgress.value = true;

    try {
      const token =
        localStorage.getItem("jwt") || sessionStorage.getItem("jwt");

      if (!token) {
        console.error("No se encontró token de autenticación");
        alert("No estás autenticado");
        isOperationInProgress.value = false; // Restablecer bandera
        return;
      }

      const chapterData: any = {
        title:
          (document.getElementById("chapterTitle") as HTMLInputElement).value ||
          selectedBook.value.title,
        number: parseFloat(
          (document.getElementById("chapterNumber") as HTMLInputElement).value
        ),
        book: selectedBook.value.id,
      };

      if (
        selectedBook.value.type === "novel"
      ) {
        //CAPITULO POR TEXTO
        chapterData.textContent = (
          document.getElementById("chapterContent") as HTMLTextAreaElement
        ).value;
      } else {
        const fileInput = document.getElementById(
          "chapterImages"
        ) as HTMLInputElement;
        if (!fileInput.files || fileInput.files.length === 0) {
          alert("Por favor, selecciona al menos una imagen para el capítulo");
          return;
        }

        const formData = new FormData();
        Array.from(fileInput.files).forEach((file) => {
          formData.append("files", file);
        });

        const result = await uploadMultipleOrSingleAction(
          formData,
          `chapter_${selectedBook.value.id}_${chapterData.number}`
        );

        if (result.uploadError) {
          console.error(
            "Error al subir imágenes del capítulo:",
            result.uploadError
          );
          alert(`Error al subir imágenes: ${result.uploadError}`);
          return;
        }

        console.log("Resultado de subida de imágenes:", result);
        if (
          result.data &&
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          chapterData.imageContent = result.data.map((page: any) => page.id);
          console.log("IDs de imágenes asignados:", chapterData.imageContent);
        }
      }
      try {
        console.log(
          "Estructura completa de datos a enviar:",
          JSON.stringify({ data: chapterData }, null, 2)
        );
        const response = await fetch(`${strapiHost.value}/api/chapters`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: chapterData }),
        });

        if (!response.ok) {
          console.error("Error en respuesta de Strapi:", response.status);
          const errorData = await response.json();
          console.error("Detalles del error:", errorData);
          isOperationInProgress.value = false; // Restablecer bandera en caso de error
          throw new Error(
            errorData.error?.message || "Error al crear el capítulo"
          );
        }

        document.getElementById("newChapterModal")?.classList.remove("show");
        (document.getElementById("chapterTitle") as HTMLInputElement).value =
          "";
        (document.getElementById("chapterNumber") as HTMLInputElement).value =
          "";
        if (document.getElementById("chapterContent")) {
          (
            document.getElementById("chapterContent") as HTMLTextAreaElement
          ).value = "";
        }
        if (document.getElementById("chapterImages")) {
          (document.getElementById("chapterImages") as HTMLInputElement).value =
            "";
        }

        alert("Capítulo creado exitosamente");

        const updatedBookData = await getBookInfo();
        if (updatedBookData) {
          bookData.value = Array.isArray(updatedBookData)
            ? updatedBookData
            : [];
          const updatedBook = bookData.value.find(
            (book: any) => book.id === selectedBook.value.id
          );
          if (updatedBook) {
            selectedBook.value = updatedBook;
          }
        }

        // Restablecer la bandera de operación en curso después de completar
        isOperationInProgress.value = false;
      } catch (error) {
        console.error("Error al crear capítulo:", error);
        alert("Error al crear el capítulo: " + (error as Error).message);
        // Restablecer la bandera de operación en curso en caso de error
        isOperationInProgress.value = false;
      }
    } catch (error) {
      console.error("Error general al crear capítulo:", error);
      alert("Error al crear el capítulo: " + (error as Error).message);
      // Restablecer la bandera de operación en curso en caso de error general
      isOperationInProgress.value = false;
    }
  });

  const handleDeleteChapter = $(async (documentId: string) => {
    if (
      !confirm(
        "¿Estás seguro de que deseas eliminar este capítulo? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      const token =
        localStorage.getItem("jwt") || sessionStorage.getItem("jwt");

      if (!token) {
        alert("No estás autenticado");
        return;
      }
      
      const response = await fetch(
        `${strapiHost.value}/api/chapters/${documentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Error al eliminar el capítulo"
        );
      }

      alert("Capítulo eliminado exitosamente");

      // Actualizar la lista de libros para reflejar los cambios
      const updatedBookData = await getBookInfo();
      if (updatedBookData) {
        bookData.value = Array.isArray(updatedBookData) ? updatedBookData : [];
        const updatedBook = bookData.value.find(
          (book: any) => book.id === selectedBook.value.id
        );
        if (updatedBook) {
          selectedBook.value = updatedBook;
        }
      }
    } catch (error) {
      alert("Error al eliminar el capítulo: " + (error as Error).message);
    }
  });

  const handleBookClick = $((book: any) => {
    selectedBook.value = book;
    if (book.type === "novel" || book.type === "light novel") {
      activeWorksBox.value = "textChapter";
    } else {
      activeWorksBox.value = "imageChapter";
    }
  });

  const setActiveTab = $((tab: string) => {
    activeTab.value = tab;
    if (tab === "my-works") {
      activeWorksBox.value = "all";
    }
  });

  useVisibleTask$(async () => {
    strapiHost.value = import.meta.env.PUBLIC_STRAPI_HOST || "";

    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
    isAuthenticated.value = !!token;

    if (token) {
      const userData = await getUserInfo();
      const books = await getBookInfo();
      if (userData) {
        userInfo.value = userData as User;
      }
      if (books) {
        bookData.value = Array.isArray(books) ? books : [];
      } else {
        bookData.value = [];
      }
    }
  });

  return (
    <>
      <Header />
      <main>
        <div class="dashboard-container">
          <nav class="dashboard-sidebar">
            <div class="user-card">
              <img
                class="profile-avatar"
                src={
                  userInfo.value?.avatar?.url
                    ? strapiHost.value + userInfo.value?.avatar?.url
                    : "/default_icon.webp"
                }
                alt="avatar"
              />
              <div class="user-meta">
                <h2 class="username">
                  {userInfo.value?.username || "Usuario"}
                </h2>
              </div>
            </div>
            <ul class="dashboard-nav">
              <li class="nav-item">
                <button
                  class={`nav-link ${activeTab.value === "my-works" ? "active" : ""}`}
                  onClick$={() => setActiveTab("my-works")}
                  aria-current={
                    activeTab.value === "my-works" ? "page" : undefined
                  }
                >
                  <span class="nav-text">Mis Obras</span>
                </button>
              </li>
              <li class="nav-item">
                <button
                  class={`nav-link ${activeTab.value === "new-works" ? "active" : ""}`}
                  onClick$={() => setActiveTab("new-works")}
                >
                  <span class="nav-text">Nueva Obra</span>
                </button>
              </li>
            </ul>
          </nav>
          <div class="content-box">
            {activeTab.value === "my-works" && (
              <div class="my-works-box">
                {activeWorksBox.value === "all" && (
                  <div class="books-grid">
                    {bookData.value?.filter(
                      (book: any) =>
                        book.users_permissions_user?.id === userInfo.value.id
                    ).length === 0 ? (
                      <div class="no-books-message">
                        <h3>No tienes obras publicadas</h3>
                        <p>
                          ¡Comienza a crear tu primera obra haciendo clic en la
                          pestaña "Nueva Obra"!
                        </p>
                      </div>
                    ) : (
                      bookData.value
                        ?.filter(
                          (book: any) =>
                            book.users_permissions_user?.id ===
                            userInfo.value.id
                        )
                        .map((book: any) => (
                          <div
                            key={book.id}
                            class="book-card"
                            onClick$={() => handleBookClick(book)}
                            role="button"
                            tabIndex={0}
                            style="cursor: pointer;"
                          >
                            <img
                              src={
                                book.coverImage?.url
                                  ? strapiHost.value + book.coverImage.url
                                  : "/default_coverImage.webp"
                              }
                              alt={book.title}
                            />
                            <div class="book-info">
                              <h3>{book.title}</h3>
                              <div class="book-meta">
                                <span>Estado: {book.bookStatus}</span>
                                <span>Tipo: {book.type}</span>
                                <span>Idioma: {book.language}</span>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                )}
                {activeWorksBox.value === "textChapter" && (
                  <div class="text-chapter-view">
                    {selectedBook.value ? (
                      <>
                        <div class="chapter-header">
                          <h3 class="section-title">
                            {selectedBook.value.title}
                          </h3>
                          <div class="btn-actions">
                            <button
                              class="back-button"
                              onClick$={() => (activeWorksBox.value = "all")}
                            >
                              <i class="fas fa-arrow-left"></i> Volver
                            </button>
                            <button
                              class="add-chapter-button"
                              onClick$={() =>
                                document
                                  .getElementById("newTextChapterModal")
                                  ?.classList.add("show")
                              }
                            >
                              <i class="fas fa-plus"></i> Añadir nuevo capítulo
                            </button>
                          </div>
                        </div>
                        <div class="chapter-list">
                          {selectedBook.value.chapters &&
                          selectedBook.value.chapters.length > 0 ? (
                            <div class="chapters-grid">
                              {selectedBook.value.chapters.map(
                                (chapter: any) => (
                                  <div key={chapter.id} class="chapter-card">
                                    <div class="chapter-info">
                                      <h3>Capítulo {chapter.number}</h3>
                                      <p>{chapter.title}</p>
                                      <div class="chapter-meta">
                                        <span>
                                          Publicado:{" "}
                                          {new Date(
                                            chapter.publishedAt
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <div class="chapter-actions">
                                        <button
                                          class="delete-button"
                                          onClick$={() =>
                                            handleDeleteChapter(chapter.documentId)
                                          }
                                        >
                                          Eliminar
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <div class="no-chapters">
                              <p>
                                No hay capítulos disponibles para esta obra.
                              </p>
                              <p>
                                ¡Añade tu primer capítulo haciendo clic en el
                                botón "Añadir nuevo capítulo"!
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Modal para añadir nuevo capítulo de texto */}
                        <div id="newTextChapterModal" class="chapter-modal">
                          <div
                            class="modal-backdrop"
                            onClick$={() =>
                              document
                                .getElementById("newTextChapterModal")
                                ?.classList.remove("show")
                            }
                          ></div>
                          <div class="modal-content">
                            <div class="modal-header">
                              <h3>{selectedBook.value.title}</h3>
                              <button
                                class="close-button"
                                onClick$={() =>
                                  document
                                    .getElementById("newTextChapterModal")
                                    ?.classList.remove("show")
                                }
                              >
                                &times;
                              </button>
                            </div>
                            <div class="modal-body">
                              <form
                                class="chapter-form"
                                preventdefault:submit
                                onSubmit$={handleNewChapter}
                              >
                                <div class="form-group">
                                  <label for="chapterNumber">
                                    Número de capítulo
                                  </label>
                                  <input
                                    type="number"
                                    id="chapterNumber"
                                    name="chapterNumber"
                                    step="0.01"
                                    min="0"
                                    value={
                                      selectedBook.value.chapters.length + 1
                                    }
                                    required
                                  />
                                </div>
                                <div class="form-group">
                                  <label for="chapterTitle">
                                    Título del capítulo
                                  </label>
                                  <input
                                    type="text"
                                    id="chapterTitle"
                                    name="chapterTitle"
                                  />
                                </div>
                                <div class="form-group">
                                  <label for="chapterContent">
                                    Contenido del capítulo (Markdown)
                                  </label>
                                  <textarea
                                    id="chapterContent"
                                    name="chapterContent"
                                    rows={15}
                                    placeholder="Escribe aquí el contenido de tu capítulo usando formato Markdown..."
                                    required
                                  ></textarea>
                                </div>
                                <div class="form-actions">
                                  <button type="submit" class="btn-submit">
                                    Crear Capítulo
                                  </button>
                                  <button
                                    type="button"
                                    class="btn-cancel"
                                    onClick$={() =>
                                      document
                                        .getElementById("newTextChapterModal")
                                        ?.classList.remove("show")
                                    }
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p>No se ha seleccionado ninguna obra de texto</p>
                    )}
                  </div>
                )}
                {activeWorksBox.value === "imageChapter" && (
                  <div class="image-chapter-view">
                    {selectedBook.value ? (
                      <>
                        <div class="chapter-header">
                          <h3 class="section-title">
                            {selectedBook.value.title}
                          </h3>
                          <div class="btn-actions">
                            <button
                              class="back-button"
                              onClick$={() => (activeWorksBox.value = "all")}
                            >
                              <i class="fas fa-arrow-left"></i> Volver
                            </button>
                            <button
                              class="add-chapter-button"
                              onClick$={() =>
                                document
                                  .getElementById("newChapterModal")
                                  ?.classList.add("show")
                              }
                            >
                              <i class="fas fa-plus"></i> Añadir nuevo capítulo
                            </button>
                          </div>
                        </div>
                        <div class="chapter-list">
                          {selectedBook.value.chapters &&
                          selectedBook.value.chapters.length > 0 ? (
                            <div class="chapters-grid">
                              {selectedBook.value.chapters.map(
                                (chapter: any) => (
                                  <div key={chapter.id} class="chapter-card">
                                    <div class="chapter-info">
                                      <h3>Capítulo {chapter.number}</h3>
                                      <p>{chapter.title}</p>
                                      <div class="chapter-meta">
                                        <span>
                                          Publicado:{" "}
                                          {new Date(
                                            chapter.publishedAt
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <div class="chapter-actions">
                                        <button
                                          class="delete-button"
                                          onClick$={() =>
                                            handleDeleteChapter(chapter.documentId)
                                          }
                                        >
                                          Eliminar
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <div class="no-chapters">
                              <p>
                                No hay capítulos disponibles para esta obra.
                              </p>
                              <p>
                                ¡Añade tu primer capítulo haciendo clic en el
                                botón "Añadir nuevo capítulo"!
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Modal para añadir nuevo capítulo */}
                        <div id="newChapterModal" class="chapter-modal">
                          <div
                            class="modal-backdrop"
                            onClick$={() =>
                              document
                                .getElementById("newChapterModal")
                                ?.classList.remove("show")
                            }
                          ></div>
                          <div class="modal-content">
                            <div class="modal-header">
                              <h3>{selectedBook.value.title}</h3>
                              <button
                                class="close-button"
                                onClick$={() =>
                                  document
                                    .getElementById("newChapterModal")
                                    ?.classList.remove("show")
                                }
                              >
                                &times;
                              </button>
                            </div>
                            <div class="modal-body">
                              <form
                                class="chapter-form"
                                preventdefault:submit
                                onSubmit$={handleNewChapter}
                              >
                                <div class="form-group">
                                  <label for="chapterNumber">
                                    Número de capítulo
                                  </label>
                                  <input
                                    type="number"
                                    id="chapterNumber"
                                    name="chapterNumber"
                                    step="0.01"
                                    min="0"
                                    value={
                                      selectedBook.value.chapters.length + 1
                                    }
                                    required
                                  />
                                </div>
                                <div class="form-group">
                                  <label for="chapterTitle">
                                    Título del capítulo
                                  </label>
                                  <input
                                    type="text"
                                    id="chapterTitle"
                                    name="chapterTitle"
                                  />
                                </div>
                                <div class="form-group">
                                  <label for="chapterImages">
                                    Imágenes del capítulo
                                  </label>
                                  <input
                                    type="file"
                                    id="chapterImages"
                                    name="chapterImages"
                                    accept="image/*"
                                    multiple
                                    required
                                  />
                                </div>
                                <div class="form-actions">
                                  <button type="submit" class="btn-submit">
                                    Crear Capítulo
                                  </button>
                                  <button
                                    type="button"
                                    class="btn-cancel"
                                    onClick$={() =>
                                      document
                                        .getElementById("newChapterModal")
                                        ?.classList.remove("show")
                                    }
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p>No se ha seleccionado ninguna obra con imágenes</p>
                    )}
                  </div>
                )}
              </div>
            )}
            {activeTab.value === "new-works" && (
              <div class="new-works-box">
                <h2>Crear Nueva Obra</h2>
                <form
                  class="new-work-form"
                  preventdefault:submit
                  onSubmit$={handleNewWork}
                >
                  <div class="info-section">
                    <div class="image-section">
                      <label for="coverImage">Imagen de Portada</label>
                      <input
                        type="file"
                        id="coverImage"
                        name="coverImage"
                        accept="image/*"
                        onChange$={handleImageChange}
                        //required
                      />
                      <div
                        class="image-preview-clickable"
                        onClick$={() =>
                          document.getElementById("coverImage")?.click()
                        }
                        title="Haz clic para cambiar la imagen"
                      >
                        {imagePreview.value ? (
                          <img src={imagePreview.value} alt="Vista previa" />
                        ) : (
                          <img
                            src="/default_coverImage.webp"
                            alt="Portada por defecto"
                          />
                        )}
                        <div class="image-overlay">
                          <span>Cambiar</span>
                        </div>
                      </div>
                    </div>
                    <div class="data-section">
                      <ul>
                        <li>
                          <label for="title">Título</label>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            //required
                          />
                        </li>
                        <li>
                          <label for="author">Autor</label>
                          <input
                            type="text"
                            id="author"
                            name="author"
                            //required
                          />
                        </li>
                        <li>
                          <label for="description">Descripción</label>
                          <textarea
                            id="description"
                            name="description"
                            //required
                          ></textarea>
                        </li>
                        <li>
                          <label for="type">Tipo de Obra</label>
                          <select
                            id="type"
                            name="type"
                            //required
                          >
                            <option value="novel">Novela</option>
                            <option value="manga">Manga</option>
                            <option value="manhwa">Manhwa</option>
                            <option value="manhua">Manhua</option>
                            <option value="comic">Comic</option>
                          </select>
                        </li>
                        <li>
                          <label for="status">Estado</label>
                          <select
                            id="status"
                            name="status"
                            //required
                          >
                            <option value="ongoing">En progreso</option>
                            <option value="hiatus">En pausa</option>
                            <option value="completed">Completado</option>
                            <option value="abandoned">Abandonado</option>
                          </select>
                        </li>
                        <li>
                          <label for="language">Idioma</label>
                          <select
                            id="language"
                            name="language"
                            //required
                          >
                            <option value="ES">Español</option>
                            <option value="EN">Inglés</option>
                            <option value="FR">Francés</option>
                            <option value="DE">Alemán</option>
                            <option value="IT">Italiano</option>
                            <option value="PT">Portugués</option>
                            <option value="RU">Ruso</option>
                            <option value="ZH">Chino</option>
                            <option value="JA">Japonés</option>
                            <option value="KO">Coreano</option>
                          </select>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="form-actions">
                    <button type="submit" class="btn-submit">
                      Publicar Obra
                    </button>
                    <button type="reset" class="btn-reset">
                      Limpiar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
});
