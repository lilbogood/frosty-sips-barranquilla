import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { PRODUCTS } from "@/config/store";
import { addItem, removeItem, sanitizeCart, setQty, type CartItem } from "@/lib/cart";

const KEY = "frostylab-cart-v1";

interface Toast { id: number; text: string }
interface Shop {
  items: CartItem[];
  add: (productId: string, sizeId: string, qty?: number) => void;
  update: (productId: string, sizeId: string, qty: number) => void;
  remove: (productId: string, sizeId: string) => void;
  clear: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  toast: (text: string) => void;
  toasts: Toast[];
  storageError: boolean;
  bump: number;
}

const Ctx = createContext<Shop | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [storageError, setStorageError] = useState(false);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setItems(sanitizeCart(JSON.parse(raw), PRODUCTS));
    } catch {
      setStorageError(true);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      // Solo se guardan id de producto, tamaño y cantidad. Nunca datos personales.
      window.localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      setStorageError(true);
    }
  }, [items, loaded]);

  const toast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const value: Shop = {
    items,
    add: (p, s, q = 1) => {
      setItems((c) => addItem(c, p, s, q));
      setBump((b) => b + 1);
    },
    update: (p, s, q) => setItems((c) => setQty(c, p, s, q)),
    remove: (p, s) => setItems((c) => removeItem(c, p, s)),
    clear: () => setItems([]),
    cartOpen,
    setCartOpen,
    toast,
    toasts,
    storageError,
    bump,
  };
  return (
    <Ctx.Provider value={value}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div key={t.id} className="anim-toast rounded-full bg-night px-5 py-3 text-sm font-semibold text-snow shadow-lg">
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useShop() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useShop must be used inside ShopProvider");
  return c;
}
