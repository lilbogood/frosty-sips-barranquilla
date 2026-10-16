import { Link } from "@tanstack/react-router";
import { STORE_CONFIG } from "@/config/store";
import { Logo } from "./Logo";
import { openCookiePreferences } from "./CookieConsent";

export function Footer() {
  return (
    <footer className="section-dark">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-3 text-sm opacity-80">{STORE_CONFIG.slogan}</p>
          <p className="mt-1 text-sm opacity-60">{STORE_CONFIG.city}, {STORE_CONFIG.country}</p>
        </div>
        <nav aria-label="Legal" className="flex flex-col gap-2 text-sm">
          <span className="font-bold">Legal</span>
          <Link to="/privacidad" className="opacity-80 hover:opacity-100">Política de privacidad</Link>
          <Link to="/terminos" className="opacity-80 hover:opacity-100">Términos y condiciones</Link>
          <Link to="/cookies" className="opacity-80 hover:opacity-100">Política de cookies</Link>
          <button type="button" onClick={openCookiePreferences} className="text-left opacity-80 hover:opacity-100">
            Preferencias de cookies
          </button>
        </nav>
        <div className="text-sm opacity-70">
          <p>Pago: {STORE_CONFIG.paymentMethod.toLowerCase()}.</p>
          <p className="mt-2">Logotipo provisional. Imágenes ilustrativas generadas para demostración.</p>
        </div>
      </div>
      <p className="border-t border-snow/10 py-5 text-center text-xs opacity-60">
        © {new Date().getFullYear()} {STORE_CONFIG.legalBusinessName || STORE_CONFIG.brandName}
      </p>
    </footer>
  );
}
