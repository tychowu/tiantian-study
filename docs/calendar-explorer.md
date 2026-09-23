# 日期小探險家

本地新增遊戲，未部署或推送。四個探索區：今天是哪一天、四季轉盤、月份日期積木、二月的秘密。支援粵語點讀、英語月份點讀、香港時區今日日期更新、逐日跨月跨年、不計分的小任務。

## 日期規則與資料

- 公曆閏年：4 的倍數，整百年份須為 400 的倍數。二月 28／29 天，全年 365／366 天。
- 明確區分公曆閏日與農曆閏月。
- 香港氣象四季：春 3–5 月、夏 6–8 月、秋 9–11 月、冬 12–2 月；實際天氣不隨月份瞬間改變。
- 香港天文台：https://www.hko.gov.hk/tc/gts/time/basicterms-leapyear.htm
- https://www.hko.gov.hk/tc/education/climate/general-climatology/00545-definition-of-seasons.html
- https://www.hko.gov.hk/tc/gts/time/lunarcal.htm

## 封面

使用內建 imagegen，參照現有 clock-v3.webp 的柔和黏土貼紙畫風生成。
成品：`client/public/images/cards/calendar-explorer.webp`，保留原始 1280×1280 與透明 alpha，WebP quality 85。

Prompt:
> Use case: stylized-concept. Create a square children's learning game home-card icon on a genuinely TRANSPARENT alpha background. Attached image is STYLE REFERENCE only: same playful softly textured clay sticker, rounded shapes, happy face, saturated blue coral orange and cream, clean silhouette. New subject: a smiling cream tear-off desk calendar with blue binder rings and coral top, simple blue date grid with ONE orange highlighted square (no text or numerals), surrounded by four small seasonal symbols: pink flower, golden sunshine, orange leaf, cosy blue mitten. Cohesive compact cluster, generous transparent margins, entire subject visible, no ground plane, no solid background, no checkerboard painted in, no watermark. Match existing homepage clock icon polish; this is a calendar not a clock.

## 驗證

`node scripts/check-calendar.mjs`：閏年例外、月份天數、跨月跨年、香港午夜、星期與季節。
`./node_modules/.bin/tsc --noEmit`
`./node_modules/.bin/vite build`
