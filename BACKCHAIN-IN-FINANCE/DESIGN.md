---
name: Ocular Omen Pro
colors:
  surface: '#0f1321'
  surface-dim: '#0f1321'
  surface-bright: '#353849'
  surface-container-lowest: '#0a0d1c'
  surface-container-low: '#171b2a'
  surface-container: '#1b1f2e'
  surface-container-high: '#262939'
  surface-container-highest: '#303444'
  on-surface: '#dfe1f6'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dfe1f6'
  inverse-on-surface: '#2c303f'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#009eb9'
  on-tertiary-container: '#002f38'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#0f1321'
  on-background: '#dfe1f6'
  surface-variant: '#303444'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
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
  data-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.01em
  data-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-xs: 8px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system embodies a premium, futuristic fintech aesthetic that merges high-utility data density with a luxurious, cinematic atmosphere. It targets sophisticated investors and tech-forward users who demand precision and clarity within a modern SaaS environment.

The visual style is a hybrid of **Minimalism** and **Glassmorphism**, emphasizing depth through transparency and light. The UI should feel like a high-end command center—dark, immersive, and human-centered. Key attributes include:
- **Atmospheric Depth:** Utilizing deep backgrounds with aurora-inspired gradients to create a sense of vastness.
- **Precision Engineering:** Sharp typography and monospaced data points to convey financial accuracy.
- **Subtle Radiance:** Interaction states are defined by soft outer glows and vibrant accent borders rather than heavy fills.

## Colors
The palette is built on a deep "Midnight Navy" foundation to ensure maximum contrast for financial data. 

- **Primary & Secondary:** A digital-native blue and violet pairing used for main actions and branding elements.
- **Accent:** A piercing cyan reserved for highlights, active indicators, and focus states.
- **Glass Surfaces:** Cards use a semi-transparent dark grey with a 10% opacity white border to simulate physical glass.
- **Aurora Gradients:** Use subtle 15% opacity blurs of primary and secondary colors in the background corners to prevent the dark mode from feeling "flat."

## Typography
This design system employs a tri-font strategy to balance character, readability, and technical utility.

1. **Space Grotesk (Headings):** Provides a futuristic, geometric personality for all primary headers and display text.
2. **Inter (Body):** Used for all descriptive text, inputs, and general interface labels to ensure maximum legibility at small sizes.
3. **JetBrains Mono (Data):** Specifically for financial figures, balances, and timestamps. Tabular figures ensure that columns of numbers align perfectly for easy scanning.

## Layout & Spacing
The system utilizes a **12-column fluid grid** for desktop and a **single-column vertical stack** for mobile. 

- **The 4px Rule:** All spacing increments must be multiples of 4px to maintain a strict mathematical rhythm.
- **Negative Space:** Emphasize generous padding within cards (minimum 32px) to evoke a premium, airy feel.
- **Sectioning:** Distinguish major functional areas with 48px to 64px of vertical spacing to prevent visual clutter in data-heavy views.

## Elevation & Depth
Depth is created through **Glassmorphism** and light filtration rather than traditional drop shadows.

- **Surface Tiers:** 
  - *Tier 0 (Background):* Deep #050816.
  - *Tier 1 (Cards):* #111827 with 60% opacity and a 16px backdrop blur.
  - *Tier 2 (Modals/Popovers):* #1F2937 with 80% opacity and 24px backdrop blur.
- **Borders:** Surfaces use a 1px solid border. Top and left borders should be slightly lighter (`rgba(255,255,255,0.1)`) than bottom/right borders to simulate a top-down light source.
- **Glows:** Active elements (like the primary button or selected charts) should emit a subtle 20px spread outer glow using their respective brand color at 30% opacity.

## Shapes
The shape language balances extreme approachability with technical precision.

- **Containers & Cards:** Use a generous 24px radius (`rounded-xl` / `rounded-2xl`) to create a soft, high-end feel for the main structural elements.
- **Interactive Elements:** Buttons and Input fields use a 12px radius. This "sharper" corner compared to the containers signals their functional, precise nature.
- **Status Pills:** Small UI badges (like success/danger tags) use full-round pill shapes (999px radius).

## Components
- **Buttons:** 
  - *Primary:* Solid #3B82F6 fill with white text. On hover, apply a subtle 10px blue glow.
  - *Secondary:* Ghost style with 1px border of #8B5CF6 and matching text.
- **Cards:** Must include a 1px `white/10%` border and a backdrop blur of at least 12px. Internal padding should be consistently 24px or 32px.
- **Inputs:** Dark background (#050816) with a subtle 1px border. Focus state changes border to #06B6D4 with a soft inner glow.
- **Data Chips:** Small, semi-transparent backgrounds with JetBrains Mono text. Example: A "Success" chip uses #10B981 at 10% opacity for the background and 100% opacity for the text.
- **Charts:** Use thin 2px strokes for line graphs. Area charts should use a vertical gradient from the primary color (top) to transparent (bottom).
- **Navigation:** Top-level nav should be fixed with a "Glass" effect, blurring the content as it scrolls underneath.