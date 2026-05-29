# Design Audit Notes

## OpenRouter
- Light/white background with clean dark text — high contrast, very readable
- Compact, tight nav with search bar integrated
- Cards: white bg, subtle gray border, rounded corners (~8px), icon + title + description + CTA link
- Stats row: large bold numbers, small label below, no decoration
- Featured Models: card grid with favicon, model name, provider, token count, trend badge
- Typography: clean sans-serif (likely Inter), medium weight headings, small body text
- Color: white bg, black text, purple/violet accent (#6366f1 range), green for positive trends, red for negative
- Minimal decoration — no gradients, no glow effects
- Very data-dense, functional, developer-focused

## Near.ai
- Dark background with organic 3D blob/texture hero image (gray-green organic material)
- Monospace/code font for terminal-style labels (">> CLIENT KEY PAIR")
- Floating card UI overlaid on hero image — cards are light gray/white with rounded corners
- Typography: large bold sans-serif headlines (left-aligned), monospace for secondary labels
- Color: near-black bg (#0a0a0a), white cards, neon green accent (#00ff41 / lime green), gray text
- Vertical grid lines as structural decoration
- Terminal aesthetic mixed with clean product UI
- Partner logos in a ticker/marquee row
- Numbered feature list (#01, #02, #03) with icon + title + description

## Aleo
- Off-white/light gray background (#f5f5f0 range)
- Large editorial left-aligned headlines (very large, 80-100px)
- Uppercase tracking-widest button labels ("START BUILDING", "EXPLORE USE CASES")
- Black pill CTA button with arrow, ghost outline secondary button
- Dotted globe SVG as hero visual element
- Tight grid lines as structural decoration
- Dark banner strip with "Crypto's most private wallet" + CTA
- Partner logo row (coinbase, a16z, google cloud, revolut)
- Color: off-white bg, black text, minimal color use
- Very editorial, typographic-first design

## Synthesis for Lugano.ai
Key design directions to adopt:
1. OpenRouter's data density and card system for models/agents sections
2. Near.ai's terminal aesthetic, monospace labels, dark bg with floating cards
3. Aleo's large editorial typography, uppercase tracking, structural grid lines
4. Combine: dark bg (Lugano's existing obsidian), but add structural grid lines (Aleo),
   terminal/monospace labels (Near.ai), clean card system with subtle cyan/teal glow accent
   instead of purple (to match Lugano's existing teal brand from the reference screenshots)
5. Stats row like OpenRouter's but with Lugano's dark theme
6. Replace serif-heavy current design with a mix: display sans for headlines + monospace for labels
