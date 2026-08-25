# Royal AI Group — $15M SAFE deck

16 slides. 1920×1080. Warm black, bone type, one gold line.

## Present

```
npx --yes serve deck
```

Arrow keys, space, and swipe change slides. `#s01` … `#s16`.

## Export PDF + PNGs

```
cd deck
npx --yes playwright install chromium
node export.mjs
```

Writes `export/slide-01.png` … `slide-16.png` and `export/Royal_AI_Group_SAFE.pdf`.

A PowerPoint built from those PNGs lives at `export/Royal_AI_Group_SAFE.pptx`.

## Diligence

See `SOURCES.md`. Nothing in brackets ships. Unresolved counsel items are omitted or stated as ranges.
