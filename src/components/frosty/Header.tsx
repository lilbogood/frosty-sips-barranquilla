import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { Logo } from "./Logo";
import { useShop } from "./shop-context";

const NAV = [
  ["#inicio", "Inicio"],
  ["#catalogo", "Catálogo"],
  ["#sabores", "Sabores"],
  ["#promociones", "Promociones"],
  ["#marca", "Nuestra marca"],
  ["#faq", "Preguntas frecuentes"],
  ["#contacto", "Contacto"],
] as const;

export function Header({ count }: { count: number }) {
  const { setCartOpen, bump } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  const light = !scrolled && !open;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open ? "header-scrolled" : ""}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
        <a href="#inicio" aria-label="FROSTY LAB, inicio"><Logo light={light} /></a>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className={`flex gap-5 text-sm font-semibold ${light ? "text-snow" : "text-night"}`}>
            {NAV.map(([h, l]) => (
              <li key={h}><a href={h} className="opacity-90 hover:opacity-100">{l}</a></li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Abrir carrito, ${count} productos`}
            className={`relative grid size-11 place-items-center rounded-full ${light ? "bg-snow/20 text-snow" : "bg-muted text-night"}`}
          >
            <ShoppingBag className="size-5" aria-hidden />
            {count > 0 && (
              <span key={bump} className="anim-bump absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-pink px-1 text-xs font-bold text-snow">
                {count}
              </span>
            )}
          </button>
          <a href="#catalogo" className="btn btn-cta hidden sm:inline-flex">Pedir ahora</a>
          <button
            type="button"
            className={`grid size-11 place-items-center rounded-full lg:hidden ${light ? "text-snow" : "text-night"}`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Móvil" className="anim-fade border-t bg-card px-5 pb-6 lg:hidden">
          <ul className="flex flex-col">
            {NAV.map(([h, l], i) => (
              <li key={h} className="anim-rise" style={{ animationDelay: `${i * 40}ms` }}>
                <a href={h} onClick={() => setOpen(false)} className="block border-b py-3.5 font-semibold">{l}</a>
              </li>
            ))}
          </ul>
          <a href="#catalogo" onClick={() => setOpen(false)} className="btn btn-cta mt-4 w-full">Pedir ahora</a>
        </nav>
      )}
    </header>
  );
}
