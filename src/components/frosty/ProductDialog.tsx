import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Product } from "@/config/store";
import { clampQty, formatCOP } from "@/lib/cart";
import { useShop } from "./shop-context";
import { ImgSafe } from "./ProductCard";

/** Usa <dialog>.showModal(): bloquea el fondo, gestiona foco y cierra con Escape. */
export function ProductDialog({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { add, toast } = useShop();
  const [size, setSize] = useState("");
  const [qty, setQ] = useState(1);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (product) {
      setSize(product.sizes[0]?.id ?? "");
      setQ(1);
      if (!d.open) d.showModal();
    } else if (d.open) d.close();
  }, [product]);

  const sel = product?.sizes.find((s) => s.id === size);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="pd-title"
      className="m-auto w-[min(56rem,calc(100%-1.5rem))] max-h-[calc(100dvh-1.5rem)] overflow-auto rounded-3xl bg-card p-0 text-card-foreground"
    >
      {product && (
        <div className="grid sm:grid-cols-2">
          <div className="relative aspect-square bg-muted">
            <ImgSafe src={product.image} alt={product.alt} width={816} height={816} className="size-full object-cover" />
          </div>
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 id="pd-title" className="text-2xl font-extrabold">{product.name}</h2>
              <button type="button" onClick={() => ref.current?.close()} aria-label="Cerrar detalles" className="grid size-10 shrink-0 place-items-center rounded-full bg-muted">
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <p className="text-muted-foreground">{product.description}</p>
            {product.demo && <p className="notice">Producto y precio de demostración. Disponibilidad por confirmar.</p>}
            <fieldset>
              <legend className="mb-2 text-sm font-bold">Tamaño</legend>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s.id} type="button" aria-pressed={size === s.id} onClick={() => setSize(s.id)} className="chip">
                    {s.label} · {formatCOP(s.priceCOP)}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold" id="qty-l">Cantidad</span>
              <div className="flex items-center rounded-full border" role="group" aria-labelledby="qty-l">
                <button type="button" className="size-10" aria-label="Reducir cantidad" onClick={() => setQ((q) => clampQty(q - 1))}>−</button>
                <span className="w-8 text-center font-bold" aria-live="polite">{qty}</span>
                <button type="button" className="size-10" aria-label="Aumentar cantidad" onClick={() => setQ((q) => clampQty(q + 1))}>+</button>
              </div>
            </div>
            <dl className="space-y-2 text-sm">
              <div><dt className="font-bold">Ingredientes</dt><dd className="text-muted-foreground">{product.ingredients ?? "Información pendiente de confirmar por el negocio."}</dd></div>
              <div><dt className="font-bold">Alérgenos</dt><dd className="text-muted-foreground">{product.allergens ?? "Información pendiente. Si tienes alergias, consulta antes de pedir."}</dd></div>
            </dl>
            <button
              type="button"
              className="btn btn-cta mt-auto w-full"
              disabled={!sel || product.available === false}
              onClick={() => {
                add(product.id, size, qty);
                toast(`${qty} × ${product.name} añadido al carrito`);
                ref.current?.close();
              }}
            >
              Añadir {sel ? `· ${formatCOP(sel.priceCOP * qty)}` : ""}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
