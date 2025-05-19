import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Footer } from "~/components/footer/footer";
import { Header } from "~/components/navbar/navbar";
import styless from "~/styles/ranking.css?inline";

export default component$(() => {
  useStylesScoped$(styless);

  return (
    <>
      <Header />
      <main>
        
      </main>
      <Footer />
    </>
  );
});
