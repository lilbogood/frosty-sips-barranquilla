<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- All business data (contact, catalog, prices, promos, delivery, legal) lives in `src/config/store.ts`; empty values mean "pending" and the UI must hide them or show a notice — never invent data.
- Cart math, WhatsApp message/URL building and validation live in `src/lib/cart.ts` (pure, tested in `src/test/cart.test.ts`); prices always come from the catalog, never from stored cart data.
- Orders are sent via wa.me only; no backend or payment gateway exists — do not claim orders are confirmed.
