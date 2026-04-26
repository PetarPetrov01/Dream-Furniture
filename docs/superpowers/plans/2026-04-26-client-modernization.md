# Angular Client Modernization Plan

**Branch:** `refactor/client-modernization` (already created and checked out)
**Working dir:** `D:/code/GitHub/Angular-Project/client/`

---

## Context

The Angular client (`client/`) is a Dream Furniture e-commerce SPA built on Angular 17 with NgRx 17 (cart only), `ngrx-store-localstorage`, `moment.js`, `ng-lazyload-image`, and Angular Material 17. It uses standalone components but otherwise reflects pre-Angular-17 patterns: `*ngIf`/`*ngFor` everywhere, manual subscription lifecycle, BehaviorSubject services, no `OnPush`, no signals, no lazy routes, mixed `inject()` and constructor injection.

There are also several real bugs sitting in the codebase (interceptor throwing arrays, a dialog whose config object is silently dropped because of a stray comma, typos that break refactor safety, etc.).

The user wants:
1. Upgrade Angular itself, not just modernize patterns (17 → 20).
2. Drop NgRx entirely; replace cart with a signal-based store + a tiny localStorage helper.
3. Replace `moment.js` with native `Intl.DateTimeFormat`.
4. App must keep working at every phase boundary (no big-bang).
5. Tests can be updated later — they don't gate progression.
6. Use the freshly-installed Angular skills (`angular-developer`, `angular-new-app`) and the superpowers planning skill.

---

## Strategy

**Phased, ordered, each phase ends with a smoke-test + commit.** Order matters because Angular tooling progressively unlocks features:

- Phase 1 (bug fixes + cleanups) is independent — do first to clear noise before larger structural changes.
- Phase 2 (Angular 17 → 18 → 19 → 20) MUST be sequential per Angular's `ng update` policy (one major at a time).
- Phase 3+ depend on being on Angular 20 to unlock control-flow migration schematics, signal `input()`/`output()`, `DestroyRef`, etc.
- Phase 6 (drop NgRx) depends on Phases 3 + 5 so the signal store can lean on modern primitives.

**Verification at every phase boundary:**
- `npm run build` succeeds.
- `npm start` (i.e. `ng serve`) — open `http://localhost:4200`, smoke test:
  1. Home loads, featured products render.
  2. Register a new user OR log in with existing.
  3. Browse `/products`, filter by category, search.
  4. Open a product details page.
  5. Add to cart, increase/decrease qty, remove, complete order.
  6. Wishlist toggle.
  7. Add product (if logged in).
  8. Logout.
- Backend (`server/`) must be running for #2-#8. Start with `cd server && npm start` in a separate terminal.

---

## Files Map (what gets touched)

**Bug fixes (Phase 1):**
- `client/src/app/app.interceptor.ts` — throw fix, console removal
- `client/src/app/auth/cart/cart.component.ts:94` — dialog comma bug
- `client/src/app/auth/cart/clear-dialog/clear-dialog.component.ts` — rename `ClearDiaologComponent` → `ClearDialogComponent`
- `client/src/app/shared/notification/notification.service.ts` — `notificaiton$` typo
- `client/src/app/shared/notification/notification.component.ts` and any subscriber — typo refs
- `client/src/app/types/Order.ts` — `extends Array<>` → `type Order = OrderProduct[]`
- `client/src/app/shared/email-validator.directive.ts` — drop `/g` flag, fix tester
- `client/src/app/main/products/products.component.ts:182` — drop console.log
- `client/src/app/main/product-details/product-details.component.ts:65` — drop console.log
- `client/src/app/main/add-product/add-product.component.spec.ts` — fix `useValiue` typo, drop console.log
- `client/src/app/auth/cart/cart.reducer.ts` — drop unused `testMetaReducer`
- `client/src/app/app.config.ts` — drop reference to `testMetaReducer`
- `client/src/app/main/add-product/add-product.component.ts` — drop unused `FormsModule` import

**Angular upgrade (Phase 2):**
- `client/package.json`, `client/package-lock.json`
- `client/angular.json` (CLI may rewrite)
- `client/tsconfig*.json` (CLI may bump targets)

**Schematic sweep (Phase 3):**
- All `*.component.html` (control-flow migration)
- All `*.component.ts` (inject() migration)

**moment → Intl (Phase 4):**
- `client/src/app/shared/date-formatter.pipe.ts`
- `client/package.json` (remove `moment`)

**takeUntilDestroyed sweep (Phase 5):**
- Every component that has a `Subscription` field + `ngOnDestroy` (~12 files; full list inside Phase 5).

**Signal cart store + drop NgRx (Phase 6):**
- Create: `client/src/app/auth/cart/cart.store.ts`
- Create: `client/src/app/shared/local-storage-signal.ts`
- Modify: `client/src/app/auth/cart/cart.component.ts`, `header/header.component.ts` (cart badge), `auth.service.ts` (resetState on logout), `product-details.component.ts` (addItem)
- Delete: `client/src/app/auth/cart/cart.reducer.ts`, `cart.actions.ts`
- Modify: `client/src/app/app.config.ts` — drop `provideStore`
- Modify: `client/src/app/types/State.ts` — drop `CartState`
- Modify: `client/package.json` — remove `@ngrx/store`, `ngrx-store-localstorage`

**Signal inputs/outputs + OnPush (Phase 7):**
- Dialog components (data injected) are good candidates.
- All non-dialog components get `changeDetection: ChangeDetectionStrategy.OnPush`.

**Lazy routes (Phase 8):**
- `client/src/app/app.routes.ts`

**Polish (Phase 9):**
- `@for` track expressions across all loops
- New `client/src/app/shared/ui-constants.ts`
- Replace `ng-lazyload-image` with native `loading="lazy"`
- Drop `ng-lazyload-image` from `package.json`

---

## Phase 0 — Baseline & Safety Net

Goal: Confirm the app currently runs and capture a known-good baseline before changing anything.

- [ ] **0.0 — Load the Angular skill up front.** Before doing anything else, invoke the `angular-developer` skill (it ships from `https://github.com/angular/skills` and was installed during planning; available after `/reload-plugins`). Keep its guidance in context for the rest of execution — it's the source of truth for v17→v20 migration recipes, signal idioms, control-flow syntax, and `inject()` patterns. If the skill is not available (plugins not reloaded), stop and ask the user to run `/reload-plugins`.
- [ ] **0.1 — Verify branch.** Run: `git -C D:/code/GitHub/Angular-Project status` and confirm branch is `refactor/client-modernization`.
- [ ] **0.2 — Save this plan into the repo for the executor agent.** Copy the plan to `D:/code/GitHub/Angular-Project/docs/superpowers/plans/2026-04-26-client-modernization.md` (the directory was created during planning).
- [ ] **0.3 — Install dependencies.** Run: `cd D:/code/GitHub/Angular-Project/client && npm install`. Expected: completes without errors (warnings about deprecated packages are OK at this point — that's what we're fixing).
- [ ] **0.4 — Baseline build.** Run: `npm run build`. Expected: `dist/` folder regenerated, no errors. Note any warnings into a `.notes` scratch.
- [ ] **0.5 — Baseline tests (informational only).** Run: `npm test -- --watch=false --browsers=ChromeHeadless`. Record number passing/failing — these are not gating, but knowing the baseline lets us tell whether later refactors introduced failures vs inherited them.
- [ ] **0.6 — Smoke test the running app.** Start backend (`cd server && npm install && npm start`) and client (`cd client && npm start`). Walk through the 8-step smoke test from the Strategy section. If anything is broken at baseline, capture which step and stop — do not proceed until baseline is green or the user confirms the broken behavior is pre-existing.
- [ ] **0.7 — Commit baseline plan.** `git add docs/superpowers/plans/ && git commit -m "docs: add client modernization plan"`.

---

## Phase 1 — Bug fixes & low-risk cleanup

These are independent, fast wins. Each fix is its own commit so we can bisect later if anything breaks.

### Task 1.1 — Fix interceptor's broken error rethrow

**File:** `client/src/app/app.interceptor.ts`

The current code throws an array (`throw [err]`) which means downstream `.catchError()` handlers receive `[HttpErrorResponse]` instead of the error itself, breaking RxJS error contracts. Also `return [err]` from a `catchError` callback is wrong — it returns an array instead of an Observable.

- [ ] **Step 1:** Replace lines 36-51 with:
```ts
    return next.handle(req).pipe(
      catchError((err) => {
        if (err.status === 401) {
          this.authService.clearUserSession();
          this.router.navigate(['/auth/login']);
          return throwError(() => err);
        }
        if (!req.url.match(/\/products\/.+/)) {
          this.errorService.setError(err.error?.message ?? 'Unknown error');
        }
        return throwError(() => err);
      })
    );
```

- [ ] **Step 2:** Add `throwError` to the existing `import { Observable, catchError } from 'rxjs';` line so it becomes `import { Observable, catchError, throwError } from 'rxjs';`.
- [ ] **Step 3:** Build: `npm run build`. Expected: success.
- [ ] **Step 4:** Smoke test: trigger a 404 (visit `/products/this-id-does-not-exist`) and a 401 (logout, then try to visit `/cart`) — confirm error UI appears for the former and login redirect for the latter.
- [ ] **Step 5:** Commit: `git add client/src/app/app.interceptor.ts && git commit -m "fix(interceptor): throw proper error observable instead of array"`.

### Task 1.2 — Fix the dropped dialog config in cart

**File:** `client/src/app/auth/cart/cart.component.ts:93-100`

Current code:
```ts
  handleClearCart() {
    this.matDialog.open(ClearDiaologComponent),
      {
        width: '300px',
        ...
      };
  }
```
The trailing comma after `open(ClearDiaologComponent)` makes the second `{ ... }` an isolated expression — the dialog opens with default sizing.

- [ ] **Step 1:** Replace the method body with:
```ts
  handleClearCart() {
    this.matDialog.open(ClearDiaologComponent, {
      width: '300px',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '200ms',
    });
  }
```
- [ ] **Step 2:** Build: `npm run build`.
- [ ] **Step 3:** Smoke test: log in, add ≥2 items to cart, click "Clear cart" button — dialog should now appear at the consistent 300px width (matching the remove dialog).
- [ ] **Step 4:** Commit: `git add client/src/app/auth/cart/cart.component.ts && git commit -m "fix(cart): pass MatDialogConfig to ClearDialog (was silently dropped)"`.

### Task 1.3 — Rename `ClearDiaologComponent` → `ClearDialogComponent`

- [ ] **Step 1:** In `client/src/app/auth/cart/clear-dialog/clear-dialog.component.ts`, rename the exported class `ClearDiaologComponent` → `ClearDialogComponent` (and the `export class` declaration).
- [ ] **Step 2:** Update import + usage in `client/src/app/auth/cart/cart.component.ts` (lines 16 and 94 — the import statement and the `matDialog.open(...)` call).
- [ ] **Step 3:** Search for any other references: `grep -rn "ClearDiaolog" client/src` — should return nothing after the fix.
- [ ] **Step 4:** Build: `npm run build`.
- [ ] **Step 5:** Smoke test the clear-cart dialog opens.
- [ ] **Step 6:** Commit: `git add -A client/src && git commit -m "fix: rename ClearDiaologComponent to ClearDialogComponent"`.

### Task 1.4 — Fix `notificaiton$` typo

**File:** `client/src/app/shared/notification/notification.service.ts:9`

- [ ] **Step 1:** Rename the property `notificaiton$` → `notification$`.
- [ ] **Step 2:** Find subscribers: `grep -rn "notificaiton" client/src` — fix every reference (likely `notification.component.ts` and possibly its template via `| async`).
- [ ] **Step 3:** Build: `npm run build`.
- [ ] **Step 4:** Smoke test: complete an order — the toast notification should still appear.
- [ ] **Step 5:** Commit: `git add -A client/src && git commit -m "fix: typo notificaiton$ → notification$"`.

### Task 1.5 — Drop console.logs

**Files:**
- `client/src/app/app.interceptor.ts:42` — `console.error(err)` (delete the line; the error UI handles user feedback now)
- `client/src/app/main/products/products.component.ts:182` — `console.log(caller)` (delete)
- `client/src/app/main/product-details/product-details.component.ts:65` — `console.log(err)` (delete or keep only the error-handling effect)
- `client/src/app/main/add-product/add-product.component.spec.ts:109` — `console.log(e)` (delete)

- [ ] **Step 1:** Read each file at the line cited and remove the `console.*` call. Keep surrounding logic intact.
- [ ] **Step 2:** Confirm none broke: `grep -rn "console\." client/src/app` should now show only legitimate logging (probably none).
- [ ] **Step 3:** Build: `npm run build`.
- [ ] **Step 4:** Commit: `git add -A client/src && git commit -m "chore: remove leftover console.logs"`.

### Task 1.6 — Drop unused `testMetaReducer`

**Files:** `client/src/app/auth/cart/cart.reducer.ts`, `client/src/app/app.config.ts`

- [ ] **Step 1:** Delete the `testMetaReducer` function (lines 36-40 in `cart.reducer.ts`).
- [ ] **Step 2:** In `app.config.ts`, remove `testMetaReducer` from the import on line 14 and from the `metaReducers` array on line 19 — keep only `localStorageSyncReducer`.
- [ ] **Step 3:** Build: `npm run build`.
- [ ] **Step 4:** Commit: `git add -A client/src && git commit -m "chore: remove unused testMetaReducer"`.

### Task 1.7 — Drop unused FormsModule import in AddProductComponent

- [ ] **Step 1:** Open `client/src/app/main/add-product/add-product.component.ts`. Remove `FormsModule` from the `imports` array and the `@angular/forms` import line (keep `ReactiveFormsModule`).
- [ ] **Step 2:** Build: `npm run build`.
- [ ] **Step 3:** Smoke test: open `/add-product` — form should still render and validate.
- [ ] **Step 4:** Commit: `git add client/src/app/main/add-product/add-product.component.ts && git commit -m "chore: remove unused FormsModule import"`.

### Task 1.8 — Fix `Order extends Array<>` anti-pattern

**File:** `client/src/app/types/Order.ts:8`

- [ ] **Step 1:** Replace `export interface Order extends Array<OrderProduct> {}` with `export type Order = OrderProduct[];`.
- [ ] **Step 2:** Build: `npm run build`. If TypeScript complains anywhere `Order` is used, the fix is usually to use array syntax (`order.length`, `order[0]`) which already works on `OrderProduct[]`.
- [ ] **Step 3:** Smoke test: complete an order; orders page renders.
- [ ] **Step 4:** Commit: `git add client/src/app/types/Order.ts && git commit -m "fix(types): use array alias instead of extending Array"`.

### Task 1.9 — Fix EmailValidateDirective regex

**File:** `client/src/app/shared/email-validator.directive.ts`

The current regex uses `/g` flag with `.match()`, which preserves `lastIndex` between calls and produces inconsistent results. Also the pattern `[a-zA-Z0-9]{5,}@[a-zA-Z]+\.[a-zA-Z]{2,}$` is missing `^` and rejects valid emails like `a@b.io` (≥5 chars in local part requirement).

- [ ] **Step 1:** Read the file and replace the regex with `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` (no `/g` flag) and the `.match()` call with `.test()` (returns boolean directly).
- [ ] **Step 2:** Build: `npm run build`.
- [ ] **Step 3:** Smoke test: register with `a@b.io` — should now be accepted; invalid `notanemail` should still be rejected.
- [ ] **Step 4:** Commit: `git add client/src/app/shared/email-validator.directive.ts && git commit -m "fix(validators): correct email regex (anchor + drop /g flag)"`.

---

## Phase 2 — Angular upgrade 17 → 20

Angular's `ng update` only supports one major version at a time. Each upgrade is its own commit so a regression can be isolated.

### Task 2.1 — Upgrade to Angular 18

- [ ] **Step 1:** Ensure clean working tree: `git -C D:/code/GitHub/Angular-Project status` — should be clean.
- [ ] **Step 2:** From `client/`, run: `npx --yes @angular/cli@18 update @angular/core@18 @angular/cli@18`. Follow any prompts. Expected: `package.json`, `package-lock.json`, possibly `tsconfig.json` and `angular.json` updated.
- [ ] **Step 3:** Run: `npx --yes @angular/cli@18 update @angular/material@18 @angular/cdk@18`.
- [ ] **Step 4:** Run: `npx --yes @angular/cli@18 update @ngrx/store@18`.
- [ ] **Step 5:** Run: `npm install` to make sure peer deps line up.
- [ ] **Step 6:** Build: `npm run build`. Fix any breakages — most v18 changes are backwards-compatible. Common issues: changed signatures in Material modules; the angular skill `angular-developer` will have v17→v18 migration notes.
- [ ] **Step 7:** Smoke test all 8 steps.
- [ ] **Step 8:** Commit: `git add -A client && git commit -m "build: upgrade Angular 17 → 18"`.

### Task 2.2 — Upgrade to Angular 19

- [ ] **Step 1:** Run: `npx --yes @angular/cli@19 update @angular/core@19 @angular/cli@19`.
- [ ] **Step 2:** Run: `npx --yes @angular/cli@19 update @angular/material@19 @angular/cdk@19`.
- [ ] **Step 3:** Run: `npx --yes @angular/cli@19 update @ngrx/store@19`.
- [ ] **Step 4:** `npm install`.
- [ ] **Step 5:** Build: `npm run build`. v19 introduces stable `input()`/`output()` and several preview-to-stable promotions; existing code should still compile. Address any deprecation errors.
- [ ] **Step 6:** Smoke test.
- [ ] **Step 7:** Commit: `git add -A client && git commit -m "build: upgrade Angular 18 → 19"`.

### Task 2.3 — Upgrade to Angular 20

- [ ] **Step 1:** Run: `npx --yes @angular/cli@20 update @angular/core@20 @angular/cli@20`.
- [ ] **Step 2:** Run: `npx --yes @angular/cli@20 update @angular/material@20 @angular/cdk@20`.
- [ ] **Step 3:** Run: `npx --yes @angular/cli@20 update @ngrx/store@20`.
- [ ] **Step 4:** `npm install`.
- [ ] **Step 5:** Build: `npm run build`. v20 is the modern target; this unlocks the schematic sweeps in Phase 3.
- [ ] **Step 6:** Smoke test.
- [ ] **Step 7:** Commit: `git add -A client && git commit -m "build: upgrade Angular 19 → 20"`.

---

## Phase 3 — Modern syntax sweeps (schematic-driven)

These are Angular-provided codemods. Run them, then review the diff and adjust.

### Task 3.1 — Migrate `*ngIf` / `*ngFor` / `*ngSwitch` to `@if` / `@for` / `@switch`

- [ ] **Step 1:** From `client/`, run: `ng generate @angular/core:control-flow`. Confirm the prompts (apply to all components).
- [ ] **Step 2:** Review the diff: `git diff --stat`. Expect ~all `*.html` files to change. Spot-check `products.component.html` and `cart.component.html` to confirm `@for (item of items; track item._id)` syntax.
- [ ] **Step 3:** Build: `npm run build`. Fix any leftover `*ngIf="..."` the schematic missed (rare; sometimes inside structural-directive containers).
- [ ] **Step 4:** Smoke test the entire flow — control flow rendering changes are easy to verify visually.
- [ ] **Step 5:** Commit: `git add -A client/src && git commit -m "refactor: migrate to @if/@for/@switch control flow"`.

### Task 3.2 — Migrate constructor injection → `inject()`

- [ ] **Step 1:** Run: `ng generate @angular/core:inject`. Apply to all components.
- [ ] **Step 2:** Review diff — constructors should now be empty (or removed) and class fields should use `inject(...)`.
- [ ] **Step 3:** Build: `npm run build`. Fix any places where the schematic left both old and new patterns.
- [ ] **Step 4:** Smoke test — pure refactor, app behavior should be identical.
- [ ] **Step 5:** Commit: `git add -A client/src && git commit -m "refactor: migrate constructor DI to inject() function"`.

---

## Phase 4 — Replace moment.js with Intl.DateTimeFormat

**File:** `client/src/app/shared/date-formatter.pipe.ts`

Current code:
```ts
import moment from 'moment';
// ...
transform(value: string): string {
  return moment(value).format('DD MMMM YYYY, HH:MM');
}
```
The format `'HH:MM'` is also wrong — `MM` is *months* in moment; it produces e.g. `"23:04"` but with the month-of-year as the minutes. The intended format is `HH:mm`.

- [ ] **Step 1:** Replace the pipe body:
```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatter',
  standalone: true,
})
export class DateFormatterPipe implements PipeTransform {
  private static formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return DateFormatterPipe.formatter.format(date).replace(',', ',');
  }
}
```
- [ ] **Step 2:** Remove `moment` from `client/package.json` `dependencies`. Run `npm install` to refresh `package-lock.json`.
- [ ] **Step 3:** Confirm no other moment references: `grep -rn "moment" client/src` — should return zero.
- [ ] **Step 4:** Build: `npm run build`.
- [ ] **Step 5:** Smoke test: visit Orders page (or anywhere `dateFormatter` pipe is used). Date should render in `25 April 2026, 14:30` style. Compare to baseline screenshot to confirm format matches.
- [ ] **Step 6:** Commit: `git add -A client && git commit -m "refactor: replace moment.js with Intl.DateTimeFormat"`.

---

## Phase 5 — Replace manual subscription cleanup with `takeUntilDestroyed()`

`takeUntilDestroyed()` is from `@angular/core/rxjs-interop`. When called without args inside a constructor, it auto-binds to the component's `DestroyRef`. Outside a constructor, pass an explicit `DestroyRef` injected via `inject(DestroyRef)`.

**Files to convert (one task each, batched into one commit per file family):**

1. `client/src/app/shared/error/error.component.ts`
2. `client/src/app/shared/notification/notification.component.ts`
3. `client/src/app/auth/profile/edit-profile/edit-profile.component.ts`
4. `client/src/app/auth/orders/orders.component.ts`
5. `client/src/app/auth/cart/cart.component.ts`
6. `client/src/app/auth/wishlist/wishlist.component.ts`
7. `client/src/app/main/products/products.component.ts`
8. `client/src/app/main/product-details/product-details.component.ts`
9. `client/src/app/main/home/home.component.ts`
10. `client/src/app/auth/login/login.component.ts`
11. `client/src/app/auth/register/register.component.ts`
12. `client/src/app/shared/auth.service.ts` (if it has its own subscription)

### Task 5.1 — Recipe (apply to each file above)

- [ ] **Step 1:** For each file, replace the pattern:
```ts
private sub?: Subscription;
ngOnInit() { this.sub = this.x$.subscribe(...); }
ngOnDestroy() { this.sub?.unsubscribe(); }
```
with:
```ts
private destroyRef = inject(DestroyRef);
ngOnInit() {
  this.x$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(...);
}
```
- Drop the `Subscription` import, the field, the `OnDestroy` interface, and `ngOnDestroy` if it became empty.
- Add imports: `import { DestroyRef, inject } from '@angular/core';` and `import { takeUntilDestroyed } from '@angular/core/rxjs-interop';`.

- [ ] **Step 2:** After each file, build: `npm run build`.
- [ ] **Step 3:** After all 12 files done, smoke-test the full app — every screen visited, plus navigate away/back to ensure no zombie subscriptions cause double-fires (open DevTools network tab and look for duplicate XHRs).
- [ ] **Step 4:** Commit: `git add -A client/src && git commit -m "refactor: use takeUntilDestroyed instead of manual unsubscribe"`.

---

## Phase 6 — Drop NgRx; replace cart with signal store

This is the biggest semantic change. Build the new store first, switch consumers, then delete NgRx.

### Task 6.1 — Create the localStorage signal helper

**File:** `client/src/app/shared/local-storage-signal.ts` (new)

- [ ] **Step 1:** Write:
```ts
import { effect, signal, WritableSignal } from '@angular/core';

export function localStorageSignal<T>(key: string, initial: T): WritableSignal<T> {
  let restored: T = initial;
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) restored = JSON.parse(raw) as T;
  } catch {
    restored = initial;
  }
  const sig = signal<T>(restored);
  effect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(sig()));
    } catch {
      /* quota / private mode — ignore */
    }
  });
  return sig;
}
```

- [ ] **Step 2:** Build: `npm run build`. (No consumers yet — should compile clean.)
- [ ] **Step 3:** Commit: `git add client/src/app/shared/local-storage-signal.ts && git commit -m "feat: add localStorageSignal helper"`.

### Task 6.2 — Create the signal-based cart store

**File:** `client/src/app/auth/cart/cart.store.ts` (new)

- [ ] **Step 1:** Write:
```ts
import { computed, Injectable } from '@angular/core';
import { Product } from '../../types/Product';
import { StateProduct } from '../../types/State';
import { localStorageSignal } from '../../shared/local-storage-signal';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly state = localStorageSignal<StateProduct[]>('cart', []);

  readonly items = this.state.asReadonly();
  readonly totalCount = computed(() =>
    this.items().reduce((acc, p) => acc + p.quantity, 0)
  );
  readonly totalPrice = computed(() =>
    this.items().reduce((acc, p) => acc + p.quantity * p.price, 0)
  );

  addItem(product: Product, qty: number): void {
    this.state.update((items) => {
      const existing = items.find((p) => p._id === (product as any)._id);
      if (existing) {
        return items.map((p) =>
          p._id === existing._id ? { ...p, quantity: p.quantity + qty } : p
        );
      }
      return [...items, { ...(product as StateProduct), quantity: qty }];
    });
  }

  decrease(productId: string): void {
    this.state.update((items) =>
      items.map((p) =>
        p._id === productId ? { ...p, quantity: p.quantity - 1 } : p
      )
    );
  }

  remove(productId: string): void {
    this.state.update((items) => items.filter((p) => p._id !== productId));
  }

  reset(): void {
    this.state.set([]);
  }
}
```

- [ ] **Step 2:** Build: `npm run build`.
- [ ] **Step 3:** Commit: `git add client/src/app/auth/cart/cart.store.ts && git commit -m "feat: add signal-based CartStore"`.

### Task 6.3 — Switch CartComponent to CartStore

**File:** `client/src/app/auth/cart/cart.component.ts` (and template `cart.component.html`)

- [ ] **Step 1:** Replace `Store<CartState>`, `*CartActions` imports, `products$`/`products`/`prodsSubscription` fields with:
```ts
private cartStore = inject(CartStore);
products = this.cartStore.items;        // signal — use as products() in template
totalCount = this.cartStore.totalCount;
totalPrice = this.cartStore.totalPrice;
```
- [ ] **Step 2:** Replace dispatch calls:
  - `this.store.dispatch(CartActions.addItem({...}))` → `this.cartStore.addItem(prod, 1)`
  - `this.store.dispatch(CartActions.decreaseQuantity({...}))` → `this.cartStore.decrease(prod._id)`
  - `this.store.dispatch(CartActions.removeItem({...}))` → `this.cartStore.remove(prod._id)` (in `RemoveDialogComponent` when it confirms)
  - `this.store.dispatch(CartActions.resetState())` → `this.cartStore.reset()`
- [ ] **Step 3:** Update template `cart.component.html`: any `products$ | async` → `products()`, `totalCount` getter → `totalCount()` (signal call), same for `totalPrice`. With `@for` syntax already in place from Phase 3.1, the template shape barely changes.
- [ ] **Step 4:** Update `RemoveDialogComponent` (`client/src/app/auth/cart/remove-dialog/remove-dialog.component.ts`) and `ClearDialogComponent` (`client/src/app/auth/cart/clear-dialog/clear-dialog.component.ts`) to inject `CartStore` and call `remove()` / `reset()` instead of dispatching actions.
- [ ] **Step 5:** Build: `npm run build`.
- [ ] **Step 6:** Smoke test the entire cart flow: add → increase → decrease → remove → clear → complete order → cart resets after order.
- [ ] **Step 7:** Commit: `git add -A client/src/app/auth/cart && git commit -m "refactor(cart): use CartStore signals in cart components"`.

### Task 6.4 — Switch other CartStore consumers

Look for other places that touched the cart:
- `client/src/app/core/header/header.component.ts` — cart badge count (currently `store.select('cart')`).
- `client/src/app/main/product-details/product-details.component.ts` — Add to cart button.
- `client/src/app/shared/auth.service.ts` — `clearUserSession` resets cart.

- [ ] **Step 1:** In each, replace NgRx store usage with `inject(CartStore)` and the corresponding method (`addItem`, `totalCount`, `reset`).
- [ ] **Step 2:** Build: `npm run build`.
- [ ] **Step 3:** Smoke test: header badge updates as items added; logout clears cart; product details "Add to cart" still works.
- [ ] **Step 4:** Commit: `git add -A client/src && git commit -m "refactor: route remaining cart consumers through CartStore"`.

### Task 6.5 — Delete NgRx wiring

- [ ] **Step 1:** Delete files:
  - `client/src/app/auth/cart/cart.reducer.ts`
  - `client/src/app/auth/cart/cart.actions.ts`
- [ ] **Step 2:** In `client/src/app/app.config.ts`, remove the NgRx imports and the `provideStore({ cart: cartReducer }, { metaReducers })` line, and the `metaReducers` array. Final providers: `provideRouter`, `importProvidersFrom(HttpClientModule)`, `appInterceptorProvider`, `provideAnimationsAsync()`.
- [ ] **Step 3:** In `client/src/app/types/State.ts`, drop `CartState` (keep `StateProduct`). Update any importers if they were importing `CartState` (cart.component already migrated).
- [ ] **Step 4:** Remove from `client/package.json` `dependencies`: `@ngrx/store`, `ngrx-store-localstorage`. Run `npm install`.
- [ ] **Step 5:** Confirm no leftover refs: `grep -rn "@ngrx\|ngrx-store-localstorage\|CartActions\|cartReducer" client/src` — should return zero.
- [ ] **Step 6:** Build: `npm run build`.
- [ ] **Step 7:** Smoke test the full cart flow once more, including reload (cart should persist via localStorage).
- [ ] **Step 8:** Commit: `git add -A client && git commit -m "chore: remove NgRx (cart now uses signal store)"`.

---

## Phase 7 — Signal inputs/outputs + OnPush change detection

### Task 7.1 — OnPush sweep

- [ ] **Step 1:** For each component class in `client/src/app/**/*.component.ts` (about 20 files), add `changeDetection: ChangeDetectionStrategy.OnPush` to its `@Component({...})` decorator. Add `ChangeDetectionStrategy` to the `@angular/core` import if not present.
- [ ] **Step 2:** Build: `npm run build`.
- [ ] **Step 3:** Smoke test every screen. With signals in place, OnPush should work transparently for cart/header. Watch for components that mutate fields without signals — these need to be flagged. If any screen stops updating (e.g. orders list doesn't refresh after deleting an order), convert that field to a signal or call `ChangeDetectorRef.markForCheck()` (prefer signals).
- [ ] **Step 4:** Commit: `git add -A client/src && git commit -m "perf: enable OnPush change detection across components"`.

### Task 7.2 — Migrate `@Input()` / `@Output()` to signal `input()` / `output()`

The codebase uses very few `@Input`/`@Output` (most components are smart). But dialog data and child component props are good candidates.

- [ ] **Step 1:** Run the schematic: `ng generate @angular/core:signals`. (In Angular 20, signal-input migration is a built-in schematic.)
- [ ] **Step 2:** Review the diff. Schematic converts `@Input() name: string` → `name = input<string>()` and template usages from `name` → `name()`.
- [ ] **Step 3:** Build: `npm run build`.
- [ ] **Step 4:** Smoke test affected components.
- [ ] **Step 5:** Commit: `git add -A client/src && git commit -m "refactor: migrate to signal inputs/outputs"`.

---

## Phase 8 — Lazy load routes

**File:** `client/src/app/app.routes.ts`

- [ ] **Step 1:** Replace each `component: XxxComponent` with `loadComponent: () => import('...').then(m => m.XxxComponent)`. Drop the top-of-file component imports that are only referenced in routes. Keep the guards as is.

Example transformation:
```ts
{
  path: 'home',
  loadComponent: () =>
    import('./main/home/home.component').then((m) => m.HomeComponent),
},
```

- [ ] **Step 2:** Build: `npm run build`. Inspect `dist/`'s `stats.json` (or just look at the chunk file list) — should now see one chunk per route (e.g. `home.component-Hash.js`).
- [ ] **Step 3:** `npm start` and open DevTools → Network. Navigate from home → products → cart and confirm each navigation downloads its own JS chunk lazily.
- [ ] **Step 4:** Commit: `git add client/src/app/app.routes.ts && git commit -m "perf: lazy-load all routes via loadComponent"`.

---

## Phase 9 — Polish

### Task 9.1 — `@for` track expressions audit

`@for` requires a `track` expression but the schematic from Phase 3.1 will have inserted defaults like `track $index`. For lists with stable IDs, `track item._id` is more efficient.

- [ ] **Step 1:** `grep -rn "track \$index" client/src/app` — for each result, check if the iterated item has a stable `._id`. If so, change to `track item._id`.
- [ ] **Step 2:** Build: `npm run build`.
- [ ] **Step 3:** Commit: `git add -A client/src && git commit -m "perf: prefer stable track expressions in @for"`.

### Task 9.2 — Extract magic numbers / strings to constants

**File:** `client/src/app/shared/ui-constants.ts` (new)

- [ ] **Step 1:** Write:
```ts
export const DIALOG_DEFAULTS = {
  width: '300px',
  enterAnimationDuration: '300ms',
  exitAnimationDuration: '200ms',
} as const;

export const NOTIFICATION_TIMEOUT_MS = 4000;
export const ERROR_TIMEOUT_MS = 3000;
export const AUTH_REDIRECT_DELAY_MS = 2000;
export const CART_MAX_QTY = 50;
```

- [ ] **Step 2:** Replace inline values across:
  - All `matDialog.open(..., { width: '300px', ... })` calls — spread `DIALOG_DEFAULTS`.
  - `NotificationService.setNotification` (`4000` → `NOTIFICATION_TIMEOUT_MS`).
  - `ErrorService.setError` (`3000` → `ERROR_TIMEOUT_MS`).
  - Login/Register/Home redirects (`2000` → `AUTH_REDIRECT_DELAY_MS`).
  - `product-details.component.ts:92` (`50` → `CART_MAX_QTY`).
- [ ] **Step 3:** Build: `npm run build`.
- [ ] **Step 4:** Smoke test that timing/dialog sizing still matches.
- [ ] **Step 5:** Commit: `git add -A client/src && git commit -m "refactor: extract UI magic numbers to constants"`.

### Task 9.3 — Replace `ng-lazyload-image` with native `loading="lazy"`

- [ ] **Step 1:** `grep -rn "lazyLoad\|defaultImage" client/src` — find every template usage.
- [ ] **Step 2:** For each `<img [defaultImage]="..." [lazyLoad]="url">`, replace with `<img [src]="url" loading="lazy" decoding="async" alt="...">`. The `defaultImage` placeholder pattern can be skipped (browser handles it natively now); if a placeholder is critical, use a CSS background.
- [ ] **Step 3:** Remove `ng-lazyload-image` import in any `imports` arrays.
- [ ] **Step 4:** Remove `ng-lazyload-image` from `client/package.json` dependencies. `npm install`.
- [ ] **Step 5:** Build: `npm run build`.
- [ ] **Step 6:** Smoke test products page — images should still lazy-load (DevTools → Network → Img tab will show progressive loading as you scroll).
- [ ] **Step 7:** Commit: `git add -A client && git commit -m "refactor: use native img loading=lazy instead of ng-lazyload-image"`.

---

## Phase 10 — Final verification & PR

- [ ] **10.1** — Run a clean build: `rm -rf client/dist client/node_modules && cd client && npm install && npm run build`. Confirm bundle size is smaller than baseline (deps removed: moment, ngrx, ng-lazyload-image, ngrx-store-localstorage).
- [ ] **10.2** — Run tests once more: `npm test -- --watch=false --browsers=ChromeHeadless`. Note pass/fail delta from baseline. Tests aren't gating per user direction, but record what's now broken so a follow-up branch can address them.
- [ ] **10.3** — Full smoke test of all 8 baseline scenarios.
- [ ] **10.4** — Push branch: `git push -u origin refactor/client-modernization` (only after user explicitly approves).
- [ ] **10.5** — Open PR (gh) — only after user approval.

---

## Verification (end-to-end test plan)

After each phase boundary, repeat this:

1. `cd server && npm start` (separate terminal).
2. `cd client && npm start`.
3. Open `http://localhost:4200` in a browser with DevTools open.
4. Walk through all 8 smoke-test scenarios from the Strategy section.
5. Watch DevTools console — should be quiet (no errors, no warnings introduced by us). Pre-existing third-party warnings are tolerable but flag if anything new appears.
6. Watch DevTools Network tab — confirm no double-firing requests (a sign of leaked subscriptions).

If any phase fails verification, do **not** advance to the next phase. Either fix-forward in the same phase or revert (`git reset --hard HEAD~N`) back to the last good commit.

---

## Notes for the executor

- **First action of every session** is to load the `angular-developer` skill (Step 0.0). Do not skip — it is the primary reference for every refactor in this plan. The `angular-new-app` skill is not needed (we are not scaffolding a new app).
- Use the superpowers `subagent-driven-development` skill (per user request) when executing this plan: dispatch one task per subagent, review between tasks.
- Commits are intentionally small so `git bisect` works if a regression appears at the end.
- Tests are NOT gating per user direction. If a test breaks, leave it broken with a clear `// TODO: rewrite for signals` comment (or similar) and proceed.
- The `WishlistComponent.onRemove` `switchMap` cleanup mentioned in earlier analysis is folded into Phase 5 (it'll naturally get cleaner when subscriptions go through `takeUntilDestroyed`).
