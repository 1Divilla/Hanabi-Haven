import { query } from "./strapi";

export function getNavbarInfo() {
  return query("navbar?populate=*")
    .then(res => {
        return res.data
    })
}