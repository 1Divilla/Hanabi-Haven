import {
  $,
  component$,
  useSignal,
  useStyles$,
  useVisibleTask$,
  noSerialize,
} from "@builder.io/qwik";
import styless from "~/styles/profile.css?inline";
import { Footer } from "~/components/footer/footer";
import { Header } from "~/components/navbar/navbar";
import { getUserInfo } from "~/lib/get-user-info";
import { uploadMultipleOrSingleAction } from "~/lib/uploadMultipleOrSingleAction";
import { User } from "~/lib/interface/user";
import { useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  useStyles$(styless);
  const loc = useLocation();
  
  const userInfo = useSignal<User>({} as User);
  const isAuthenticated = useSignal(false);
  const strapiHost = useSignal(import.meta.env.PUBLIC_STRAPI_HOST || "");
  const showEditWindow = useSignal(false);
  const imagePreview = useSignal("");
  const selectedFile = useSignal<ReturnType<typeof noSerialize<File>> | null>(
    null
  );
  const uploadingImage = useSignal(false);
  const uploadError = useSignal<string | null>(null);
  const uploadSuccess = useSignal<string | null>(null);

  // Estado para controlar la pestaña activa en la interfaz de perfil
  const activeTab = useSignal("info");
  
  useVisibleTask$(async () => {
    strapiHost.value = import.meta.env.PUBLIC_STRAPI_HOST || "";

    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");

    isAuthenticated.value = !!token;

    if (token) {
      const userData = await getUserInfo();

      if (userData) {
        userInfo.value = userData as User;
      }
    }
    
    const tabParam = loc.url.searchParams.get("tab");
    if (tabParam) {
      // Activar la pestaña correspondiente según el parámetro
      if (["info", "history", "messages"].includes(tabParam)) {
        activeTab.value = tabParam;
      }
    }
  });

  const setActiveTab = $(async (tab: string) => {
    activeTab.value = tab;
  });

  const handleLogout = $(() => {
    localStorage.removeItem("jwt");
    sessionStorage.removeItem("jwt");
    window.location.href = "/";
  });

  // Función para mostrar u ocultar la ventana modal de edición de perfil
  const toggleEditWindow = $(() => {
    showEditWindow.value = !showEditWindow.value;
  });

  // Función que gestiona la eliminación de la cuenta de usuario con confirmación
  const handleDeleteAccount = $(async () => {
    if (
      !confirm(
        "¿Estás seguro de eliminar tu cuenta? Esta acción es irreversible"
      )
    )
      return;

    try {
      const token =
        localStorage.getItem("jwt") || sessionStorage.getItem("jwt");

      const response = await fetch(
        `${import.meta.env.PUBLIC_STRAPI_HOST}/api/users/${userInfo.value?.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok)
        throw new Error(`Error HTTP! estado: ${response.status}`);

      // Eliminar tokens y redirigir al inicio
      localStorage.removeItem("jwt");
      sessionStorage.removeItem("jwt");
      window.location.href = "/";
    } catch (error) {
      console.error("Error eliminando cuenta:", error);
      alert("Error al eliminar la cuenta: " + (error as Error).message);
    }
  });

  // Función que maneja la selección de una nueva imagen de perfil y genera una vista previa
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

  // Función que sube la imagen seleccionada a Strapi y devuelve el ID si es exitoso
  const handleUploadAvatar = $(async () => {
    if (!selectedFile.value) {
      return null;
    }

    try {
      uploadingImage.value = true;
      uploadError.value = null;
      uploadSuccess.value = null;

      // Crear un FormData para enviar el archivo
      const formData = new FormData();
      formData.append("files", selectedFile.value);

      // Usar la función adaptada para subir la imagen
      const result = await uploadMultipleOrSingleAction(
        formData,
        `avatar_${userInfo.value.id.toString()}`
      );

      if (result.uploadError) {
        uploadError.value = result.uploadError;
        return null;
      }

      uploadSuccess.value = result.uploadSuccess || null;
      console.log("Imagen subida exitosamente:", result.data);

      // Devolver el ID del archivo subido
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        return result.data[0].id;
      }

      return null;
    } catch (error) {
      uploadError.value = (error as Error).message;
      return null;
    } finally {
      uploadingImage.value = false;
    }
  });

  // Función principal que maneja el guardado de cambios en el perfil (nickname, contraseña e imagen)
  const handleSaveChanges = $(async (event: any) => {
    event.preventDefault();

    try {
      const token =
        localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
      console.log("Token obtenido:", token ? "Presente" : "No presente");

      if (!token) {
        alert("No estás autenticado");
        return;
      }

      const nicknameInput = document.getElementById(
        "nickname"
      ) as HTMLInputElement;
      const passwordInput = document.getElementById(
        "password"
      ) as HTMLInputElement;
      const confirmPasswordInput = document.getElementById(
        "confirm_password"
      ) as HTMLInputElement;

      if (passwordInput.value) {
        console.log("Verificando coincidencia de contraseñas");
        if (passwordInput.value !== confirmPasswordInput.value) {
          console.log("Las contraseñas no coinciden");
          alert("Las contraseñas no coinciden");
          return;
        }
      }
      // Preparar los datos a actualizar (solo los campos modificados)
      const updateData: any = {};

      if (
        nicknameInput.value &&
        nicknameInput.value !== userInfo.value?.username
      ) {
        updateData.username = nicknameInput.value;
      }

      if (passwordInput.value) {
        updateData.password = passwordInput.value;
      }

      

      // Procesar la imagen si se ha seleccionado una nueva
      let uploadedImageId = null;
      if (selectedFile.value) {
        uploadedImageId = await handleUploadAvatar();
        if (!uploadedImageId) {
          console.log("No se pudo subir la imagen");
          // Confirmación para continuar sin la imagen
          if (
            !confirm(
              "No se pudo subir la imagen. ¿Deseas continuar con la actualización del perfil sin cambiar la imagen?"
            )
          ) {
            return;
          }
        } else {
          console.log("Imagen subida con ID:", uploadedImageId);
          updateData.avatar = uploadedImageId;
        }
      }


      // Realizar la actualización solo si hay cambios
      if (Object.keys(updateData).length > 0) {
        console.log("Iniciando petición de actualización");
        const userResponse = await fetch(
          `${strapiHost.value}/api/users/${userInfo.value?.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
            cache: "no-cache",
          }
        );

        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          console.error("Error del servidor:", errorData);
          throw new Error(
            `Error al actualizar el perfil: ${userResponse.status} - ${JSON.stringify(errorData.error)}`
          );
        }

        const updatedUserData = await userResponse.json();
        console.log("Datos actualizados recibidos:", updatedUserData);

        // Actualizar el estado local con los nuevos datos
        userInfo.value = {
          ...userInfo.value,
          ...(updateData.username ? { username: updateData.username } : {}),
        };

        // Limpiar campos de contraseña por seguridad
        if (passwordInput) {
          passwordInput.value = "";
        }
        if (confirmPasswordInput) {
          confirmPasswordInput.value = "";
        }

        showEditWindow.value = false;

        // Recargar datos completos del usuario para asegurar consistencia
        console.log("Recargando datos del usuario");
        const refreshedUserData = await getUserInfo();
        if (refreshedUserData) {
          userInfo.value = refreshedUserData as User;
          console.log("Datos del usuario actualizados:", userInfo.value);
        }
      } else {
        showEditWindow.value = false;
      }
    } catch (error) {
      console.error("Error general:", error);
      alert("Error al actualizar el perfil: " + (error as Error).message);
    }
  });

  return (
    <>
      <Header />
      <main>
        <div class="profile-container">
          {/* Panel lateral que muestra información básica del usuario y navegación */}
          <nav class="profile-sidebar">
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
                <h2 class="username">{userInfo.value?.username}</h2>
                <p class="user-email">{userInfo.value?.email}</p>
              </div>
            </div>
            {/* Menú de navegación entre las diferentes secciones del perfil */}
            <ul class="profile-nav">
              <li class="nav-item">
                <button
                  class={`nav-link ${activeTab.value === "info" ? "active" : ""}`}
                  onClick$={() => setActiveTab("info")}
                  aria-current={activeTab.value === "info" ? "page" : undefined}
                >
                  <span class="nav-text">Info</span>
                </button>
              </li>
              <li class="nav-item">
                <button
                  class={`nav-link ${activeTab.value === "history" ? "active" : ""}`}
                  onClick$={() => setActiveTab("history")}
                >
                  <span class="nav-text">Historial</span>
                </button>
              </li>
              <li class="nav-item">
                <button
                  class={`nav-link ${activeTab.value === "messages" ? "active" : ""}`}
                  onClick$={() => setActiveTab("messages")}
                >
                  <span class="nav-text">Mensajes</span>
                </button>
              </li>
            </ul>
          </nav>
          {/* Área principal de contenido que cambia según la pestaña seleccionada */}
          <div class="content-box">
            {activeTab.value === "info" && (
              <div class="profile-box">
                <h3 class="section-title">Información del Perfil</h3>
                <section class="profile-section">
                  <div class="data-grid">
                    <div class="data-item">
                      <dt class="data-label">Nickname:</dt>
                      <dd class="data-value">{userInfo.value?.username}</dd>
                    </div>
                    <div class="data-item">
                      <dt class="data-label">Email:</dt>
                      <dd class="data-value">{userInfo.value?.email}</dd>
                    </div>
                    <div class="data-item">
                      <dt class="data-label">Registrado desde:</dt>
                      <dd class="data-value">
                        {new Date(userInfo.value?.createdAt).toLocaleDateString(
                          "es-ES",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </dd>
                    </div>
                  </div>
                  {/* Botones para gestionar la cuenta: cerrar sesión, actualizar y eliminar */}
                  <div class="action-buttons">
                    <button class="btn--logout" onClick$={handleLogout}>
                      Sign Out
                    </button>
                    <button class="btn--update" onClick$={toggleEditWindow}>
                      Update
                    </button>
                    <button
                      class="btn--delate-count"
                      onClick$={handleDeleteAccount}
                      disabled={!isAuthenticated.value}
                    >
                      Delete account
                    </button>
                  </div>
                </section>
                {/* Ventana modal que aparece al editar el perfil */}
                {showEditWindow.value && (
                  <>
                    <div
                      class="modal-backdrop"
                      onClick$={toggleEditWindow}
                    ></div>
                    <div class="edit-window">
                      <div class="edit-header">
                        <span>Edit Profile</span>
                        <button
                          class="close-button"
                          onClick$={toggleEditWindow}
                        >
                          ×
                        </button>
                      </div>
                      <form preventdefault:submit onSubmit$={handleSaveChanges}>
                        <div class="form-header">
                          {/* Componente para seleccionar y previsualizar la imagen de perfil */}
                          <div class="image-preview-container">
                            <input
                              type="file"
                              id="profile_image"
                              name="profile_image"
                              accept="image/*"
                              onChange$={handleImageChange}
                              style="display: none;"
                            />
                            <div
                              class="image-preview clickable"
                              onClick$={() =>
                                document
                                  .getElementById("profile_image")
                                  ?.click()
                              }
                              title="Haz clic para cambiar la imagen"
                            >
                              {imagePreview.value ? (
                                <img
                                  src={imagePreview.value}
                                  alt="Vista previa"
                                />
                              ) : userInfo.value?.avatar?.url ? (
                                <img
                                  src={
                                    strapiHost.value + userInfo.value.avatar.url
                                  }
                                  alt="Avatar actual"
                                />
                              ) : (
                                <img
                                  src="/default_icon.webp"
                                  alt="Avatar por defecto"
                                />
                              )}
                              <div class="image-overlay">
                                <span>Cambiar</span>
                              </div>
                            </div>
                          </div>

                          {/* Campos para editar la información básica del usuario */}
                          <div class="user-info-container">
                            <div class="form-group">
                              <label for="email">Email</label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={userInfo.value?.email}
                                readOnly
                              />
                            </div>

                            <div class="form-group">
                              <label for="nickname">Nickname</label>
                              <input
                                type="text"
                                id="nickname"
                                name="nickname"
                                value={userInfo.value?.username}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Sección para cambiar la contraseña con confirmación */}
                        <div class="password-section">
                          <div class="form-group">
                            <label for="password">Nueva Contraseña</label>
                            <input
                              type="password"
                              id="password"
                              name="password"
                            />
                          </div>

                          <div class="form-group">
                            <label for="confirm_password">
                              Confirmar Contraseña
                            </label>
                            <input
                              type="password"
                              id="confirm_password"
                              name="confirm_password"
                            />
                          </div>
                        </div>

                        {/* Botones para guardar los cambios o cancelar la edición */}
                        <div class="form-actions">
                          <button
                            type="submit"
                            class="save-changes"
                            disabled={uploadingImage.value}
                          >
                            Guardar
                          </button>
                          <button
                            type="button"
                            class="cancel-changes"
                            onClick$={toggleEditWindow}
                            disabled={uploadingImage.value}
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  </>
                )}
              </div>
            )}
            {activeTab.value === "history" && (
              <div class="history-box">
                {(userInfo.value?.history && Array.isArray(userInfo.value.history)) ? (
                  userInfo.value.history
                    .filter(historyItem => historyItem.createdAt)
                    .map((item, idx) => (
                      <div class="history-item" key={idx}>
                        <div class="history-icon">📖</div>
                        <div class="history-content">
                          <h3>Capítulo {item.lastChapter}</h3>
                          <p>Leído el {new Date(item.createdAt).toLocaleDateString('es-ES')}</p>
                          <p>Libro: {item.bookTitle}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div class="empty-history">No hay historial reciente.</div>
                )}
              </div>
            )}

            {activeTab.value === "messages" && (
              <div class="menssage-box">
                {(userInfo.value?.notifications && Array.isArray(userInfo.value.notifications)) ? (
                  userInfo.value.notifications
                    .filter(notif => notif.publishedAt !== null)
                    .map((notif, idx) => (
                      <div class="notification-box" key={idx}>
                        <div class={`priority-indicator ${notif.priority}`}></div>
                        <div class="notification-content">
                          <h3 class="notification-title">{notif.title}</h3>
                          <p class="notification-text">{notif.content}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div class="empty-notifications">No hay notificaciones.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
});
