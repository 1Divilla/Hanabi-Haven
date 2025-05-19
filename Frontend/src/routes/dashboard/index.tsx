import {
  $,
  component$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Footer } from "~/components/footer/footer";
import { Header } from "~/components/navbar/navbar";
import { User } from "~/lib/interface/user";
import { getUserInfo } from "~/lib/get-user-info";
import styless from "~/styles/dashboard.css?inline";

export default component$(() => {
  useStylesScoped$(styless);
  const userInfo = useSignal<User>({} as User);
  const strapiHost = useSignal(import.meta.env.PUBLIC_STRAPI_HOST || "");
  const activeTab = useSignal("my-works");
  const isAuthenticated = useSignal(false);

  const setActiveTab = $((tab: string) => {
    activeTab.value = tab;
  });

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
  });

  return (
    <>
      <Header />
      <main>
        <div class="dashboard-container">
          {/* Panel lateral que muestra información básica del usuario y navegación */}
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
            {/* Menú de navegación entre las diferentes secciones del dashboard */}
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
              <li class="nav-item">
                <button
                  class={`nav-link ${activeTab.value === "statistics" ? "active" : ""}`}
                  onClick$={() => setActiveTab("statistics")}
                >
                  <span class="nav-text">Estadísticas</span>
                </button>
              </li>
            </ul>
          </nav>
          {/* Área principal de contenido que cambia según la pestaña seleccionada */}
          <div class="content-box">
            {activeTab.value === "my-works" && (
              <div class="my-works-box">
                {/* Contenido de mis obras */}
                <p>Aquí se mostrarán tus obras publicadas</p>
              </div>
            )}
            {activeTab.value === "new-works" && (
              <div class="new-works-box">
                {/* Formulario para crear nueva obra */}
                <p>Aquí irá el formulario para crear una nueva obra</p>
              </div>
            )}
            {activeTab.value === "statistics" && (
              <div class="statistics-box">
                {/* Estadísticas del usuario */}
                <p>Aquí se mostrarán las estadísticas de tus obras</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
});
