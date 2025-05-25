import { component$, useStyles$ } from "@builder.io/qwik";
import { Footer } from "~/components/footer/footer";
import { Header } from "~/components/navbar/navbar";
import styless from "~/styles/browse.css?inline";

export default component$(() => {
  useStyles$(styless);

  return (
    <>
      <Header />
      <main>
        
      </main>
      <Footer />
    </>
  );
});
