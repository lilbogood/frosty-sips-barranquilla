import { createFileRoute } from "@tanstack/react-router";
import { STORE_CONFIG as S } from "@/config/store";
import { Field, LegalLayout, Pending } from "@/components/frosty/LegalLayout";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de privacidad | FROSTY LAB" },
      { name: "description", content: "Cómo FROSTY LAB trata los datos personales de quienes hacen pedidos de granizados en Barranquilla." },
      { property: "og:title", content: "Política de privacidad — FROSTY LAB" },
      { property: "og:description", content: "Tratamiento de datos personales conforme a la Ley 1581 de 2012." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${S.domain}/privacidad` }],
  }),
  component: () => (
    <LegalLayout title="Política de tratamiento de datos personales">
      <p>Última actualización: <Field value={S.legalUpdated} label="fecha" /></p>
      <h2>1. Responsable del tratamiento</h2>
      <p>Razón social: <Field value={S.legalBusinessName} label="razón social" />. NIT/identificación: <Field value={S.taxId} label="NIT o documento" />. Domicilio: <Field value={S.address} label="domicilio" />, {S.city}, {S.country}. Correo para asuntos de privacidad: <Field value={S.privacyEmail} label="correo de privacidad" />. Teléfono: <Field value={S.phone} label="teléfono" />.</p>
      <h2>2. Marco normativo</h2>
      <p>Esta política se elabora considerando la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto Único 1074 de 2015) y demás normas aplicables en Colombia. <Pending>revisión jurídica de la normativa vigente</Pending></p>
      <h2>3. Datos que recopilamos</h2>
      <ul>
        <li>Nombre del cliente.</li>
        <li>Teléfono de contacto.</li>
        <li>Dirección y barrio de entrega, cuando se solicita domicilio.</li>
        <li>Observaciones que el cliente decida escribir.</li>
        <li>Contenido del pedido (productos, tamaños, cantidades).</li>
      </ul>
      <p>Esta web no solicita datos bancarios, contraseñas ni datos sensibles. Los datos del formulario no se almacenan en servidores de esta web: se incluyen únicamente en el mensaje que el cliente envía voluntariamente por WhatsApp.</p>
      <h2>4. Finalidades</h2>
      <ul>
        <li>Gestionar, confirmar y entregar pedidos.</li>
        <li>Comunicarse con el cliente sobre su pedido.</li>
        <li>Atender peticiones, quejas y reclamos.</li>
      </ul>
      <p>Cualquier finalidad adicional (por ejemplo, envío de publicidad) requerirá autorización previa, expresa e informada. <Pending>definir si existen otras finalidades</Pending></p>
      <h2>5. Autorización</h2>
      <p>El titular entrega sus datos al enviar voluntariamente el mensaje de pedido. <Pending>definir mecanismo de autorización conforme a la ley (p. ej. casilla de aceptación o respuesta del negocio con aviso de privacidad)</Pending></p>
      <h2>6. WhatsApp y proveedores externos</h2>
      <p>Los pedidos se envían a través de WhatsApp, servicio de WhatsApp LLC / Meta Platforms. La información compartida por ese medio también es tratada por dicho proveedor conforme a sus propias condiciones y política de privacidad, lo que puede implicar transferencias internacionales de datos. Proveedor de alojamiento web: <Pending>proveedor de hosting</Pending>.</p>
      <h2>7. Conservación</h2>
      <p>Los datos se conservarán durante el tiempo necesario para gestionar el pedido y cumplir obligaciones legales. <Pending>plazo de conservación</Pending></p>
      <h2>8. Derechos del titular</h2>
      <ul>
        <li>Conocer, actualizar y rectificar sus datos.</li>
        <li>Solicitar prueba de la autorización otorgada.</li>
        <li>Ser informado sobre el uso de sus datos.</li>
        <li>Revocar la autorización y/o solicitar la supresión cuando proceda.</li>
        <li>Acceder gratuitamente a sus datos.</li>
        <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</li>
      </ul>
      <h2>9. Procedimiento para ejercer derechos</h2>
      <p>El titular puede escribir a <Field value={S.privacyEmail} label="correo de privacidad" /> indicando nombre, identificación, descripción de la solicitud y medio de respuesta. Las consultas se atenderán en un máximo de diez (10) días hábiles y los reclamos en un máximo de quince (15) días hábiles, en los términos de la Ley 1581 de 2012.</p>
      <h2>10. Seguridad</h2>
      <p>La web no almacena datos personales en servidores propios. El carrito se guarda solo en el navegador del usuario (productos y cantidades). El negocio debe aplicar medidas razonables para proteger los mensajes recibidos. <Pending>medidas internas del negocio</Pending></p>
      <h2>11. Menores de edad</h2>
      <p>Esta web no está dirigida a recopilar datos de menores. Si un menor realiza un pedido, se recomienda la intervención de su representante legal.</p>
      <h2>12. Cambios</h2>
      <p>Cualquier modificación sustancial será publicada en esta página con su nueva fecha de actualización.</p>
    </LegalLayout>
  ),
});
