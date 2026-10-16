import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import {
  CATEGORIES,
  DEMO_CATALOG,
  FAQS,
  FEATURED_IDS,
  PRODUCTS,
  PROMOS,
  STORE_CONFIG,
  type CategoryId,
  type Product,
} from "@/config/store";
import { computeTotals, formatCOP, isValidWhatsapp } from "@/lib/cart";
import { ShopProvider, useShop } from "@/components/frosty/shop-context";
import { Header } from "@/components/frosty/Header";
import { ProductCard, accentOf, ImgSafe } from "@/components/frosty/ProductCard";
import { ProductDialog } from "@/components/frosty/ProductDialog";
import { CartDrawer } from "@/components/frosty/CartDrawer";
import { Footer } from "@/components/frosty/Footer";
import { useReveal } from "@/components/frosty/useReveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FROSTY LAB | Granizados en Barranquilla — pide por WhatsApp" },
      { name: "description", content: "Granizados y bebidas frías en Barranquilla. Explora sabores clásicos, tropicales y premium, arma tu pedido y envíalo por WhatsApp con pago contra entrega." },
      { property: "og:title", content: "FROSTY LAB — Congela el calor. Despierta el sabor." },
      { property: "og:description", content: "Granizados llenos de color y frescura en Barranquilla. Pide el tuyo por WhatsApp." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_CO" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${STORE_CONFIG.domain}/` }],
  }),
  component: () => (
    <ShopProvider>
      <Home />
    </ShopProvider>
  ),
});

type Sort = "relevancia" | "precio-asc" | "precio-desc" | "nombre";
const minPrice = (p: Product) => Math.min(...p.sizes.map((s) => s.priceCOP));
const ALL_SIZES = Array.from(new Set(PRODUCTS.flatMap((p) => p.sizes.map((s) => s.label))));
const MAX_P = Math.max(...PRODUCTS.flatMap((p) => p.sizes.map((s) => s.priceCOP)), 0);

function Home() {
  const { items, toast } = useShop();
  const count = computeTotals(items, PRODUCTS, { mode: "recogida", deliveryFeeCOP: null }).count;
  const [detail, setDetail] = useState<Product | null>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [maxPrice, setMaxPrice] = useState(MAX_P);
  const [size, setSize] = useState("");
  const [onlyAvail, setOnlyAvail] = useState(false);
  const [sort, setSort] = useState<Sort>("relevancia");
  const [faq, setFaq] = useState<number | null>(0);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const r = PRODUCTS.filter(
      (p) =>
        (cat === "all" || p.category === cat) &&
        (!term || p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)) &&
        minPrice(p) <= maxPrice &&
        (!size || p.sizes.some((s) => s.label === size)) &&
        (!onlyAvail || p.available === true),
    );
    if (sort === "precio-asc") r.sort((a, b) => minPrice(a) - minPrice(b));
    if (sort === "precio-desc") r.sort((a, b) => minPrice(b) - minPrice(a));
    if (sort === "nombre") r.sort((a, b) => a.name.localeCompare(b.name, "es"));
    return r;
  }, [q, cat, maxPrice, size, onlyAvail, sort]);

  useReveal(list.length + cat);

  const reset = () => {
    setQ(""); setCat("all"); setMaxPrice(MAX_P); setSize(""); setOnlyAvail(false); setSort("relevancia");
  };

  const waReady = isValidWhatsapp(STORE_CONFIG.whatsappNumber);
  function heroWhatsapp() {
    if (!waReady) {
      toast("WhatsApp aún no configurado. Arma tu carrito mientras tanto.");
      document.getElementById("catalogo")?.scrollIntoView();
      return;
    }
    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(`Hola ${STORE_CONFIG.brandName}, quiero hacer un pedido.`)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const featured = PRODUCTS.filter((p) => FEATURED_IDS.includes(p.id));
  const contact = [
    ["WhatsApp", waReady ? `+${STORE_CONFIG.whatsappNumber}` : ""],
    ["Teléfono", STORE_CONFIG.phone],
    ["Correo", STORE_CONFIG.email],
    ["Dirección", STORE_CONFIG.address],
    ["Horarios", STORE_CONFIG.businessHours],
    ["Instagram", STORE_CONFIG.socials.instagram],
    ["Facebook", STORE_CONFIG.socials.facebook],
    ["TikTok", STORE_CONFIG.socials.tiktok],
  ].filter(([, v]) => v);

  return (
    <>
      <a href="#catalogo" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[80] focus:rounded-full focus:bg-card focus:px-4 focus:py-2">Saltar al catálogo</a>
      <Header count={count} />

      <main>
        {/* HERO */}
        <section id="inicio" className="bg-hero relative overflow-hidden text-snow">
          <ImgSafe src={heroImg} alt="Granizado azul y rosado con hielo triturado, frutas tropicales y salpicaduras" width={1536} height={1024} fetchPriority="high" className="absolute inset-0 size-full object-cover object-[70%_center]" />
          <div className="absolute inset-0 bg-gradient-to-r from-ice-blue via-ice-blue/70 to-transparent" aria-hidden />
          <span aria-hidden className="anim-float absolute left-[8%] top-[18%] size-6 rotate-12 rounded-md bg-light-ice/60" />
          <span aria-hidden className="anim-float absolute bottom-[22%] left-[44%] size-4 rounded-full bg-lemon/80" style={{ animationDelay: "1.2s" }} />
          <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-20 pt-28">
            <p className="anim-rise text-sm font-bold uppercase tracking-[0.25em] text-light-ice">Granizados · Barranquilla</p>
            <h1 className="anim-rise mt-4 max-w-2xl text-4xl font-black leading-[1.02] sm:text-6xl lg:text-7xl" style={{ animationDelay: ".1s" }}>
              EL CALOR NO TIENE NADA QUE HACER AQUÍ.
            </h1>
            <p className="anim-rise mt-6 max-w-lg text-lg opacity-95" style={{ animationDelay: ".25s" }}>
              Descubre granizados llenos de color, sabor y frescura. Encuentra tu favorito y pide el tuyo con FROSTY LAB.
            </p>
            <div className="anim-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: ".4s" }}>
              <a href="#catalogo" className="btn btn-cta">Explorar sabores</a>
              <button type="button" onClick={heroWhatsapp} className="btn btn-ghost">Pedir por WhatsApp</button>
            </div>
            {!waReady && <p className="anim-rise mt-3 text-xs opacity-80" style={{ animationDelay: ".5s" }}>Pedidos por WhatsApp disponibles cuando el negocio configure su número comercial.</p>}
            <a href="#sabores" aria-label="Desplazarse a los sabores" className="anim-bounce absolute bottom-6 left-1/2 -translate-x-1/2">
              <ChevronDown className="size-8" aria-hidden />
            </a>
          </div>
        </section>

        {/* DESTACADOS */}
        <section id="sabores" className="bg-ice py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="reveal text-3xl font-black sm:text-5xl">Sabores <span className="text-gradient">destacados</span></h2>
            <p className="reveal mt-3 text-muted-foreground">{STORE_CONFIG.sloganSecondary}</p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setDetail(p)}
                  className={`reveal card-product accent-${accentOf(p)} text-left ${i % 2 ? "lg:mt-10" : ""}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="acc-bg aspect-[4/5] overflow-hidden">
                    <ImgSafe src={p.image} alt={p.alt} width={816} height={816} loading="lazy" className="size-full object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                    <p className="acc-text mt-2 font-bold">Desde {formatCOP(minPrice(p))}{p.demo ? " · demo" : ""}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CATÁLOGO */}
        <section id="catalogo" className="py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="reveal text-3xl font-black sm:text-5xl">ENCUENTRA TU PRÓXIMO FAVORITO.</h2>
            <p className="reveal mt-3 text-muted-foreground">Sabores refrescantes para acompañar tus mejores momentos.</p>
            {DEMO_CATALOG && (
              <p className="notice mt-6" role="note">
                <strong>Catálogo de demostración.</strong> Los sabores y precios son de prueba y no representan la oferta real hasta que FROSTY LAB los confirme.
              </p>
            )}

            <div className="mt-8 space-y-4 rounded-3xl border bg-card p-4 sm:p-5">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Categorías">
                <button type="button" className="chip" aria-pressed={cat === "all"} onClick={() => setCat("all")}>Todos</button>
                {CATEGORIES.map((c) => (
                  <button key={c.id} type="button" className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="relative block">
                  <span className="sr-only">Buscar por nombre</span>
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <input className="field !pl-9" placeholder="Buscar sabor…" value={q} onChange={(e) => setQ(e.target.value)} />
                </label>
                <label className="block text-sm">
                  <span className="font-semibold">Precio máx.: {formatCOP(maxPrice)}</span>
                  <input type="range" className="w-full accent-ice-blue" min={0} max={MAX_P} step={500} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
                </label>
                <label className="block">
                  <span className="sr-only">Tamaño</span>
                  <select className="field" value={size} onChange={(e) => setSize(e.target.value)}>
                    <option value="">Todos los tamaños</option>
                    {ALL_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="sr-only">Ordenar</span>
                  <select className="field" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                    <option value="relevancia">Orden: destacados</option>
                    <option value="precio-asc">Precio: menor a mayor</option>
                    <option value="precio-desc">Precio: mayor a menor</option>
                    <option value="nombre">Nombre (A–Z)</option>
                  </select>
                </label>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={onlyAvail} onChange={(e) => setOnlyAvail(e.target.checked)} className="size-4" />
                  Solo disponibilidad confirmada
                </label>
                <span aria-live="polite" className="text-muted-foreground">{list.length} productos</span>
                <button type="button" className="font-semibold text-primary underline" onClick={reset}>Limpiar filtros</button>
              </div>
            </div>

            {PRODUCTS.length === 0 ? (
              <p className="mt-10 text-center text-muted-foreground">El catálogo aún no tiene productos.</p>
            ) : list.length === 0 ? (
              <div className="anim-fade mt-10 rounded-3xl border border-dashed p-10 text-center">
                <p className="text-4xl" aria-hidden>🔍</p>
                <p className="mt-2 font-bold">No encontramos sabores con esos filtros</p>
                {onlyAvail && <p className="text-sm text-muted-foreground">Ningún producto tiene disponibilidad confirmada todavía.</p>}
                <button type="button" className="btn btn-primary mt-4" onClick={reset}>Restablecer catálogo</button>
              </div>
            ) : (
              <div key={cat} className="anim-fade mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {list.map((p) => <ProductCard key={p.id} p={p} onDetails={setDetail} />)}
              </div>
            )}
          </div>
        </section>

        {/* CÓMO PEDIR */}
        <section className="section-dark py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="reveal text-3xl font-black sm:text-5xl">Cómo pedir</h2>
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                ["Explora los sabores", "Filtra por categoría, tamaño o precio."],
                ["Personaliza el carrito", "Elige tamaños y cantidades."],
                ["Envía tu pedido por WhatsApp", "Y espera la confirmación de FROSTY LAB. Pagas contra entrega."],
              ].map(([t, d], i) => (
                <li key={t} className="reveal rounded-3xl bg-snow/5 p-6" style={{ transitionDelay: `${i * 100}ms` }}>
                  <span className="text-gradient font-display text-5xl font-black">0{i + 1}</span>
                  <h3 className="mt-3 text-xl font-bold">{t}</h3>
                  <p className="mt-1 opacity-75">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* PROMOCIONES */}
        <section id="promociones" className="py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="reveal text-3xl font-black sm:text-5xl">Promociones y combos</h2>
            {PROMOS.every((p) => !p.active) && (
              <p className="reveal mt-3 text-muted-foreground">Por ahora no hay promociones activas. Estos espacios se activarán cuando FROSTY LAB publique sus combos.</p>
            )}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PROMOS.map((p, i) => (
                <article key={p.id} className={`reveal rounded-3xl p-6 ${i === 0 ? "bg-sunset text-snow" : "border bg-card"}`}>
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p className="mt-1 text-sm opacity-80">Incluye: {p.includes}</p>
                  <p className="mt-4 font-display text-xl font-bold">{p.priceCOP !== null ? formatCOP(p.priceCOP) : "Precio por confirmar"}</p>
                  {p.conditions && <p className="mt-2 text-xs">{p.conditions}</p>}
                  {p.validity && <p className="text-xs">Vigencia: {p.validity}</p>}
                  <p className="mt-3 inline-block rounded-full bg-night/10 px-3 py-1 text-xs font-bold">{p.active ? "Activa" : "Próximamente"}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* MARCA */}
        <section id="marca" className="bg-ice py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2">
            <div className="reveal">
              <h2 className="text-3xl font-black sm:text-5xl">Sobre <span className="text-gradient">FROSTY LAB</span></h2>
              <p className="mt-5 text-lg">{STORE_CONFIG.slogan}</p>
              <p className="mt-3 text-muted-foreground">
                FROSTY LAB es una marca de granizados en {STORE_CONFIG.city} pensada para los días de calor: mucho color, mucho hielo y sabores para todos los gustos.
              </p>
              <p className="notice mt-5">Texto editable. La historia y los procesos de la marca se publicarán cuando el propietario los proporcione.</p>
            </div>
            <div className="reveal grid grid-cols-2 gap-4">
              <ImgSafe src={PRODUCTS[6]?.image} alt="Granizado tropical de mango y maracuyá" width={816} height={816} loading="lazy" className="aspect-square rounded-3xl object-cover" />
              <ImgSafe src={PRODUCTS[20]?.image} alt="Granizado premium de frutos rojos en capas" width={816} height={816} loading="lazy" className="mt-10 aspect-square rounded-3xl object-cover" />
            </div>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <h2 className="reveal text-2xl font-black sm:text-4xl">Lo que dicen nuestros clientes</h2>
            <p className="reveal mt-4 text-muted-foreground">Pronto compartiremos opiniones reales de clientes de FROSTY LAB.</p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="reveal text-3xl font-black sm:text-5xl">Preguntas frecuentes</h2>
            <div className="mt-8 divide-y rounded-3xl border bg-card">
              {FAQS.map((f, i) => (
                <div key={f.q}>
                  <h3>
                    <button
                      type="button"
                      id={`faq-b-${i}`}
                      aria-expanded={faq === i}
                      aria-controls={`faq-p-${i}`}
                      onClick={() => setFaq(faq === i ? null : i)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left font-sans text-base font-bold"
                    >
                      {f.q}
                      <ChevronDown className={`size-5 shrink-0 transition-transform ${faq === i ? "rotate-180" : ""}`} aria-hidden />
                    </button>
                  </h3>
                  <div id={`faq-p-${i}`} role="region" aria-labelledby={`faq-b-${i}`} className="acc-panel" data-open={faq === i}>
                    <div><p className="px-5 pb-5 text-muted-foreground">{f.a}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="bg-hero py-20 text-snow">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <h2 className="reveal text-3xl font-black sm:text-5xl">Contacto</h2>
            {contact.length > 0 ? (
              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                {contact.map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-snow/10 p-4"><dt className="text-sm opacity-75">{k}</dt><dd className="font-bold">{v}</dd></div>
                ))}
              </dl>
            ) : (
              <p className="reveal mt-5 opacity-90">Los datos de contacto, horarios y zonas de entrega se publicarán pronto.</p>
            )}
            <a href="#catalogo" className="btn btn-cta mt-8">Armar mi pedido</a>
          </div>
        </section>
      </main>

      <Footer />
      <ProductDialog product={detail} onClose={() => setDetail(null)} />
      <CartDrawer />
    </>
  );
}
