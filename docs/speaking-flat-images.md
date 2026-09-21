# 看圖說話：平面插畫第二版

依使用者提供的教材插畫參考，使用 imagegen 技能及內建 image_gen 重製。首頁封面不變；遊戲內改用清楚輪廓和平面色塊。

## 已保存資產

- client/public/images/stories/rain-flat.webp：單頁，1536 × 1024。
- client/public/images/stories/blocks-flat.webp：單頁，1536 × 1024。
- client/public/images/stories/seed-four.webp：一頁四格，1536 × 1024。

全數逐張檢查，保留原尺寸，WebP quality 84 / method 6。四格為播種、澆水、發芽、畫下小芽，從左上、右上、左下、右下閱讀。介面新增兩類篩選，四格使用四張情節卡與四個連接詞。

## 最終提示詞

### rain-flat

Use case: illustration-story. Use attached image ONLY as STYLE reference. Flat 2D children's Chinese textbook illustration: clean dark outlines, simple solid bright color fills, expressive simple faces, minimal shading, uncluttered backgrounds. NO 3D, NO clay, NO photorealism, NO realistic textures, NO dramatic lighting. No written words, numbers or speech bubbles. One SINGLE full-page landscape scene 3:2, no panels: park in light rain. LEFT child in yellow raincoat holding red umbrella, CENTER child in blue coat with open hand toward friend. RIGHT small orange cat under wooden bench. Few trees, puddles and visible raindrops, simple grey cloud upper right. Full bodies, readable actions. Generous spacing. Original composition, not copying reference scene.

### blocks-flat

Use case: illustration-story. Use attached image ONLY as STYLE reference. Flat 2D children's Chinese textbook illustration: clean dark outlines, simple solid bright color fills, expressive simple faces, minimal shading, uncluttered backgrounds. NO 3D, NO clay, NO photorealism, NO realistic textures, NO dramatic lighting. No written words, numbers or speech bubbles. One SINGLE full-page landscape scene 3:2, no panels. Playroom: LEFT child in orange shirt, hands beside head and surprised open mouth; CENTER pile of fallen colorful wooden blocks on rug; RIGHT child in teal shirt holding a blue block thoughtfully. Red toy car foreground left. Simple shelf in background, only a few toys. Clear outlines, full bodies, spacious. No explanation for why blocks fell.

### seed-four

Use case: illustration-story. Use attached image ONLY as STYLE reference. Flat 2D children's Chinese textbook illustration: clean dark outlines, simple solid bright color fills, expressive simple faces, minimal shading, uncluttered backgrounds. NO 3D, NO clay, NO photorealism, NO realistic textures, NO dramatic lighting. No written words, numbers or speech bubbles. A complete FOUR-PANEL story on ONE landscape 3:2 page. EXACTLY 2 rows x 2 columns equal panels, narrow clean white gutters. Same little girl with black bob hair, pink shirt and blue trousers, same orange flowerpot and garden table, consistent character in EVERY panel. Reading order: TOP LEFT girl puts one brown seed into soil in pot with finger. TOP RIGHT girl gently waters soil with small yellow watering can, NO sprout yet. BOTTOM LEFT on a later day girl notices a tiny green TWO-leaf sprout in same pot and looks delighted, yellow watering can set aside. BOTTOM RIGHT girl sits beside pot and draws the sprout on paper with pencil, small orange cat watches. Show pencil touching paper and a simple sprout drawing. Distinct simple action each panel. Four different sequential moments, not four copies. No text or panel numbers; UI will add numbers.

