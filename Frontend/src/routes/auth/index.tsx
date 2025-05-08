import { component$, useStylesScoped$, useSignal } from "@builder.io/qwik";
import { routeAction$, Form } from "@builder.io/qwik-city";
import styless from "~/styles/auth.css?inline";
import LockSvg from "~/media/icons/lock-svg.svg?jsx";
import MailSvg from "~/media/icons/mail-svg.svg?jsx";
import UserSvg from "~/media/icons/user-svg.svg?jsx";
import ReturnSvg from "~/media/icons/return-svg.svg?jsx";

//ACCION PARA EL REGISTRO
export const useRegisterAction = routeAction$(async (data, { env }) => {
  try {
    const response = await fetch(
      `${env.get("PUBLIC_STRAPI_HOST")}/api/auth/local/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Error en el registro");
    }

    return { success: true };
  } catch (error) {
    return { error: (error as Error).message };
  }
});

//ACCION PARA EL LOGIN
export const useLoginAction = routeAction$(async (data, { env, cookie }) => {
  try {
    const response = await fetch(
      `${env.get("PUBLIC_STRAPI_HOST")}/api/auth/local`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: data.email,
          password: data.password,
        }),
      }
    );

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || "Error en el inicio de sesión");
    }

    cookie.set("jwt", result.jwt, {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
    });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt', result.jwt);
      sessionStorage.setItem('jwt', result.jwt);
      console.log("Token guardado en localStorage y sessionStorage:", result.jwt);
    }

    return { success: true, jwt: result.jwt, user: result.user };
  } catch (error) {
    return { error: (error as Error).message };
  }
});

export default component$(() => {
  useStylesScoped$(styless);
  const isLogin = useSignal(true);
  const registerAction = useRegisterAction();
  const loginAction = useLoginAction();
  const showSuccess = useSignal(false);
  const loginError = useSignal("");

  return (
    <>
      <section>
        <div class="login-box">
          {showSuccess.value ? (
            <div class="success-message">
              <h2>¡Registro exitoso!</h2>
              <p>Tu cuenta ha sido creada correctamente.</p>
              <button
                onClick$={() => {
                  showSuccess.value = false;
                  isLogin.value = true;
                }}
              >
                Iniciar sesión
              </button>
            </div>
          ) : (
            <Form
              action={isLogin.value ? loginAction : registerAction}
              onSubmitCompleted$={(data) => {
                if (!isLogin.value && data.detail?.value?.success) {
                  showSuccess.value = true;
                } else if (isLogin.value && data.detail?.value?.success) {
                  // Asegúrate de que el token se guarde antes de redirigir
                  if (typeof window !== 'undefined') {
                    // Acceder directamente al token JWT
                    const jwt = (data.detail?.value as { jwt?: string })?.jwt || '';
                    localStorage.setItem('jwt', jwt);
                    sessionStorage.setItem('jwt', jwt);
                    console.log("Token guardado antes de redirigir:", jwt);
                  }
                  window.location.href = "/";
                } else if (isLogin.value && data.detail?.value?.error) {
                  loginError.value = data.detail.value.error;
                }
              }}
            >
              <h2>
                <a href="/">
                  <ReturnSvg />
                </a>
                {isLogin.value ? "Login" : "Registro"}
              </h2>

              {!isLogin.value && (
                <div class="input-box">
                  <span class="icon">
                    <UserSvg />
                  </span>
                  <input type="text" name="username" required placeholder=" " />
                  <label>Username</label>
                </div>
              )}

              <div class="input-box">
                <span class="icon">
                  <MailSvg />
                </span>
                <input type="email" name="email" required placeholder=" " />
                <label>Email</label>
              </div>
              <div class="input-box">
                <span class="icon">
                  <LockSvg />
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder=" "
                />
                <label>Password</label>
              </div>

              {!isLogin.value && registerAction.value?.error && (
                <div class="error-message">{registerAction.value?.error}</div>
              )}
              
              {isLogin.value && loginError.value && (
                <div class="error-message">{loginError.value}</div>
              )}

              <button type="submit">
                {isLogin.value ? "Login" : "Register"}
              </button>

              <div class="register-link">
                <p>
                  {isLogin.value
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <a onClick$={() => {
                    isLogin.value = !isLogin.value;
                    loginError.value = "";
                  }}>
                    {isLogin.value ? "Register" : "Login"}
                  </a>
                </p>
              </div>
            </Form>
          )}
        </div>
      </section>
    </>
  );
});
