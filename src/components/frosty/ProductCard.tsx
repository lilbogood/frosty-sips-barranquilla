import { useState } from "react";
import { CATEGORIES, type Product } from "@/config/store";
import { formatCOP } from "@/lib/cart";
import { useShop } from "./shop-context";

export function accentOf(p: Product) {
  return CATEGORIES.find((c) => c.id === p.category)?.accent ?? "ice";
}

export function ImgSafe(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [err, setErr] = useState(false);
  if (err)
    return (
      <div role="img" aria-label={props.alt} className="grid size-full place-items-center bg-muted text-sm text-muted-foreground">
        Imagen no disponible
      </div>
    );
  return <img {...props} onError={() => setErr(true)} />;
}

export function ProductCard({ p, onDetails }: { p: Product; onDetails: (p: Product) => void }) {
  const { add, toast } = useShop();
  const [size, setSize] = useState(p.sizes[0]?.id ?? "");
  const sel = p.sizes.find((s) => s.id === size);
  const cat = CATEGORIES.find((c) => c.id === p.category);
  const soldOut = p.available === false;

  return (
    <article className={`card-product accent-${accentOf(p)} flex flex-col`}>
      <div className="acc-bar" />
      <div className="acc-bg relative aspect-square overflow-hidden">
        <ImgSafe src={p.image} alt={p.alt} width={816} height={816} loading="lazy" className="size-full object-cover" />
        {p.tag && <span className="absolute left-3 top-3 rounded-full bg-night px-3 py-1 text-xs font-bold text-snow">{p.tag}</span>}
        {p.demo && <span className="absolute right-3 top-3 rounded-full bg-warning px-2.5 py-1 text-[11px] font-bold text-warning-foreground">Demo</span>}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="acc-text text-xs font-bold uppercase tracking-wider">{cat?.label}</p>
          <h3 className="mt-1 text-lg font-bold">{p.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
        </div>
        <div role="radiogroup" aria-label={`Tamaño de ${p.name}`} className="flex flex-wrap gap-1.5">
          {p.sizes.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={size === s.id}
              aria-pressed={size === s.id}
              onClick={() => setSize(s.id)}
              className="chip !min-h-9 !px-3 !text-xs"
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="font-display text-xl font-bold">{sel ? formatCOP(sel.priceCOP) : "—"}</p>
        {soldOut && <p className="text-sm font-semibold text-destructive">No disponible</p>}
        <div className="mt-auto grid grid-cols-2 gap-2">
          <button type="button" className="btn btn-outline !px-3 text-sm" onClick={() => onDetails(p)}>Ver detalles</button>
          <button
            type="button"
            className="btn btn-primary !px-3 text-sm"
            disabled={soldOut || !sel}
            onClick={() => {
              add(p.id, size, 1);
              toast(`${p.name} (${sel?.label}) añadido al carrito`);
            }}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </article>
  );
}
