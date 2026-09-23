# English Picture Talk — PDF expansion

Local-only addition. No release or Git push is authorised by this request.

## Coverage

- 27 scanned PDF pages, 86 unique cards, plus the existing 3 English cards = 89.
- Source inventory: `english-pdf-card-inventory.json` records the page and printed card number.
- All new illustrations use the built-in image generation tool, not scans or crops.
- Prompt set and workspace asset paths: `english-pdf-image-prompts.json`.
- Style reference: the existing `client/public/images/stories/english-garden.webp`.
- WebP encoding preserves generated dimensions, quality 85; no downscaling.

## Learning design

Each new card has eight clickable words, five guided questions with optional ideas,
and a six-sentence sample. English is adapted into short sentences for roughly Hong
Kong Primary 2; topic-specific nouns can be heard with a tap. An adult can explain
unfamiliar words. Samples are suggestions, not the only correct answer.

The large illustration stays on the left with compact words below; questions and
the sample stay on the right. Narrow screens use one scrolling column. Selecting
a word speaks it and shows a circle at its visually checked position. No recording,
timer, scores, slow-voice controls or extra picture-listen controls were added.

The library offers topic filters, vocabulary/title search and 12 cards per page.
Back keeps the selected topic, search and page. Images are loaded lazily.

## Source corrections

The activities preserve the source themes, not printing errors or misleading details.
The model volcano produces foam, not smoke. Aquarium scenes do not show a captive
blue whale. Lost-child and stranger-safety lessons focus on checking with a caregiver
and asking identifiable helpers, not judging people by appearance. Emergency scenes
are non-graphic. Outdoor activities show sensible protective equipment.

## Maintenance

Human-authored lesson inputs: `english-pdf-scenes.txt`, `english-pdf-coaching.txt`.
Verified circle positions: `english-pdf-markers.json`, in vocabulary order (percent).
Run `node scripts/build-english-pdf-content.mjs` after editing these files, then
`node scripts/check-english-pdf.mjs`, TypeScript checks and `vite build`.
Do not run the package's legacy `build` script.

## Verification (2026-09-23)

- All 86 generated illustrations were opened and visually checked against the vocabulary.
- 86 WebP files retain 1536 × 1024 pixels; combined size is about 14.87 MiB.
- Content check passes: 688 word positions, 430 questions, 516 sample sentences.
- TypeScript and production Vite build pass (existing large-bundle warning remains).
- Browser checks: search, topic selection, pagination, empty state, retained filters on Back,
  word circles, optional answer ideas and sample disclosure.
- At 1024px: picture/sidebar columns; at 390px: one continuous scrolling column, no horizontal overflow.
- Speech interaction reuses the existing English speech function; actual audio was not audited.
- No release, deployment, version bump, Git commit or push was performed.
