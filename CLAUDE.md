# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SANGO TINTORERIAS is an Ionic/Angular mobile app for requesting dry cleaning/laundry service at home. It targets Android and iOS via Capacitor 6, and Angular 17 + Ionic 8.

- **Package name**: `com.bucapps.sango`
- **Backend API**: `https://sango-api-prod-51190d6823db.herokuapp.com/`
- **Current branch**: `v3_claude` (active design overhaul)
- **Business location**: Zapopan, Jalisco, México (lat: 20.663930, lng: -103.414894) — used as bounds center for Google Maps

## Commands

```bash
# Install dependencies
npm install

# Run in browser (dev server)
ionic serve

# Build for production
ionic build --prod

# Sync native projects after build
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode
npx cap open ios

# Run tests
ng test

# Run a single test file
ng test --include='**/sign-in.page.spec.ts'

# Lint
ng lint
```

---

## Design System (v3)

All pages have been redesigned under a unified design system. When editing any page, always follow these conventions.

### Color Palette

```scss
$white:  #FFFFFF;
$bg:     #F4F7FB;   // page background
$dark:   #111827;   // primary text
$mid:    #6B7280;   // secondary text
$light:  #9CA3AF;   // placeholder / meta text
$border: #E5E7EB;   // dividers, inactive borders
$accent: #1A6CF5;   // primary CTA, selection state
$green:  #059669;   // prices, success, delivery step
```

### Typography

- **Font**: `Montserrat` (Google Fonts) — imported in every page SCSS
- All font declarations use `font-family: 'Montserrat', sans-serif`
- Never use system fonts (Arial, Roboto, Inter) anywhere in the redesigned pages

### Cards

```scss
background: $white;
border-radius: 18px–22px;
box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06);
```

### Animations

```scss
@keyframes card-in {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
// Applied with staggered animation-delay: (i * 0.06) + 's'
// Timing: 0.4s cubic-bezier(0.22, 1, 0.36, 1)
```

### Floating Footer Pill (universal CTA pattern)

```scss
ion-footer { background: $bg; }
.footer-bar {
  background: $white;
  margin: 6px 16px 12px;
  border-radius: 22px;
  box-shadow: 0 4px 28px rgba(0,0,0,0.10);
}
.footer-cta {
  background: $accent;
  border-radius: 100px;
  box-shadow: 0 3px 14px rgba(26,108,245,0.36);
}
```

### Header Pattern

```scss
ion-header {
  ion-toolbar { --background: #FFFFFF; --border-color: transparent; }
}
ion-header::after { display: none; }
.back-btn { --color: #111827; --icon-font-size: 20px; }
.toolbar-title { font-family: 'Montserrat'; font-size: 18px; font-weight: 700; color: $dark; }
```

Always use `<ion-header class="ion-no-border">` and `icon="arrow-back-outline"` on back buttons.

### Icon Badge (settings/account items)

```scss
.item-icon {
  width: 36px; height: 36px; border-radius: 10px;
  &.blue   { background: rgba(26,108,245,0.10); color: #1A6CF5; }
  &.green  { background: rgba(5,150,105,0.10);  color: #059669; }
  &.purple { background: rgba(124,58,237,0.10); color: #7C3AED; }
  &.amber  { background: rgba(217,119,6,0.10);  color: #D97706; }
  &.slate  { background: rgba(107,114,128,0.10); color: #6B7280; }
  &.red    { background: rgba(220,38,38,0.10);   color: #DC2626; }
}
```

### Service Color Mapping

Used in carrito chips and any service-labeled UI:

| Service key (from API) | CSS class | Color |
|---|---|---|
| `Tintoreria` | `.tintoreria` | `#1A6CF5` (blue) |
| `Planchado` | `.planchado` | `#D97706` (amber) |
| `Lavanderia` | `.lavanderia` | `#0891B2` (cyan) |
| `Blancos y Hogar` | `.blancos-y-hogar` | `#7C3AED` (purple) |
| `Teñidos` | `.teñidos` | `#059669` (green) |

---

## Architecture

### Authentication Flow

Entry point is `/sign-in`. Three OAuth methods:
- **Google**: via `@capgo/capacitor-social-login` plugin
- **Apple**: iOS only, via `@capacitor-community/apple-sign-in`
- **Facebook**: via `@capacitor-community/facebook-login`

After login, the user UID is stored in `localStorage` as `uid`. The app redirects to `/tabs/home`. The HTTP interceptor reads `uid` from localStorage and adds `idUsuario` header to every request.

### HTTP Layer

`rest.service.ts` is the **single HTTP service** for the entire app. It has both V1 (legacy) and V2 (current) API methods. When adding new API calls, use V2 patterns.

`http-interceptor.service.ts` handles two concerns:
1. Injects `idUsuario` header on every outgoing request
2. Shows/hides the global loading spinner by counting in-flight requests via `LoaderService`

### Navigation Structure

```
/sign-in                        ← entry point (auto-redirects to /tabs if uid exists in localStorage)
  ↓ login (Google/Apple/Facebook)
/tabs
  /tabs/home                    ← dashboard: active orders list + available services
  /tabs/carrito                 ← shopping cart contents
  /tabs/account                 ← user profile and settings

/servicios-sin-cuenta           ← browse services without logging in (from sign-in)
```

#### Order Placement Flow (Happy Path)

```
/sign-in
  ↓ successful OAuth login → stores uid/email/display/photoUrl in localStorage
/tabs/home
  ↓ seleccionarSeccion() → sets idServicio + nombreServicio in sessionStorage
/seccion                        ← lists sub-categories (opciones) for the selected service
  ↓ seleccionarOpcionPrenda() → sets idOpcion + nombreOpcion in sessionStorage
/sub-opcion-prenda              ← lists items (prendas); add/remove from cart via API
  ↓ irAEnvios() or goToCart()
/tabs/carrito                   ← review cart; adjust quantities
  ↓ irARecoleccion()
/envios                         ← pick pickup date, then delivery date (loaded after pickup selection)
  ↓ irADirecciones() → cart updated with dates via API
/select-address                 ← choose existing address or add new one
  ↓ confirm_order() → cart updated with address via API
/confirm-order                  ← full order summary (items, dates, address, total)
  ↓ payment()
/payment                        ← Conekta card or cash payment; creates order on success
  ↓ navigate to /tabs → sets sessionStorage.actualizarHome='si' to trigger home refresh
/tabs/home                      ← order now appears in active list
  ↓ order_info()
/order-info                     ← order tracking, item details, rating (1–5 stars), comments
```

#### Account & Settings Pages (from /tabs/account)

| Route | Trigger | Purpose |
|---|---|---|
| `/my-orders` | `my_orders()` | Full order history → taps into `/order-info` |
| `/my-profile` | `my_profile()` | Edit user profile (nombre, email, tel) |
| `/my-address` | `my_address()` | Manage saved addresses (edit/delete) |
| `/add-address` | `add_address()` | Add new address — two-field Google Places search |
| `/edit-adress` | `edit_address()` | Edit existing address (id via sessionStorage) |
| `/zona-de-cobertura` | `zonaDeCobertura()` | View service coverage area map |
| `/faq` | `faq()` | Accordion FAQ (20 questions, CSS max-height expand) |
| `/contact-us` | `contact_us()` | Phone / email / address cards with `tel:` and `mailto:` links |
| `/terms-conditions` | `terms_conditions()` | Terms and conditions (long scroll) |
| `/aviso-de-privacidad` | `avisoDePrivacidad()` | Privacy policy (long scroll) |
| Sign-In | `logout()` | Clears localStorage + sessionStorage → back to sign-in |

#### Session / Storage Used for Navigation

| Key | Storage | Set by | Read by |
|---|---|---|---|
| `uid` | localStorage | sign-in after OAuth | interceptor, all pages |
| `email`, `display`, `photoUrl` | localStorage | sign-in after OAuth | account page |
| `idServicio`, `nombreServicio` | sessionStorage | home / servicios-sin-cuenta | seccion |
| `idOpcion`, `nombreOpcion` | sessionStorage | seccion | sub-opcion-prenda |
| `pedidoSeleccionado` | localStorage | home / my-orders | order-info |
| `direccionAEditarId` | sessionStorage | my-address | edit-adress |
| `actualizarHome` | sessionStorage | payment (on success) | home (triggers reload) |
| `puedePagarCC` | localStorage | payment page init | payment (forces cash if false) |

#### Unauthenticated Browsing Flow

```
/sign-in
  ↓ verServicios()
/servicios-sin-cuenta           ← lists services; no cart tracking
  ↓ seleccionarSeccion()
/seccion                        ← same page, but navigating to /sub-opcion-prenda
/sub-opcion-prenda              ← cart operations skipped if no uid in localStorage
  ↓ login()
/sign-in                        ← user logs in, then resumes from /tabs/home
```

---

## Page-Specific Notes

### `/tabs/home`

- **Auto-refresh**: orders reload every 30s via `setInterval` in `ionViewDidEnter()`. Cleared in `ionViewWillLeave()` to prevent memory leaks.
- `isRefreshing` boolean drives a pulsing dot indicator in the header.
- `cargarOrdenes()` is Promise-wrapped (not observable) to support `async/await` pull-to-refresh.
- Status classes: `getStatusClass(estado)` maps `EstadoCarrito` values to CSS class names. Always keep this in sync with the SCSS status color blocks.
- Cart total shown as a pill in the header; auto-hides when 0.

### `/seccion`

- Reads `idServicio` + `nombreServicio` from `sessionStorage`.
- `tieneCuenta` flag (checks `localStorage.uid`) determines whether stepper controls are shown.
- Images displayed as `background-image` on `.opc-img` div (not `<img>` tags).
- Search filter: `filterOpciones()` bound to `(ionInput)` on the custom searchbar.

### `/sub-opcion-prenda`

- Reads `idOpcion` + `nombreOpcion` from `sessionStorage` for the breadcrumb header.
- `prenda.cantidad` drives the qty stepper and `.has-items` card state (blue border).
- Minus button uses `[class.invisible]` (not `*ngIf`) to keep layout stable when qty is 0.
- Footer pill appears only when `total > 0`; badge shows `totalPrendas`.

### `/tabs/carrito`

- Data grouped by `servicio → categoria → prendas[]` via `groupByServicioYCategoria()`.
- `removerPrenda()` uses `actualizarCantidadDePrendaEnCarrito()` (different endpoint than add).
- `agregarPrenda()` uses `postActualizarCarritoV2()`.
- Service chips use `getServiceClass(servicio.key)` → CSS class → color (see Service Color Mapping above).

### `/envios`

- Two-step date selection: pickup → delivery (delivery dates load only after pickup is confirmed).
- **No `ion-select` dropdowns** — dates rendered as tappable horizontal-scroll cards with Angular `date` pipe.
- Uses `date:'EEE':'UTC'`, `date:'d':'UTC'`, `date:'MMM':'UTC'` pipes to split the `YYYY-MM-DD` fecha string.
- Delivery section animates in with `section-in` keyframe after pickup is selected.
- Footer shows: hint pill before both dates confirmed; full summary + "Continuar" after both selected.

### `/select-address`

- `selectAddress(direccion)` calls `postActualizarDireccionDeCarritoV2()` then sets `hayDireccionSeleccionada = true`.
- Selected card: 4px blue left bar + blue border + animated checkmark badge (spring scale).
- Footer appears only when `hayDireccionSeleccionada` is true; shows alias + street + total + "Confirmar".

### `/add-address`

- **Uses `AutocompleteService` + `PlacesService`** (NOT `Autocomplete` widget) for full control over the two-field UX.
- Two inputs: `calle` (street name) + `numero` (exterior number). Combined into `searchQuery` getter.
- `buscarDirecciones()` — debounced 350ms, calls `autocompleteService.getPlacePredictions()`.
- `seleccionarSugerencia()` — calls `placesService.getDetails()` with `address_components` field.
- **Number validation**: if selected place has no `street_number` component AND `numero` field is empty → `noNumberError = true` → blocks selection, shows animated shake error message.
- The hidden `<div #map id="map">` (height: 1px) must remain — `PlacesService` requires a map instance.
- Google Maps bounds restricted to ±0.03° around business location (Zapopan, lat: 20.663930, lng: -103.414894).
- After valid selection: fields go `readonly`, green confirmed-row appears with "Cambiar" button → calls `clearSeleccion()`.
- `validarCampos()` checks: nombre, cp, tel, alias — marks missing ones with `'danger'` in `nuevaDireccionColores`.

### `/tabs/account`

- Profile card at top navigates to `/my-profile` on tap.
- Avatar shows first letter of `nombre` (from `localStorage.getItem('display')`).
- Settings grouped into: "Mi Cuenta", "Soporte", "Legal", logout.
- `ionViewDidEnter()` refreshes `nombre` from API (in case it was edited in my-profile).

### `/my-profile`

- Edit mode toggled by `isEditing` boolean; header action button swaps between "Editar" and "Guardar".
- Fields use plain `<input>` (not `ion-input`) with `[readonly]="!isEditing"` and `.editable` class for blue underline.
- Delete account lives in a "Danger Zone" section hidden during edit mode.
- `cancelChanges()` reverts to `originalData` snapshot.

### `/faq`

- `expandedIndex: number | null` — only one item open at a time.
- CSS `max-height: 0 → 600px` transition (no Angular animation needed); controlled by `.visible` class.
- Chevron rotates 180° on open via CSS `transform: rotate(180deg)`.

---

## Data Models (src/app/models/)

- `UsuarioV2` — user profile (includes `carritos[]`)
- `CarritoV2` — shopping cart (has `estado: EstadoCarrito` enum)
- `CarritoItemV2` — individual garment/service in cart
- `SubOpcionesPrenda` → `OpccionesPrenda` → `Servicio` — three-level service hierarchy

Cart lifecycle states: `CREADO → EN_TIENDA → TERMINADO → EN_RUTA_REPARTIDOR → FINALIZADO` (also: `SOLICITA_CANCELACION`, `CANCELADO`)

---

## Push Notifications

`src/app/services/fcm.service.ts` manages Capacitor push notifications. It registers the device token and saves it to the backend via `rest.updateUsuarioV2()`. Initialized from `home.page.ts` after login.

---

## Key Integrations

| Integration | Purpose | Plugin/SDK |
|---|---|---|
| Google OAuth | Social login | `@capgo/capacitor-social-login` |
| Apple Sign-In | iOS login | `@capacitor-community/apple-sign-in` |
| Facebook | Social login | `@capacitor-community/facebook-login` |
| Conekta | Payments | JavaScript SDK loaded at runtime |
| Google Maps Places | Address autocomplete in `/add-address` | `AutocompleteService` + `PlacesService` (no widget) |
| Geolocation | Current position for map center | `@ionic-native/geolocation` |
| Firebase | Apple auth redirect | Firebase Auth handler |

---

## i18n

Translations loaded via `ngx-translate` from `src/assets/i18n/`. Supported languages: `en`, `es`. Configuration is in `src/app/app.config.ts`.

---

## Environment

Both `environment.ts` and `environment.prod.ts` point to the same Heroku production API. API keys for Google Maps, Firebase, and Facebook are stored in these files.
