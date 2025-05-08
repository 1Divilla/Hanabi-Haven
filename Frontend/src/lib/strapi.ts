import { server$ } from "@builder.io/qwik-city";

export const query = server$(async function (url: string, options = {}) {
  const defaultHeaders = {
    Authorization: `Bearer ${this.env.get("STRAPI_TOKEN")}`
  };
  
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {})
  };
  
  return fetch(`${this.env.get("PUBLIC_STRAPI_HOST")}/api/${url}`, {
    ...options,
    headers
  }).then(res => res.json());
});