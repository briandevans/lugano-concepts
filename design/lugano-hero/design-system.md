# Lugano editorial system

The homepage uses warm paper and engraved cobalt to make a private-AI claim feel as inspectable as a Swiss technical document. The hero remains the visual source of truth; the below-hero system continues its palette without restyling the hero or its verification ledger.

## Tokens

| Purpose | Value |
| --- | --- |
| Paper | `#fcf2df` |
| Deep ink | `#123a70` |
| Cobalt | `#194987` |
| Engraving accent | `#2552a0` |
| Paper panel | `#fffaf0` |
| Copy | `#31516e` |

Use Instrument Serif for high-level claims and IBM Plex Sans for body copy. JetBrains Mono is reserved for labels, numbers, metadata, and proof-like details.

## Surface rhythm

- Paper chapters carry explanatory material, diagrams, model detail, and use cases.
- Cobalt chapters carry the problem, privacy comparison, platform sequence, private agents, and closing/application moment.
- Panels are flat with thin rules and a 3–5px radius. Do not reintroduce glass effects, neon glows, broad gradient fills, or oversized rounded cards.
- Maintain 16px or larger body copy, generous chapter spacing, and clear keyboard focus outlines.

## Artwork

- Hero engraving: `/assets/lugano-engraving-v1.webp`, with `/assets/lugano-engraving-v1-mobile.webp` for the narrow crop.
- Use-case engravings: `/assets/lugano-enterprise-engraving.webp`, `/assets/lugano-sovereign-engraving.webp`, and `/assets/lugano-regulated-engraving.webp`.
- Keep these assets unfiltered. Their cobalt, ivory, and engraving detail are the intended palette; only the small card-image hover scale is retained.

All four illustrations were created with the built-in image-generation tool. The native outputs are 1672 × 941. The hero keeps that resolution; the mobile variant and 1000px use-case assets are optimized WebP derivatives.

| Illustration | Site asset | Exact generation prompt |
| --- | --- | --- |
| Lugano panorama | [Hero](../../assets/lugano-engraving-v1.webp) | [Prompt](imagegen-prompt.txt) |
| Enterprise | [Engraving](../../assets/lugano-enterprise-engraving.webp) | [Prompt](lugano-enterprise-prompt.txt) |
| Government and defense | [Engraving](../../assets/lugano-sovereign-engraving.webp) | [Prompt](lugano-sovereign-prompt.txt) |
| Regulated industries | [Engraving](../../assets/lugano-regulated-engraving.webp) | [Prompt](lugano-regulated-prompt.txt) |

## Implementation map

`lugano-design-system.css` is loaded after `homepage-sections.css`. It scopes all below-hero rules away from `.lgx-hero-editorial` and `#lugano-proof-ledger`, which remain hero-owned.

It uses semantic IDs/classes instead of section position: `#privacy`, `#architecture`, `#platform`, `#cta`, `#use-cases`, `#private-agents`, and `#private-models`. The shared `#root nav` rules cover both the homepage and the hash-routed application view, including its mobile menu. The footer uses an inverse paper mark on cobalt; `logo-mark.svg` itself is a solid cobalt three-block mark on a 10% cobalt square.

The same stylesheet is linked after the existing styles in `/docs/`, `/privacy/`, `/terms/`, and `/security/` so their source content stays untouched while their visual shells match.

`/deck/` is an immediate DocSend redirect and has no local presentation shell to theme.
