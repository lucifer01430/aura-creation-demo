# Aura Creations — website concept

An independent single-page website concept for **Aura Creations by Rashi & Puneeta**, a women's ethnic and Indo-Western boutique in Jankipuram Extension, Lucknow. Prepared by StackShooter. **Not commissioned or approved by the business yet.**

Plain HTML, CSS and vanilla JavaScript. No build step, no framework, no backend.

## Run it

- **Locally:** open `index.html` in a browser, or serve the folder (`npx serve .` or `python3 -m http.server`).
- **GitHub Pages:** push the folder to a repo, then Settings → Pages → deploy from the branch root. All paths are relative, so it also works under `username.github.io/repo-name/`.

## Files

```
index.html            Page markup (all sections A–L)
css/styles.css        Design tokens, layout, components, motion
js/config.js          Brand, contact, location, announcement, demo switches
js/products.js        Collections + sample products (edit this to add real pieces)
js/main.js            Catalogue, filters, dialogs, WhatsApp flow, mobile menu
js/interactions.js    Header state, reveals, parallax, tilt, floating button
assets/logo.png       Logo cut from the supplied artwork (512 px, transparent)
assets/images/        Favicons, header logo (WebP), Open Graph image
assets/fonts/         Self-hosted fonts + their OFL licences
```

## What to change, and where

| Change | Where |
|---|---|
| WhatsApp number | `js/config.js` → `contact.whatsappNumber` (digits only, with 91) |
| Announcement bar | `js/config.js` → `announcement` (empty string hides it) |
| Address / landmark / Maps search | `js/config.js` → `location` |
| Products | `js/products.js` → `AURA.products` |
| Collection names and blurbs | `js/products.js` → `AURA.categories`, and the three cards in `index.html` (`data-filter-link` must match a category `id`, or `new`) |
| Hero, story, edit and Instagram photos | `index.html` (each `<img>` has `src`/`srcset`) |
| Headlines and copy | `index.html` |
| Brand colours and fonts | top of `css/styles.css` (`:root`) |

### Product fields

```js
{
  id: 'rose-suit',                 // unique
  name: 'Rose floral suit',
  category: 'ethnic',              // a category id
  image: 'assets/images/products/rose-suit.jpg',
  imageAlt: 'Rose floral suit with dupatta',
  secondaryImage: null,            // second photo of the SAME piece, shown on hover
  description: null,               // null hides it
  price: null,                     // e.g. 2450 → ₹2,450; null hides it
  availableSizes: null,            // e.g. ['S','M','L']; null hides the size picker
  isNewArrival: false,             // true adds the label and the New Arrivals filter
  isSample: true                   // remove once the piece is real
}
```

Price, sizes and description are hidden whenever they're empty — nothing is invented to fill the gap.

## How enquiries work

There is no database, email or tracking. Every enquiry builds a message and opens `wa.me/<number>?text=…` so the visitor reviews and sends it in WhatsApp themselves.

- **Product dialog → “Enquire about this product”** sends product name, category, chosen size (if sizes exist) and the optional note.
- **Enquiry form** (header CTA, floating button, card “Enquire” links) asks for a name (required), optional phone, product, size and message, validates inline, then opens WhatsApp.
- Nothing typed is saved to cookies, localStorage or analytics; the form resets when closed.
- If the number is removed from `config.js`, the forms show a clear “not set up” message instead of a broken link.

## Before this goes public

1. **Get the owners' approval.** Then remove the concept notice (set `demo.isDemo = false` in `config.js`, or delete the `data-concept-notice` paragraph in the footer).
2. **Replace every sample product and photo.** All current photos are free Unsplash images (Unsplash License) used as stand-ins; none show Aura Creations stock. Use the boutique's own photographs, with permission.
3. **Confirm the details taken from Instagram:** spelling of the name (the logo reads “Aura Creation”, the brief says “Aura Creations”), the landmark address, and that +91 63913 90145 is the public enquiry number.
4. **Remove `<meta name="robots" content="noindex, nofollow">`** from `index.html`.
5. **Set `canonicalUrl`** in `config.js`, and change `og:image` in `index.html` to an absolute URL (`https://your-domain/assets/images/og-image.jpg`) so link previews work.
6. Optionally add the boutique's verified Google Business link as `mapsQuery` (or replace the Maps link in `index.html`).

## Quality notes

- Responsive from 320 px to wide desktop; tested at 320, 390, 768, 1366 and 1440 px with no horizontal overflow and no console errors.
- Hero entrance is pure CSS, so content stays visible if JavaScript fails. Scroll reveals only hide content once the observer is confirmed running.
- `prefers-reduced-motion` turns off parallax, tilt, reveals and the hero sequence.
- Keyboard: skip link, visible focus, Escape closes the menu and dialogs, focus returns to the button that opened a dialog, menu traps focus while open.
- Broken or blocked photos fall back to a soft cream panel with the image description instead of a broken-image icon.
- Fonts (Bodoni Moda, Jost, Pinyon Script) are self-hosted under the SIL Open Font License; system fonts take over if they fail.
