import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const KEY = "frostylab-consent-v1";
export const OPEN_COOKIE_EVENT = "frostylab:open-cookies";

export interface Consent { necessary: true; preferences: boolean; analytics: boolean; date: string }

export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    return { necessary: true, preferences: c.preferences === true, analytics: c.analytics === true, date: String(c.date ?? "") };
  } catch {
    return null;
  }
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_COOKIE_EVENT));
}

/**
 * Banner de consentimiento. Actualmente NO hay scripts de analítica ni publicidad
 * instalados; las categorías opcionales quedan listas para el futuro. Cualquier
 * script opcional debe cargarse solo si readConsent() lo permite.
 */
export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [panel, setPanel] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const c = readConsent();
    if (!c) setShow(true);
    const open = () => {
      const cur = readConsent();
      setPrefs(cur?.preferences ?? false);
      setAnalytics(cur?.analytics ?? false);
      setPanel(true);
      setShow(true);
    };
    window.addEventListener(OPEN_COOKIE_EVENT, open);
    return () => window.removeEventListener(OPEN_COOKIE_EVENT, open);
  }, []);

  function save(p: boolean, a: boolean) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ preferences: p, analytics: a, date: new Date().toISOString() }));
      setError(false);
      setShow(false);
      setPanel(false);
    } catch {
      setError(true);
    }
  }

  if (!show) return null;
  return (
    <div role="dialog" aria-modal="false" aria-labelledby="ck-title" className="anim-rise fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl rounded-3xl border bg-card p-5 text-card-foreground shadow-2xl sm:p-6">
      <h2 id="ck-title" className="text-base font-bold">Tu privacidad en FROSTY LAB</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Usamos almacenamiento local estrictamente necesario para recordar tu carrito y tu elección de cookies. Las categorías opcionales solo se activarán si las aceptas. Hoy no hay herramientas de analítica ni publicidad instaladas.{" "}
        <Link to="/cookies" className="font-semibold text-primary underline">Política de cookies</Link>
      </p>

      {panel && (
        <fieldset className="mt-4 space-y-3">
          <legend className="sr-only">Categorías de cookies</legend>
          <label className="flex items-start gap-3 rounded-xl bg-muted p-3 text-sm">
            <input type="checkbox" checked disabled className="mt-1 size-4" />
            <span><strong>Necesarias</strong> (siempre activas): carrito y registro de tu elección.</span>
          </label>
          <label className="flex items-start gap-3 rounded-xl bg-muted p-3 text-sm">
            <input type="checkbox" checked={prefs} onChange={(e) => setPrefs(e.target.checked)} className="mt-1 size-4" />
            <span><strong>Preferencias</strong>: recordar ajustes opcionales de la interfaz.</span>
          </label>
          <label className="flex items-start gap-3 rounded-xl bg-muted p-3 text-sm">
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1 size-4" />
            <span><strong>Analíticas</strong>: medir uso del sitio (ninguna herramienta instalada actualmente).</span>
          </label>
        </fieldset>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-destructive">
          ⚠ No pudimos guardar tus preferencias en este navegador. Se volverá a preguntar en tu próxima visita.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button className="btn btn-primary flex-1" onClick={() => save(true, true)}>Aceptar todas</button>
        <button className="btn btn-primary flex-1" onClick={() => save(false, false)}>Rechazar no esenciales</button>
        {panel ? (
          <button className="btn btn-outline flex-1" onClick={() => save(prefs, analytics)}>Guardar selección</button>
        ) : (
          <button className="btn btn-outline flex-1" onClick={() => setPanel(true)}>Configurar</button>
        )}
      </div>
    </div>
  );
}
