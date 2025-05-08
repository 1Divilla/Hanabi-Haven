import { component$, useSignal, useStylesScoped$, useTask$ } from "@builder.io/qwik";
import styless from './footer.css?inline';
import { getNavbarInfo } from "~/lib/get-navbar-info";
import { Navbar } from "~/lib/interface/navbar";

export const Footer = component$(() => {
  useStylesScoped$(styless);

  const navbarInfo = useSignal<Navbar>({} as Navbar);
    
    useTask$(async ({  }) => {
        navbarInfo.value = await getNavbarInfo() as Navbar;
    });
    
  return (
    <footer>
      <div class="bottom-wrapper">
          <div class="bottom-logo">
              <a href="/" class="footer-logo">
                <img src={import.meta.env.PUBLIC_STRAPI_HOST+navbarInfo.value.logotype.url} alt="web-logo"/>
              </a>
              <span class="bottom-slog"></span>
          </div>
          <div class="bottom-hub">
              <ul class="bottom-row">
                  <li class="bottom-item">
                      <a href="" class="bottom-link">
                          <span>Term & Conditions</span>
                      </a>
                  </li>
                  <li class="bottom-item">
                      <a href="" class="bottom-link">
                          <span>About us</span>
                      </a>
                  </li>
              </ul>
              <ul class="bottom-row">
                  <li class="bottom-item">
                      <a href="https://x.com" class="bottom-link">
                          <span>Twitter</span>
                      </a>
                  </li>
                  <li class="bottom-item">
                      <a href="https://www.facebook.com" class="bottom-link">
                          <span>Facebook</span>
                      </a>
                  </li>
                  <li class="bottom-item">
                      <a href="https://www.instagram.com" class="bottom-link">
                          <span>Instagram</span>
                      </a>
                  </li>
              </ul>
          </div>
      </div>
    </footer>
  );
});
