# THE BOX Academy design system

## 1. Direction

Preserve the existing academy landing page: bright editorial content, strong blue accents, and a quiet black footer. Footer legal content should feel authoritative, compact, and readable rather than promotional.

## 2. Tokens

- Brand: `--blue` / `--blue-dark`
- Neutrals: `--black`, `--white`, `--gray-bg`, `--gray-light`, `--gray-mid`, `--gray-text`
- Korean type: `--font-ko` (Pretendard system stack)
- English type: `--font-en` (DM Sans)
- Radius: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-pill`
- Elevation: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-blue`
- Motion: `--transition`, `--transition-slow`
- Layout: `--container`, `--section-pad`
- Legal surfaces: `--modal-wide`, `--tuition-table-min`, `--text-strong`

## 3. Typography

Body content uses Pretendard with a 1.6–1.75 line height. Footer business data is compact at 0.78–0.82rem. Legal modal headings use 1–1.25rem and body copy uses 0.84–0.9rem.

## 4. Spacing and responsive behavior

Spacing follows the page's existing 4px base rhythm. Legal modals use a maximum width of 760px, 24px desktop padding, and 18–20px mobile padding. Footer metadata wraps on wider screens and stacks on screens below 900px. Tabular policy content keeps a minimum readable table width and scrolls inside the modal on narrow screens.

## 5. Primitives and states

- Footer policy link: default, hover, keyboard-focus.
- Footer business datum: plain text or contact link; separators disappear when stacked.
- Legal modal: hidden, open, internally scrollable; backdrop click and Escape close it.
- Tuition table: captioned, column-labelled, numeric values aligned consistently, and horizontally scrollable below its minimum width.
- Modal close button: default, hover, active, keyboard-focus.

## 6. Motion

Interactive color and close-button press feedback use 0.2s opacity/color/transform transitions. No decorative modal animation is required.

## 7. Accessibility

The modal uses `role="dialog"`, `aria-modal`, a labelled title, focus containment, Escape dismissal, trigger focus restoration, and scroll locking. Interactive footer controls retain visible keyboard focus.

## 8. Accepted debt

The page remains a single static HTML file with inline CSS and JavaScript to match the existing deployment architecture. Existing third-party links and analytics are outside this footer-only change.
