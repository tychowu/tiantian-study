# English Picture Talk — local update

Three original flat 2D pictures based on the user's themes: a garden, a living room and a school canteen. Existing Chinese stories remain unchanged. English mode uses English throughout, including game-stage controls. Language difficulty is an editorial target around Hong Kong Primary 2, not a certified curriculum alignment.

Each scene has 8 tappable words/phrases, a matching picture marker and example sentence, 5 guided questions with sentence starters and optional ideas, and a 6-sentence sample available only on request. Both whole-paragraph and individual-sentence English speech use the existing speech utility at its default English rate. The separate slow/stop, choose-picture and picture-description buttons were removed on request. The left column contains the picture and compact Key Words without a heading number; Guided Questions and My Picture Talk sit on the right. Narrow screens stack both columns. All content shares the page scroll, without a sticky picture or nested scrolling. The sections use distinct soft colours and playful icons. Leaving a session cancels speech. There is no recording, upload, timer or automatic assessment. The personal question is open-ended and the sample never invents the child's personal experience.

The shared Back button returns to the nearest registered parent: story to picture picker, detail to gallery, non-default activity to game overview. Games without a nested page return to the home shelf. This is parent navigation, not an undo stack for answers or experiment settings. Escape uses the same handler outside fullscreen.

Images were created using the **imagegen skill and built-in image_gen**, inspected individually and encoded as WebP quality 84 / method 6 at original 1536 × 1024 resolution. Saved assets:

- `client/public/images/stories/english-garden.webp`
- `client/public/images/stories/english-living-room.webp`
- `client/public/images/stories/english-canteen.webp`

Full prompts and original generated paths: [english-picture-talk-images.json](./english-picture-talk-images.json). The provided photographs supplied subject matter only; existing library-flat.webp supplied visual style. No scanned worksheet branding or text was copied into the illustrations.

Festival update: Chinese/English names and all five information fields are text buttons; speaker glyphs and photo corner captions removed. English names enlarged to 24–32 px. The calendar lists tappable festival names. Cards grow with content rather than clipping longer text.

Validation: TypeScript and Vite build; all 16 festival cards checked in browser for absent speaker glyphs/captions and no vertical card overflow. English question hints and sample toggles checked in browser. Speech output still depends on voices available on the user's browser/device. Local edits only; no release or push.
