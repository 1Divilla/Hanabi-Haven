import { component$, useSignal, useStyles$, useTask$ } from "@builder.io/qwik";
import styless from './footer.css?inline';
import { getNavbarInfo } from "~/lib/get-navbar-info";
import { Navbar } from "~/lib/interface/navbar";
import { Link } from "@builder.io/qwik-city";

export const Footer = component$(() => {
  useStyles$(styless);

  const navbarInfo = useSignal<Navbar>({} as Navbar);
    
  useTask$(async () => {
    try {
      navbarInfo.value = (await getNavbarInfo()) as Navbar;
    } catch (error) {
      console.error("Error al obtener información de foother:", error);
    }
  });
    
  return (
    <footer style={styless}>
      <div class="bottom-wrapper">
          <div class="bottom-logo">
              <Link href="/" class="footer-logo">
                <img src={import.meta.env.PUBLIC_STRAPI_HOST+navbarInfo.value.logotype.url} alt="web-logo"/>
              </Link>
              <span class="bottom-slog"></span>
          </div>
          <div class="bottom-hub">
              <ul class="bottom-row">
                  <li class="bottom-item">
                      <Link href="/terms" class="bottom-link">
                          <span>Term & Conditions</span>
                      </Link>
                  </li>
                  <li class="bottom-item">
                      <Link href="/about-us" class="bottom-link">
                          <span>About us</span>
                      </Link>
                  </li>
              </ul>
              <ul class="bottom-row">
                  <li class="bottom-item">
                      <Link href="https://x.com" class="bottom-link">
                          <span>Twitter</span>
                      </Link>
                  </li>
                  <li class="bottom-item">
                      <Link href="https://www.facebook.com" class="bottom-link">
                          <span>Facebook</span>
                      </Link>
                  </li>
                  <li class="bottom-item">
                      <Link href="https://www.instagram.com" class="bottom-link">
                          <span>Instagram</span>
                      </Link>
                  </li>
              </ul>
          </div>
      </div>
    </footer>
  );
});
