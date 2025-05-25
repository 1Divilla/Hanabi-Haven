import { component$, useStyles$ } from "@builder.io/qwik";
import { Footer } from "~/components/footer/footer";
import { Header } from "~/components/navbar/navbar";
import styless from "~/styles/about-us.css?inline";

export default component$(() => {
  useStyles$(styless);

  return (
    <>
      <Header />
      <main class="about-container">
        <div class="about-content">
          <h1>Sobre Nosotros</h1>
          <p class="intro-text">Bienvenido a Hanabi Haven, tu plataforma de lectura y publicación de contenido literario y gráfico.</p>
          
          <section>
            <h2>Nuestra Misión</h2>
            <p>En Hanabi Haven, nos dedicamos a crear un espacio donde los creadores puedan compartir sus historias y los lectores puedan descubrir nuevos mundos. Nuestra plataforma está diseñada para fomentar la creatividad, la diversidad y la comunidad entre amantes de la literatura y el arte visual.</p>
          </section>
          
          <section>
            <h2>Nuestra Visión</h2>
            <p>Aspiramos a ser la plataforma líder para creadores de contenido literario y gráfico, ofreciendo herramientas innovadoras y un espacio seguro donde la creatividad pueda florecer sin límites.</p>
          </section>
          
          <section class="publisher-info">
            <h2>Conviértete en Publicador</h2>
            <p>En Hanabi Haven, valoramos a nuestros creadores de contenido y ofrecemos la oportunidad de convertirse en publicador oficial con beneficios exclusivos.</p>
            
            <h3>Requisitos para ser Publicador</h3>
            <ul>
              <li>Mantener una actividad regular de publicación</li>
              <li>Cumplir con nuestras normas de comunidad y calidad</li>
            </ul>
            
            <h3>Proceso de Solicitud</h3>
            <p>Para convertirte en publicador o creador de contenido oficial y poder disponer del derecho de publicar contenido destacado, debes comunicarte directamente con nuestro equipo administrativo. Nuestros administradores te proporcionarán información detallada sobre:</p>
            
            <ul>
              <li>Gastos asociados con la promoción de contenido</li>
              <li>Estrategias para hacer destacar tu contenido en la plataforma</li>
              <li>Herramientas exclusivas para creadores</li>
              <li>Oportunidades de colaboración y eventos especiales</li>
            </ul>
            
            <p>Puedes contactar con nuestro equipo a través del correo electrónico <strong>publishers@hanabihaven.com</strong> o mediante el formulario de contacto en nuestra plataforma.</p>
          </section>
          
          <section>
            <h2>Beneficios para Publicadores</h2>
            <p>Como publicador oficial de Hanabi Haven, disfrutarás de:</p>
            
            <ul>
              <li>Herramientas avanzadas de edición y publicación</li>
              <li>Soporte de nuestro equipo</li>
              <li>Participación en eventos exclusivos para creadores</li>
            </ul>
          </section>
          
          <section>
            <h2>Contacto</h2>
            <p>Si tienes alguna pregunta sobre Hanabi Haven o cómo convertirte en publicador, no dudes en contactarnos a través de nuestro formulario de contacto o envíanos un correo electrónico a <strong>info@hanabihaven.com</strong>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
});
