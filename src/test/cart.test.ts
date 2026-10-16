import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/config/store";
import {
  addItem,
  buildWhatsappUrl,
  computeTotals,
  sanitizeCart,
  setQty,
  validateCustomer,
} from "@/lib/cart";

describe("cart", () => {
  it("merges same product+size instead of duplicating", () => {
    let c = addItem([], "blue-ice", "m", 1);
    c = addItem(c, "blue-ice", "m", 2);
    c = addItem(c, "blue-ice", "l", 1);
    expect(c).toEqual([
      { productId: "blue-ice", sizeId: "m", qty: 3 },
      { productId: "blue-ice", sizeId: "l", qty: 1 },
    ]);
  });

  it("never keeps negative or zero quantities", () => {
    const c = setQty([{ productId: "blue-ice", sizeId: "m", qty: 2 }], "blue-ice", "m", -3);
    expect(c).toEqual([]);
  });

  it("computes totals from catalog prices, ignoring tampered data", () => {
    const items = sanitizeCart(
      [
        { productId: "blue-ice", sizeId: "m", qty: 2, price: 1 },
        { productId: "fake", sizeId: "m", qty: 5 },
      ],
      PRODUCTS,
    );
    const t = computeTotals(items, PRODUCTS, { mode: "recogida", deliveryFeeCOP: 3000 });
    expect(t.subtotal).toBe(16000);
    expect(t.deliveryFee).toBeNull();
    expect(t.total).toBe(16000);
  });

  it("adds delivery fee only for domicilio when configured", () => {
    const items = [{ productId: "blue-ice", sizeId: "s", qty: 1 }];
    expect(computeTotals(items, PRODUCTS, { mode: "domicilio", deliveryFeeCOP: 3000 }).total).toBe(9000);
    expect(computeTotals(items, PRODUCTS, { mode: "domicilio", deliveryFeeCOP: null }).total).toBe(6000);
  });

  it("refuses to build a WhatsApp link without a configured number", () => {
    expect(buildWhatsappUrl("", "hola")).toBeNull();
    expect(buildWhatsappUrl("+57 300", "hola")).toBeNull();
    expect(buildWhatsappUrl("573001112233", "a b")).toBe("https://wa.me/573001112233?text=a%20b");
  });

  it("requires address for domicilio", () => {
    const e = validateCustomer({ name: "Ana", phone: "3001234567", mode: "domicilio", address: "", zone: "", notes: "" });
    expect(e.address).toBeDefined();
  });
});
