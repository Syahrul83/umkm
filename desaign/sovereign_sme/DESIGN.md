---
name: Sovereign SME
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#191c1e'
  on-tertiary-container: '#818486'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 14px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 12px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The brand personality is **Trustworthy, Empowering, and Precise**. This design system is built for an SME (UMKM) idea platform, meaning it must bridge the gap between entrepreneurial ambition and professional reliability. The target audience includes small business owners and aspiring entrepreneurs who require a platform that feels stable, accessible, and high-quality.

The visual style is **Corporate Modern with a Minimalist focus**, drawing heavy inspiration from contemporary utility-first frameworks (like Shadcn UI). It emphasizes clarity, intentional whitespace, and subtle depth to create a focused user experience. The emotional goal is to provide a sense of "digital headquarters"—a clean space where complex business ideas become manageable.

## Colors

The palette is anchored in a sophisticated **Deep Slate (#0F172A)** for primary actions and typography, conveying authority and stability. A **Teal accent (#0D9488)** is used sparingly for secondary actions, success states, or brand highlights to inject a sense of growth and innovation.

The background ecosystem utilizes **Soft Neutrals (Slate/Zinc scales)**. The primary background is a very light grey-blue to reduce eye strain, while component surfaces use pure white to pop against the background. Borders use a low-contrast grey to maintain a crisp but soft appearance.

## Typography

The typography system relies exclusively on **Inter**, a typeface designed for screens. It is chosen for its exceptional legibility at small sizes and its neutral, professional character. 

- **Headlines:** Use tighter letter spacing and heavier weights to create a strong visual anchor.
- **Body Text:** Standard tracking with generous line heights to ensure readability for business documentation.
- **Labels:** Used for buttons and input headers, employing medium weights to distinguish them from standard body copy.

## Layout & Spacing

This design system uses a **Fixed Grid** approach for desktop (12 columns) and a **Fluid Fluid** approach for mobile. The layout is centered on a modular "Card" system where content is grouped into logical blocks.

- **Desktop:** 12-column grid, 24px gutters, max-width of 1280px.
- **Tablet:** 8-column grid, 20px gutters.
- **Mobile:** Single column stack with 16px side margins. 

The vertical rhythm is governed by an 8px base unit, ensuring that all gaps between elements (buttons to inputs, headers to body) are consistent multiples of 8.

## Elevation & Depth

Visual hierarchy is established through **Low-contrast Outlines and Ambient Shadows**. 

1.  **Level 0 (Background):** Slate-50 (#F8FAFC).
2.  **Level 1 (Cards/Inputs):** White surface with a 1px border in Slate-200.
3.  **Level 2 (Active/Floating):** A very soft, diffused shadow (0 4px 6px -1px rgb(0 0 0 / 0.1)) used for focused inputs or primary containers like login boxes.

Shadows are never harsh; they are tinted with the primary deep blue to ensure they feel like they belong to the environment rather than being a generic black drop-shadow.

## Shapes

The shape language is defined by **Medium Roundedness**. Following the `rounded-lg` (0.5rem / 8px) standard, this provides a modern, friendly feel without becoming overly "bubbly" or "childish."

- **Buttons & Inputs:** 8px (0.5rem) corner radius.
- **Cards & Modals:** 12px (0.75rem) corner radius for a more substantial container feel.
- **Chips/Badges:** Fully pill-shaped to distinguish them from actionable buttons.

## Components

### Buttons
- **Primary:** Deep Slate background, white text. No shadow, 8px radius. High contrast is key.
- **Secondary:** Transparent background with a Slate-200 border. Subtle hover state with a light grey fill.
- **Ghost:** No border or background unless hovered. Used for "Cancel" or "Forgot Password" links.

### Input Fields
- **Default:** White background, 1px Slate-200 border, 8px radius. 
- **Focus State:** 1px Primary color border with a 2px "ring" (soft blue glow) to provide clear visual feedback for accessibility.
- **Placeholder:** Muted neutral (#94A3B8).

### Cards
- Used for the login container and dashboard widgets. 
- White background, 1px border (Slate-200), and Level 2 ambient shadow. 
- Padding should be generous (2rem / 32px) to ensure the content feels uncrowded.

### Checkboxes & Radios
- Small, crisp 4px radius for checkboxes. Use the primary color for the checked state to maintain high visibility.