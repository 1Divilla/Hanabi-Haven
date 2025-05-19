import {
  component$,
  useStylesScoped$,
  useTask$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import styless from "./navbar.css?inline";
import BookSvg from "~/media/icons/book-svg.svg?jsx";
import BrowseSvg from "~/media/icons/browse-svg.svg?jsx";
import MailSvg from "~/media/icons/mail-svg.svg?jsx";
import UserSvg from "~/media/icons/user-svg.svg?jsx";
import DashboardSvg from "~/media/icons/dashboard-svg.svg?jsx";
import RankingSvg from "~/media/icons/ranking-svg.svg?jsx";
import { getNavbarInfo } from "~/lib/get-navbar-info";
import { getUserInfo } from "~/lib/get-user-info";
import { Navbar } from "~/lib/interface/navbar";
import { User } from "~/lib/interface/user";

export const Header = component$(() => {
  useStylesScoped$(styless);
  const navbarInfo = useSignal<Navbar>({} as Navbar);
  const userInfo = useSignal<User>({} as User);
  const isAuthenticated = useSignal(false);

  useTask$(async () => {
    navbarInfo.value = (await getNavbarInfo()) as Navbar;
  });
  useVisibleTask$(async () => {
    const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');

    isAuthenticated.value = !!token;
    
    if (token) {
      const userData = await getUserInfo();
      
      if (userData) {
        userInfo.value = userData as User;
      } else {
        console.log("No se pudo obtener la información del usuario");
      }
    }
  });

  return (
    <header>
      <div class="nav-wrapper">
        <a
          class="nav-logo"
          href="/"
          title="Read the Best Novels and Manhwas Online for Free | Hanabi Haven"
        >
          <img
            src={
              import.meta.env.PUBLIC_STRAPI_HOST +
              navbarInfo.value.logotype?.url
            }
            alt="web-logo"
          />
        </a>
        <div class="navbar">
          <nav class="navbar-hub">
            <span class="nav-hub-slog">
              {navbarInfo.value.wellcomeMessage}
            </span>
            <ul class="navbar-menu">
              <li class="nav-item">
                <a href="/browse" class="nav-link" title="Explore our Content">
                  <BrowseSvg class="icon-svg" />
                  <span>Browse</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  href="/updates"
                  class="nav-link"
                  title="Explore the New Recent Content"
                >
                  <BookSvg class="icon-svg" />
                  <span>Updates</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  href="/ranking"
                  class="nav-link"
                  title="View the Most Popular Content"
                >
                  <RankingSvg class="icon-svg" />
                  <span>Ranking</span>
                </a>
              </li>
            </ul>
          </nav>

          {isAuthenticated.value ? (
            <nav class="navbar-user">
              <span class="nav-user-slog">Bienvenido {userInfo.value?.username}</span>
              <ul class="navbar-auth">
                <li class="nav-item">
                  <a
                    href="/dashboard"
                    class="nav-link"
                    title="Manage and upload your content"
                  >
                    <DashboardSvg class="icon-svg" />
                    <span>Dashboard</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="/profile" class="nav-link">
                    <UserSvg class="icon-svg" />
                    <span>Perfil</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="/profile?tab=library" class="nav-link">
                    <BookSvg class="icon-svg" />
                    <span>Biblioteca</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="/profile?tab=messages" class="nav-link">
                    <MailSvg class="icon-svg" />
                    <span></span>
                  </a>
                </li>
              </ul>
            </nav>
          ) : (
            <div class="login-container">
              <a href="/auth" class="login-button">
                <UserSvg class="icon-svg" />
                <span>Login</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});
