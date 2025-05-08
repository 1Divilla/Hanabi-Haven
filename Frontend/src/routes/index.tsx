import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Header } from "~/components/navbar/navbar";
import { Footer } from "~/components/footer/footer";
import { Carousel } from "~/components/carousel/carousel";


export default component$(() => {
  return (
    <>
      <Header/>
      <main>
        
      </main>
      <Footer/>
    </>
  );
});

export const head: DocumentHead = {
  title: "Hanabi Haven - Read Novels and Manhwas Online",
  meta: [
    {
      name: "description",
      content: "Discover and read the best novels and manhwas online for free at Hanabi Haven. Your ultimate destination for quality web novels and manga content.",
    },
    {
      name: "keywords",
      content: "novels, manhwa, manga, web novels, light novels, online reading, free novels, Hanabi Haven"
    },
    {
      property: "og:title",
      content: "Hanabi Haven - Your Haven for the Best Stories"
    },
    {
      property: "og:description",
      content: "Read the best novels and manhwas online for free at Hanabi Haven."
    }
  ],
};
