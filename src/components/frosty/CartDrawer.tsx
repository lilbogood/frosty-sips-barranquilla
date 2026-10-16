import { useEffect, useMemo, useRef, useState } from "react";
import { Trash2, X } from "lucide-react";
import { PRODUCTS, STORE_CONFIG } from "@/config/store";
import {
  buildWhatsappMessage,
  buildWhatsappUrl,
  computeTotals,
  formatCOP,
  isValidWhatsapp,
  validateCustomer,
  type CustomerData,
  type DeliveryMode,
} from "@/lib/cart";
import { useShop } from "./shop-context";

const defaultMode: DeliveryMode = STORE_CONFIG.deliveryEnabled
  ? "domicilio"
  : STORE_CONFIG.pickupEnabled
    ? "recogida"
    : "coordinar";

export function CartDrawer() {
  const { items, update, remove, clear, cartOpen, setCartOpen, storageError } = useShop();
  const ref = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<"cart" | "form" | "review" | "sent">("cart");
  const [c, setC] = useState<CustomerData>({ name: "", phone: "", mode: defaultMode, address: "", zone: "", notes: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerData, string>>>({});

  const totals = useMemo(
    () => computeTotals(items, PRODUCTS, { mode: c.mode, deliveryFeeCOP: STORE_CONFIG.deliveryFeeCOP }),
    [items, c.mode],
  );
  const waReady = isValidWhatsapp(STORE_CONFIG.whatsappNumber);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (cartOpen && !d.open) d.showModal();
    if (!cartOpen && d.open) d.close();
  }, [cartOpen]);

  function close() {
    setCartOpen(false);
    if (step === "sent") setStep("cart");
  }

  function send() {
    const msg = buildWhatsappMessage(STORE_CONFIG.brandName, c, totals, STORE_CONFIG.paymentMethod);
    const url = buildWhatsappUrl(STORE_CONFIG.whatsappNumber, msg);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
    setStep("sent");
  }

  const set = (k: keyof CustomerData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setC((x) => ({ ...x, [k]: e.target.value }));

  const err = (k: keyof CustomerData) =>
    errors[k] ? <p id={`e-${k}`} className="mt-1 text-sm font-semibold text-destructive">⚠ {errors[k]}</p> : null;

  return (
    <dialog
      ref={ref}
      onClose={close}
      aria-labelledby="cart-title"
      className="anim-drawer ml-auto mr-0 h-dvh max-h-dvh w-full max-w-md bg-card p-0 text-card-foreground"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 id="cart-title" className="text-lg font-extrabold">
            {step === "cart" ? "Tu carrito" : step === "form" ? "Datos del pedido" : step === "review" ? "Revisa tu pedido" : "Pedido preparado"}
          </h2>
          <button type="button" onClick={close} aria-label="Cerrar carrito" className="grid size-10 place-items-center rounded-full bg-muted">
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {storageError && <p className="notice mb-3">Tu navegador no permite guardar el carrito; se perderá al recargar.</p>}

          {step === "cart" && (totals.lines.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <p className="text-5xl" aria-hidden>🧊</p>
                <p className="mt-3 font-bold">Tu carrito está vacío</p>
                <p className="text-sm text-muted-foreground">Explora el catálogo y elige tu favorito.</p>
                <button className="btn btn-primary mt-4" onClick={close}>Ver sabores</button>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {totals.lines.map((l) => (
                <li key={l.product.id + l.sizeId} className="anim-fade flex gap-3 rounded-2xl border p-3">
                  <img src={l.product.image} alt="" width={64} height={64} className="size-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-bold leading-tight">{l.product.name}</p>
                    <p className="text-xs text-muted-foreground">{l.sizeLabel} · {formatCOP(l.unitPrice)} c/u</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-full border">
                        <button className="size-8" aria-label={`Reducir ${l.product.name}`} onClick={() => update(l.product.id, l.sizeId, l.qty - 1)}>−</button>
                        <span className="w-7 text-center text-sm font-bold">{l.qty}</span>
                        <button className="size-8" aria-label={`Aumentar ${l.product.name}`} onClick={() => update(l.product.id, l.sizeId, l.qty + 1)}>+</button>
                      </div>
                      <span className="font-bold">{formatCOP(l.lineTotal)}</span>
                    </div>
                  </div>
                  <button aria-label={`Eliminar ${l.product.name}`} onClick={() => remove(l.product.id, l.sizeId)} className="self-start p-1 text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </li>
              ))}
              <li><button className="text-sm font-semibold text-destructive underline" onClick={clear}>Vaciar carrito</button></li>
            </ul>
          ))}

          {step === "form" && (
            <form
              id="checkout"
              noValidate
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const v = validateCustomer(c);
                setErrors(v);
                if (Object.keys(v).length === 0) setStep("review");
                else document.getElementById(`f-${Object.keys(v)[0]}`)?.focus();
              }}
            >
              <div>
                <label htmlFor="f-name" className="text-sm font-bold">Nombre *</label>
                <input id="f-name" className="field mt-1" autoComplete="name" value={c.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} maxLength={80} />
                {err("name")}
              </div>
              <div>
                <label htmlFor="f-phone" className="text-sm font-bold">Teléfono de contacto *</label>
                <input id="f-phone" type="tel" inputMode="tel" className="field mt-1" autoComplete="tel" value={c.phone} onChange={set("phone")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "e-phone" : undefined} maxLength={20} />
                {err("phone")}
              </div>
              <fieldset>
                <legend className="text-sm font-bold">Modalidad de entrega</legend>
                <div className="mt-2 space-y-2">
                  {STORE_CONFIG.deliveryEnabled && (
                    <label className="flex items-center gap-2"><input type="radio" name="mode" checked={c.mode === "domicilio"} onChange={() => setC((x) => ({ ...x, mode: "domicilio" }))} /> Domicilio</label>
                  )}
                  {STORE_CONFIG.pickupEnabled && (
                    <label className="flex items-center gap-2"><input type="radio" name="mode" checked={c.mode === "recogida"} onChange={() => setC((x) => ({ ...x, mode: "recogida" }))} /> Recogida en el establecimiento</label>
                  )}
                  {!STORE_CONFIG.deliveryEnabled && !STORE_CONFIG.pickupEnabled && (
                    <p className="notice">Las modalidades de entrega aún no están configuradas. La forma de entrega, cobertura y costo se coordinarán con FROSTY LAB por WhatsApp.</p>
                  )}
                </div>
              </fieldset>
              {c.mode === "domicilio" && (
                <>
                  <div>
                    <label htmlFor="f-address" className="text-sm font-bold">Dirección de entrega *</label>
                    <input id="f-address" className="field mt-1" autoComplete="street-address" value={c.address} onChange={set("address")} aria-invalid={!!errors.address} aria-describedby={errors.address ? "e-address" : undefined} maxLength={160} />
                    {err("address")}
                  </div>
                  <div>
                    <label htmlFor="f-zone" className="text-sm font-bold">Barrio o zona</label>
                    <input id="f-zone" className="field mt-1" value={c.zone} onChange={set("zone")} maxLength={80} />
                  </div>
                </>
              )}
              <div>
                <label htmlFor="f-notes" className="text-sm font-bold">Observaciones (opcional)</label>
                <textarea id="f-notes" className="field mt-1 min-h-20" value={c.notes} onChange={set("notes")} maxLength={300} />
              </div>
              <p className="text-xs text-muted-foreground">Tus datos no se guardan en esta web: solo se incluyen en el mensaje que tú envías por WhatsApp. Consulta la <a className="underline" href="/privacidad" target="_blank">política de privacidad</a>.</p>
            </form>
          )}

          {step === "review" && (
            <div className="space-y-4 text-sm">
              <ul className="space-y-1">
                {totals.lines.map((l) => (
                  <li key={l.product.id + l.sizeId} className="flex justify-between gap-2"><span>{l.qty} × {l.product.name} ({l.sizeLabel})</span><span className="font-semibold">{formatCOP(l.lineTotal)}</span></li>
                ))}
              </ul>
              <div className="rounded-2xl bg-muted p-4">
                <p><strong>Cliente:</strong> {c.name}</p>
                <p><strong>Teléfono:</strong> {c.phone}</p>
                <p><strong>Entrega:</strong> {c.mode === "domicilio" ? `Domicilio — ${c.address}` : c.mode === "recogida" ? "Recogida" : "Por coordinar por WhatsApp"}</p>
                <p className="mt-2 font-bold">Método de pago: contra entrega.</p>
              </div>
              <p className="notice">La disponibilidad, el costo de envío, las condiciones de pago y la aceptación final del pedido deben ser confirmadas por FROSTY LAB. Enviar el mensaje no confirma el pedido.</p>
              {!waReady && (
                <p role="alert" className="rounded-2xl border-2 border-destructive p-4 font-semibold text-destructive">
                  ⚠ El número comercial de WhatsApp aún no está configurado. El propietario debe añadirlo antes de poder recibir pedidos.
                </p>
              )}
            </div>
          )}

          {step === "sent" && (
            <div className="space-y-3 text-center">
              <p className="text-5xl" aria-hidden>📲</p>
              <p className="font-bold">Abrimos WhatsApp con tu pedido preparado.</p>
              <p className="text-sm text-muted-foreground">Recuerda pulsar <strong>enviar</strong> en WhatsApp. Tu pedido quedará confirmado solo cuando FROSTY LAB te responda.</p>
            </div>
          )}
        </div>

        {totals.lines.length > 0 && step !== "sent" && (
          <div className="space-y-3 border-t px-5 py-4">
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatCOP(totals.subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Envío</dt><dd>{totals.deliveryFee !== null ? formatCOP(totals.deliveryFee) : c.mode === "recogida" ? "—" : "Por confirmar"}</dd></div>
              <div className="flex justify-between text-base font-extrabold"><dt>Total</dt><dd>{formatCOP(totals.total)}</dd></div>
            </dl>
            {step === "cart" && (
              <div className="grid grid-cols-2 gap-2">
                <button className="btn btn-outline" onClick={close}>Seguir comprando</button>
                <button className="btn btn-cta" onClick={() => setStep("form")}>Finalizar pedido</button>
              </div>
            )}
            {step === "form" && (
              <div className="grid grid-cols-2 gap-2">
                <button className="btn btn-outline" onClick={() => setStep("cart")}>Volver</button>
                <button className="btn btn-cta" type="submit" form="checkout">Revisar</button>
              </div>
            )}
            {step === "review" && (
              <div className="grid grid-cols-2 gap-2">
                <button className="btn btn-outline" onClick={() => setStep("form")}>Editar</button>
                <button className="btn btn-cta" disabled={!waReady} onClick={send}>Enviar pedido por WhatsApp</button>
              </div>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
}
