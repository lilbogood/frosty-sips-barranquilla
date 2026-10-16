import { createFileRoute } from "@tanstack/react-router";
import { STORE_CONFIG as S } from "@/config/store";
import { Field, LegalLayout, Pending } from "@/components/frosty/LegalLayout";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos y condiciones | FROSTY LAB" },
      { name: "description", content: "Condiciones de uso y de pedidos de granizados FROSTY LAB en Barranquilla: pago contra entrega y confirmación por WhatsApp." },
      { property: "og:title", content: "Términos y condiciones — FROSTY LAB" },
      { property: "og:description", content: "Cómo funcionan los pedidos por WhatsApp y el pago contra entrega." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${S.domain}/terminos` }],
  }),
  component: () => (
    <LegalLayout title="Términos y condiciones">
      <p>Última actualización: <Field value={S.legalUpdated} label="fecha" /></p>
      <h2>1. Identificación del vendedor</h2>
      <p>Marca: {S.brandName}. Razón social: <Field value={S.legalBusinessName} label="razón social" />. NIT: <Field value={S.taxId} label="NIT" />. Domicilio: <Field value={S.address} label="domicilio" />. Contacto: <Field value={S.email} label="correo" />.</p>
      <h2>2. Objeto</h2>
      <p>Esta web permite consultar el catálogo de granizados de {S.brandName} y preparar solicitudes de pedido que se envían por WhatsApp.</p>
      <h2>3. Catálogo y disponibilidad</h2>
      <p>Las imágenes son ilustrativas. La disponibilidad de cada producto se confirma por el negocio al recibir la solicitud. Mientras la web indique "demostración", los productos y precios no constituyen una oferta comercial.</p>
      <h2>4. Precios e impuestos</h2>
      <p>Los precios se expresan en pesos colombianos (COP). <Pending>indicar si incluyen IVA/impuesto al consumo según el régimen tributario del negocio</Pending></p>
      <h2>5. Proceso de pedido y confirmación</h2>
      <p>Al pulsar "Enviar pedido por WhatsApp" se abre WhatsApp con un mensaje preparado. Ese mensaje es una <strong>solicitud</strong>. El pedido solo queda <strong>confirmado</strong> cuando {S.brandName} responde aceptándolo e informando condiciones de entrega y costo final.</p>
      <h2>6. Pago contra entrega</h2>
      <p>El método de pago es contra entrega. No se realizan cobros en línea en esta web. <Pending>medios aceptados al entregar (efectivo, transferencia, etc.)</Pending></p>
      <h2>7. Entregas, cobertura y gastos de envío</h2>
      <p>Modalidades habilitadas: {S.deliveryEnabled || S.pickupEnabled ? [S.deliveryEnabled && "domicilio", S.pickupEnabled && "recogida"].filter(Boolean).join(" y ") : <Pending>modalidades</Pending>}. Cobertura: {S.deliveryZones.length ? S.deliveryZones.join(", ") : <Pending>zonas</Pending>}. Costo: {S.deliveryFeeCOP !== null ? `${S.deliveryFeeCOP} COP` : <Pending>costo de envío</Pending>}. Tiempos: <Field value={S.deliveryTime} label="tiempos estimados" />.</p>
      <h2>8. Cancelaciones y modificaciones</h2>
      <p><Pending>condiciones de cancelación y modificación antes de la preparación del pedido</Pending></p>
      <h2>9. Reclamaciones y garantía</h2>
      <p>El consumidor conserva todos los derechos reconocidos por la Ley 1480 de 2011 (Estatuto del Consumidor), incluidos los de información, calidad, idoneidad y seguridad, y puede presentar peticiones, quejas o reclamos a través de los canales de contacto. Nada en estos términos limita derechos irrenunciables. Dado que se trata de alimentos perecederos de consumo inmediato, el derecho de retracto puede no aplicar según el artículo 47 de dicha ley. <Pending>revisión jurídica</Pending></p>
      <h2>10. Ingredientes y alérgenos</h2>
      <p>La información de ingredientes y alérgenos se publicará cuando sea confirmada. Si tienes alergias o restricciones, consulta antes de pedir.</p>
      <h2>11. Uso de la web y propiedad intelectual</h2>
      <p>No está permitido usar la web para fines ilícitos ni manipular su funcionamiento. La marca, textos y diseño pertenecen a su titular. <Pending>titularidad del registro de marca</Pending></p>
      <h2>12. Normativa aplicable</h2>
      <p>Se aplican las leyes de la República de Colombia, incluidas la Ley 1480 de 2011 y la Ley 527 de 1999, en lo pertinente.</p>
      <h2>13. Actualizaciones</h2>
      <p>Estos términos pueden actualizarse; la versión vigente es la publicada en esta página.</p>
    </LegalLayout>
  ),
});
