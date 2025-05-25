import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import styles from "./navigation.module.css";


export const NavigationButtons = component$((props: {prev: number,next:number,documentId:string}) => {

    return (
        <div class={styles.nav}>
              {props.prev !== -1 && (
                <Link type="button" href={`/b/${props.documentId}/c/${props.prev}`} class={styles.button}>
                  Capítulo anterior
                </Link>
              )}
              <Link type="button" href={`/b/${props.documentId}`} class={styles.button}>
                Página del libro
              </Link>
              {props.next !== -1 && (
                <Link type="button" href={`/b/${props.documentId}/c/${props.next}`} class={styles.button}>
                  Capítulo siguiente
                </Link>
              )}
        </div>
    );
});