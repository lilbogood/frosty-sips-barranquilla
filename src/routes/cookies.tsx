import { createFileRoute } from "@tanstack/react-router";
import { STORE_CONFIG as S } from "@/config/store";
import { Field, LegalLayout } from "@/components/frosty/LegalLayout";
import { openCookiePreferences } from "@/components/frosty/CookieConsent";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Política de cookies | FROSTY LAB" },
      { name: "description", content: "Qué almacenamiento usa la web de FROSTY LAB, para qué sirve y cómo cambiar tus preferencias." },
      { property: "og:title", content: "Política de cookies — FROSTY LAB" },
      { property: "og:description", content: "Cookies y almacenamiento local en la web de FROSTY LAB." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${S.domain}/cookies` }],
  }),
  component: () => (
    <LegalLayout title="Política de cookies">
      <p>Última actualización: <Field value={S.legalUpdated} label="fecha" /></p>
      <h2>¿Qué son las cookies?</h2>
      <p>Son pequeños archivos o registros que un sitio guarda en tu navegador. Esta web usa principalmente almacenamiento local (localStorage), una tecnología similar.</p>
      <h2>Estrictamente necesarias</h2>
      <ul>
        <li><code>frostylab-cart-v1</code> (localStorage): guarda los productos de tu carrito. Se conserva hasta que lo vacíes o borres los datos del navegador.</li>
        <li><code>frostylab-consent-v1</code> (localStorage): guarda tu elección sobre cookies.</li>
      </ul>
      <h2>Preferencias</h2>
      <p>Categoría opcional reservada para ajustes de interfaz. Actualmente no se usa ninguna.</p>
      <h2>Analíticas</h2>
      <p>Actualmente <strong>no hay herramientas de analítica instaladas</strong>. Si se añaden en el futuro, se documentarán aquí y solo se cargarán tras tu consentimiento.</p>
      <h2>Publicitarias</h2>
      <p>Esta web no usa cookies publicitarias.</p>
      <h2>Proveedores externos</h2>
      <p>Las fuentes tipográficas se cargan desde Google Fonts, que puede recibir tu dirección IP. Al pulsar el botón de WhatsApp sales hacia un servicio de Meta, sujeto a sus propias políticas.</p>
      <h2>Cambiar o retirar tu consentimiento</h2>
      <p><button type="button" className="btn btn-primary" onClick={openCookiePreferences}>Abrir preferencias de cookies</button></p>
      <h2>Gestionar desde el navegador</h2>
      <p>Puedes borrar o bloquear el almacenamiento desde la configuración de privacidad de Chrome, Safari, Firefox o Edge. Si lo bloqueas, el carrito no se recordará entre visitas.</p>
    </LegalLayout>
  ),
});
