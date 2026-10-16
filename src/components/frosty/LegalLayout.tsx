import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "./Logo";
import { Footer } from "./Footer";

export function Pending({ children }: { children: ReactNode }) {
  return <mark className="rounded bg-warning px-1 font-semibold text-warning-foreground">[PENDIENTE: {children}]</mark>;
}

export function Field({ value, label }: { value: string; label: string }) {
  return value ? <strong>{value}</strong> : <Pending>{label}</Pending>;
}

export function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link to="/" aria-label="FROSTY LAB, volver al inicio"><Logo /></Link>
          <Link to="/" className="text-sm font-semibold text-primary">← Volver a la tienda</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-12">
        <div className="notice mb-8" role="note">
          <strong>Borrador pendiente de revisión.</strong> Este documento contiene campos sin completar y debe ser revisado por un profesional jurídico en Colombia antes de su publicación definitiva. No constituye asesoría legal.
        </div>
        <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
        <article className="mt-8 space-y-6 leading-relaxed [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_p]:text-foreground/85">
          {children}
        </article>
      </main>
      <Footer />
    </div>
  );
}
