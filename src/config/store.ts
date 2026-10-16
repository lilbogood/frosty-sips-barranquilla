/**
 * FROSTY LAB — CONFIGURACIÓN CENTRALIZADA
 * Todo lo comercial se edita aquí: contacto, catálogo, precios, tamaños,
 * promociones, entregas y datos legales.
 *
 * REGLA: los campos vacíos ("" / null / []) significan "pendiente de
 * confirmar por el propietario". La interfaz los oculta o muestra un aviso.
 * Nunca rellenar con datos inventados.
 */
import imgClasicos from "@/assets/cat-clasicos.jpg";
import imgTropicales from "@/assets/cat-tropicales.jpg";
import imgPremium from "@/assets/cat-premium.jpg";
import imgHero from "@/assets/hero.jpg";

export const STORE_CONFIG = {
  brandName: "FROSTY LAB",
  slogan: "Congela el calor. Despierta el sabor.",
  sloganSecondary: "Tu momento más frío, tu sabor favorito.",
  city: "Barranquilla",
  country: "Colombia",
  locale: "es-CO",
  currency: "COP",
  /** Código de país + número, solo dígitos. Ej. formato: 57XXXXXXXXXX. VACÍO = pendiente. */
  whatsappNumber: "",
  domain: "https://www.granizadoscollil.com",
  paymentMethod: "Contra entrega",
  deliveryEnabled: false,
  pickupEnabled: false,
  /** Número en COP o null si no está definido. */
  deliveryFeeCOP: null as number | null,
  deliveryZones: [] as string[],
  deliveryTime: "",
  address: "",
  email: "",
  phone: "",
  businessHours: "",
  legalBusinessName: "",
  taxId: "",
  privacyEmail: "",
  socials: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },
  /** Fecha de última actualización de los documentos legales (borrador). */
  legalUpdated: "",
};

/** true mientras el catálogo y los precios sean de prueba. */
export const DEMO_CATALOG = true;

export type CategoryId = "clasicos" | "tropicales" | "especiales" | "premium";

export const CATEGORIES: { id: CategoryId; label: string; accent: string }[] = [
  { id: "clasicos", label: "Clásicos", accent: "ice" },
  { id: "tropicales", label: "Tropicales", accent: "mango" },
  { id: "especiales", label: "Combinaciones especiales", accent: "turquoise" },
  { id: "premium", label: "Premium", accent: "pink" },
];

export interface Size {
  id: string;
  label: string;
  priceCOP: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  image: string;
  alt: string;
  sizes: Size[];
  /** true = disponibilidad confirmada; null = sin confirmar; false = agotado. */
  available: boolean | null;
  tag?: string;
  ingredients: string | null;
  allergens: string | null;
  demo: boolean;
}

// PRECIOS DE DEMOSTRACIÓN — sustituir por los precios reales en COP.
const DEMO_SIZES: Size[] = [
  { id: "s", label: "Pequeño", priceCOP: 6000 },
  { id: "m", label: "Mediano", priceCOP: 8000 },
  { id: "l", label: "Grande", priceCOP: 10000 },
];
const DEMO_SIZES_PREMIUM: Size[] = [
  { id: "m", label: "Mediano", priceCOP: 11000 },
  { id: "l", label: "Grande", priceCOP: 14000 },
];

const IMG: Record<CategoryId, string> = {
  clasicos: imgClasicos,
  tropicales: imgTropicales,
  especiales: imgHero,
  premium: imgPremium,
};

function p(
  id: string,
  name: string,
  category: CategoryId,
  description: string,
  tag?: string,
): Product {
  return {
    id,
    name,
    description,
    category,
    image: IMG[category],
    alt: `Granizado ${name} en vaso transparente (imagen ilustrativa)`,
    sizes: category === "premium" ? DEMO_SIZES_PREMIUM : DEMO_SIZES,
    available: null,
    tag,
    ingredients: null,
    allergens: null,
    demo: true,
  };
}

export const PRODUCTS: Product[] = [
  p("blue-ice", "Blue Ice", "clasicos", "Un azul intenso y helado para empezar fuerte.", "Favorito"),
  p("fresa-fresh", "Fresa Fresh", "clasicos", "El clásico rojo de toda la vida, bien frío."),
  p("mango-tropical", "Mango Tropical", "clasicos", "Sabor a mango en hielo triturado."),
  p("limon-explosivo", "Limón Explosivo", "clasicos", "Ácido, chispeante y refrescante."),
  p("uva-polar", "Uva Polar", "clasicos", "Uva profunda con un final helado."),
  p("cola-freeze", "Cola Freeze", "clasicos", "Sabor cola convertido en granizado."),
  p("mango-sunset", "Mango Sunset", "tropicales", "Tonos de atardecer en cada sorbo.", "Nuevo"),
  p("pina-paradise", "Piña Paradise", "tropicales", "Piña dulce para días de brisa."),
  p("maracuya-chill", "Maracuyá Chill", "tropicales", "El toque ácido del maracuyá, helado."),
  p("tropical-mix", "Tropical Mix", "tropicales", "Mezcla de sabores del trópico."),
  p("sandia-splash", "Sandía Splash", "tropicales", "Ligero y refrescante como la sandía."),
  p("coco-breeze", "Coco Breeze", "tropicales", "Sabor a coco con alma caribeña."),
  p("blueberry-storm", "Blueberry Storm", "especiales", "Una tormenta de arándano azul."),
  p("fresa-mango-duo", "Fresa-Mango Duo", "especiales", "Dos favoritos en un solo vaso."),
  p("citrus-power", "Citrus Power", "especiales", "Combinación cítrica con energía."),
  p("rainbow-freeze", "Rainbow Freeze", "especiales", "Capas de color para compartir en fotos.", "Para compartir"),
  p("berry-explosion", "Berry Explosion", "especiales", "Frutos rojos en modo explosión."),
  p("tropical-rush", "Tropical Rush", "especiales", "Un golpe tropical bien frío."),
  p("arctic-blue", "Arctic Blue", "premium", "Nuestra versión más polar del azul."),
  p("golden-mango", "Golden Mango", "premium", "Mango en su versión dorada."),
  p("pink-blizzard", "Pink Blizzard", "premium", "Una ventisca rosada de sabor.", "Premium"),
  p("double-fruit", "Double Fruit", "premium", "Doble fruta, doble sabor."),
  p("frosty-signature", "Frosty Signature", "premium", "La receta firma de FROSTY LAB.", "Signature"),
];

export const FEATURED_IDS = ["blue-ice", "mango-sunset", "rainbow-freeze", "pink-blizzard"];

export interface Promo {
  id: string;
  name: string;
  includes: string;
  /** null = precio pendiente: la promo no se puede añadir al carrito. */
  priceCOP: number | null;
  conditions: string;
  validity: string;
  active: boolean;
}

// Ninguna promoción está activa hasta que el propietario la confirme.
export const PROMOS: Promo[] = [
  { id: "combo-refrescante", name: "Combo refrescante", includes: "Pendiente de definir", priceCOP: null, conditions: "", validity: "", active: false },
  { id: "duo-tropical", name: "Dúo tropical", includes: "Pendiente de definir", priceCOP: null, conditions: "", validity: "", active: false },
  { id: "pack-compartir", name: "Pack para compartir", includes: "Pendiente de definir", priceCOP: null, conditions: "", validity: "", active: false },
  { id: "sabor-destacado", name: "Sabor destacado", includes: "Pendiente de definir", priceCOP: null, conditions: "", validity: "", active: false },
];

export const FAQS: { q: string; a: string }[] = [
  { q: "¿Qué sabores tienen disponibles?", a: "El catálogo actual es de demostración. La disponibilidad real de cada sabor se confirma por WhatsApp al hacer tu pedido." },
  { q: "¿Qué tamaños manejan?", a: "Los tamaños y precios mostrados son de prueba hasta que FROSTY LAB publique los definitivos." },
  { q: "¿Hacen domicilios?", a: "Las zonas de cobertura, el costo y los tiempos de entrega aún están pendientes de confirmar. Consúltalos por WhatsApp." },
  { q: "¿Cómo se paga?", a: "El método de pago es contra entrega. Las condiciones exactas se confirman con el negocio antes de aceptar el pedido." },
  { q: "¿Qué ingredientes llevan los granizados?", a: "La información de ingredientes se publicará cuando esté confirmada por el negocio." },
  { q: "¿Tienen información de alérgenos?", a: "Aún no hay información de alérgenos confirmada. Si tienes alguna alergia, pregunta antes de pedir." },
  { q: "¿Cuándo queda confirmado mi pedido?", a: "Enviar el mensaje por WhatsApp es una solicitud. El pedido queda confirmado solo cuando FROSTY LAB te responde aceptándolo." },
];
