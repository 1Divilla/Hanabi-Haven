import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Footer } from "~/components/footer/footer";
import { Header } from "~/components/navbar/navbar";
import styless from "~/styles/terms.css?inline";

export default component$(() => {
  useStylesScoped$(styless);

  return (
    <>
      <Header />
      <main class="terms-container">
        <div class="terms-content">
          <h1>Términos y Condiciones</h1>
          <p class="last-updated">Última actualización: 1 de junio de 2023</p>
          
          <section>
            <h2>1. Introducción</h2>
            <p>Bienvenido a Hanabi Haven. Estos Términos y Condiciones rigen el uso de nuestro sitio web, servicios y aplicaciones (colectivamente, el "Servicio"). Al acceder o utilizar nuestro Servicio, usted acepta estar sujeto a estos Términos. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al Servicio.</p>
          </section>
          
          <section>
            <h2>2. Uso del Servicio</h2>
            <p>Hanabi Haven proporciona una plataforma para la lectura y publicación de contenido literario y gráfico. Usted se compromete a utilizar el Servicio solo para fines legales y de acuerdo con estos Términos. Está prohibido utilizar el Servicio de cualquier manera que pueda dañar, deshabilitar, sobrecargar o deteriorar el Servicio.</p>
            <p>Como usuario de nuestro Servicio, usted es responsable de mantener la confidencialidad de su cuenta y contraseña. Usted acepta la responsabilidad de todas las actividades que ocurran bajo su cuenta.</p>
          </section>
          
          <section>
            <h2>3. Contenido del Usuario</h2>
            <p>Nuestro Servicio permite publicar, enlazar, almacenar, compartir y poner a disposición cierta información, textos, gráficos, videos u otro material ("Contenido"). Usted es responsable del Contenido que publique en o a través del Servicio, incluida su legalidad, fiabilidad y adecuación.</p>
            <p>Al publicar Contenido en o a través del Servicio, usted declara y garantiza que: (i) el Contenido es suyo (es de su propiedad) y/o tiene el derecho de usarlo y el derecho de concedernos los derechos y licencia como se establece en estos Términos, y (ii) que la publicación de su Contenido en o a través del Servicio no viola los derechos de privacidad, derechos de publicidad, derechos de autor, derechos contractuales o cualquier otro derecho de cualquier persona o entidad.</p>
          </section>
          
          <section>
            <h2>4. Derechos de Propiedad Intelectual</h2>
            <p>El Servicio y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de Hanabi Haven y sus licenciantes. El Servicio está protegido por derechos de autor, marcas registradas y otras leyes tanto de España como de otros países. Nuestras marcas comerciales y imagen comercial no pueden ser utilizadas en relación con ningún producto o servicio sin el consentimiento previo por escrito de Hanabi Haven.</p>
          </section>
          
          <section>
            <h2>5. Enlaces a Otros Sitios Web</h2>
            <p>Nuestro Servicio puede contener enlaces a sitios web o servicios de terceros que no son propiedad ni están controlados por Hanabi Haven. Hanabi Haven no tiene control sobre, y no asume responsabilidad por, el contenido, políticas de privacidad o prácticas de sitios web o servicios de terceros. Usted reconoce y acepta que Hanabi Haven no será responsable, directa o indirectamente, por cualquier daño o pérdida causada o supuestamente causada por o en conexión con el uso o la confianza en dicho contenido, bienes o servicios disponibles en o a través de dichos sitios web o servicios.</p>
          </section>
          
          <section>
            <h2>6. Terminación</h2>
            <p>Podemos terminar o suspender su cuenta y prohibir el acceso al Servicio inmediatamente, sin previo aviso ni responsabilidad, bajo nuestra única discreción, por cualquier razón y sin limitación, incluido, pero no limitado a, una violación de los Términos. Si desea terminar su cuenta, puede simplemente dejar de usar el Servicio. Todas las disposiciones de los Términos que por su naturaleza deberían sobrevivir a la terminación sobrevivirán a la terminación, incluyendo, sin limitación, disposiciones de propiedad, renuncias de garantía, indemnización y limitaciones de responsabilidad.</p>
          </section>
          
          <section>
            <h2>7. Limitación de Responsabilidad</h2>
            <p>En ningún caso Hanabi Haven, ni sus directores, empleados, socios, agentes, proveedores o afiliados, serán responsables por cualquier daño indirecto, incidental, especial, consecuente o punitivo, incluyendo sin limitación, pérdida de beneficios, datos, uso, buena voluntad, u otras pérdidas intangibles, resultantes de (i) su acceso o uso o incapacidad para acceder o usar el Servicio; (ii) cualquier conducta o contenido de terceros en el Servicio; (iii) cualquier contenido obtenido del Servicio; y (iv) acceso no autorizado, uso o alteración de sus transmisiones o contenido, ya sea basado en garantía, contrato, agravio (incluyendo negligencia) o cualquier otra teoría legal, ya sea que hayamos sido informados o no de la posibilidad de tal daño, e incluso si se encuentra que un remedio establecido en este documento ha fallado en su propósito esencial.</p>
          </section>
          
          <section>
            <h2>8. Cambios a los Términos</h2>
            <p>Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso de al menos 30 días antes de que los nuevos términos entren en vigencia. Lo que constituye un cambio material será determinado a nuestra sola discreción. Al continuar accediendo o utilizando nuestro Servicio después de que esas revisiones entren en vigencia, usted acepta estar sujeto a los términos revisados. Si no está de acuerdo con los nuevos términos, deje de usar el Servicio.</p>
          </section>
          
          <section>
            <h2>9. Ley Aplicable</h2>
            <p>Estos Términos se regirán e interpretarán de acuerdo con las leyes de España, sin tener en cuenta sus disposiciones sobre conflicto de leyes. Nuestra falta de hacer cumplir cualquier derecho o disposición de estos Términos no se considerará una renuncia a esos derechos. Si alguna disposición de estos Términos es considerada inválida o inaplicable por un tribunal, las disposiciones restantes de estos Términos permanecerán en vigor.</p>
          </section>
          
          <section>
            <h2>10. Contacto</h2>
            <p>Si tiene alguna pregunta sobre estos Términos, por favor contáctenos a través de nuestro formulario de contacto o envíenos un correo electrónico a info@hanabihaven.com.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
});
