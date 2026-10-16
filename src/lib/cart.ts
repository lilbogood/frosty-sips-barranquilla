import type { Product } from "@/config/store";

export interface CartItem {
  productId: string;
  sizeId: string;
  qty: number;
}

export const MAX_QTY = 99;

export function clampQty(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(MAX_QTY, Math.max(1, Math.floor(n)));
}

export function addItem(items: CartItem[], productId: string, sizeId: string, qty = 1): CartItem[] {
  const i = items.findIndex((x) => x.productId === productId && x.sizeId === sizeId);
  if (i === -1) return [...items, { productId, sizeId, qty: clampQty(qty) }];
  return items.map((x, j) => (j === i ? { ...x, qty: clampQty(x.qty + qty) } : x));
}

export function setQty(items: CartItem[], productId: string, sizeId: string, qty: number): CartItem[] {
  if (qty <= 0) return removeItem(items, productId, sizeId);
  return items.map((x) =>
    x.productId === productId && x.sizeId === sizeId ? { ...x, qty: clampQty(qty) } : x,
  );
}

export function removeItem(items: CartItem[], productId: string, sizeId: string): CartItem[] {
  return items.filter((x) => !(x.productId === productId && x.sizeId === sizeId));
}

/** Limpia datos leídos del navegador (pueden estar manipulados). */
export function sanitizeCart(raw: unknown, products: Product[]): CartItem[] {
  if (!Array.isArray(raw)) return [];
  let out: CartItem[] = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const { productId, sizeId, qty } = r as Record<string, unknown>;
    if (typeof productId !== "string" || typeof sizeId !== "string" || typeof qty !== "number") continue;
    const prod = products.find((p) => p.id === productId);
    if (!prod || !prod.sizes.some((s) => s.id === sizeId) || qty < 1) continue;
    out = addItem(out, productId, sizeId, qty);
  }
  return out;
}

export interface CartLine {
  product: Product;
  sizeId: string;
  sizeLabel: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
}

export type DeliveryMode = "domicilio" | "recogida" | "coordinar";

/** Precios siempre leídos del catálogo, nunca del carrito guardado. */
export function computeTotals(
  items: CartItem[],
  products: Product[],
  opts: { mode: DeliveryMode; deliveryFeeCOP: number | null },
) {
  const lines: CartLine[] = [];
  for (const it of items) {
    const product = products.find((p) => p.id === it.productId);
    const size = product?.sizes.find((s) => s.id === it.sizeId);
    if (!product || !size || !Number.isFinite(size.priceCOP) || size.priceCOP < 0) continue;
    const qty = clampQty(it.qty);
    lines.push({
      product,
      sizeId: size.id,
      sizeLabel: size.label,
      unitPrice: size.priceCOP,
      qty,
      lineTotal: size.priceCOP * qty,
    });
  }
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const fee =
    opts.mode === "domicilio" && typeof opts.deliveryFeeCOP === "number" && opts.deliveryFeeCOP >= 0
      ? opts.deliveryFeeCOP
      : null;
  const count = lines.reduce((s, l) => s + l.qty, 0);
  return { lines, subtotal, deliveryFee: fee, discount: 0, total: subtotal + (fee ?? 0), count };
}

export function formatCOP(n: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}

/** wa.me exige solo dígitos con código de país. */
export function isValidWhatsapp(num: string): boolean {
  return /^\d{10,15}$/.test(num);
}

export interface CustomerData {
  name: string;
  phone: string;
  mode: DeliveryMode;
  address: string;
  zone: string;
  notes: string;
}

export function buildWhatsappMessage(
  brand: string,
  c: CustomerData,
  totals: ReturnType<typeof computeTotals>,
  paymentMethod: string,
): string {
  const modeLabel =
    c.mode === "domicilio" ? "Domicilio" : c.mode === "recogida" ? "Recogida en el establecimiento" : "Por coordinar con el negocio";
  const out: string[] = [];
  out.push(`*${brand} — Solicitud de pedido*`);
  out.push("");
  out.push(`Cliente: ${c.name.trim()}`);
  if (c.phone.trim()) out.push(`Teléfono: ${c.phone.trim()}`);
  out.push("");
  out.push("*Productos:*");
  for (const l of totals.lines) {
    out.push(`• ${l.product.name} (${l.sizeLabel}) x${l.qty} — ${formatCOP(l.unitPrice)} c/u = ${formatCOP(l.lineTotal)}`);
  }
  out.push("");
  out.push(`Entrega: ${modeLabel}`);
  if (c.mode === "domicilio") {
    out.push(`Dirección: ${c.address.trim()}`);
    if (c.zone.trim()) out.push(`Barrio/zona: ${c.zone.trim()}`);
  }
  out.push(`Subtotal: ${formatCOP(totals.subtotal)}`);
  if (totals.deliveryFee !== null) out.push(`Envío: ${formatCOP(totals.deliveryFee)}`);
  else if (c.mode !== "recogida") out.push("Envío: por confirmar");
  if (totals.discount > 0) out.push(`Descuento: -${formatCOP(totals.discount)}`);
  out.push(`*Total: ${formatCOP(totals.total)}*${totals.deliveryFee === null && c.mode !== "recogida" ? " (sin envío)" : ""}`);
  out.push(`Método de pago: ${paymentMethod.toLowerCase()}`);
  if (c.notes.trim()) {
    out.push("");
    out.push(`Observaciones: ${c.notes.trim()}`);
  }
  out.push("");
  out.push("Quedo atento(a) a la confirmación del pedido.");
  return out.join("\n");
}

export function buildWhatsappUrl(number: string, text: string): string | null {
  if (!isValidWhatsapp(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function validateCustomer(c: CustomerData): Partial<Record<keyof CustomerData, string>> {
  const e: Partial<Record<keyof CustomerData, string>> = {};
  if (c.name.trim().length < 2) e.name = "Escribe tu nombre (mínimo 2 caracteres).";
  const digits = c.phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) e.phone = "Escribe un teléfono válido (7 a 15 dígitos).";
  if (c.mode === "domicilio" && c.address.trim().length < 5) e.address = "Escribe la dirección de entrega.";
  return e;
}
