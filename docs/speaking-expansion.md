# 看圖說話：新增 11 組內容

使用 imagegen 技能、內建 image_gen 逐張生成。統一參考既有 seed-four.webp 的平面教材插畫風格；所有成品保留 1536 × 1024，WebP quality 84 / method 6，共約 2 MB。完整逐張提示詞、來源和保存路徑見 [story-image-batch.json](./story-image-batch.json)。

圖片保存於 `client/public/images/stories/`：

- 單頁：typhoon-flat、market-flat、library-flat、seaside-flat、picnic-flat、moon-flat。
- 四格：boat-four、lost-four、sandwich-four、bridge-four、butterfly-four。

連同原有 3 組，共 14 組：8 張單頁、6 頁四格。每組有 4 個觀察點、3 個想法提示、3 或 4 張情節卡、開放結尾及參考故事。單頁情節明確屬想像；四格按照左上、右上、左下、右下閱讀。

## 颱風圖的最終修訂提示詞

Edit this flat 2D educational cartoon. Preserve composition, style, people and all objects, but IMPORTANT safety correction: father must be away from the storm-exposed window, not touching it or checking latch during storm. Move father to the empty floor area in front of dining table left foreground, holding a blue emergency supply bag with both hands, looking toward family. Window remains fully shut, with rain and bent trees visible. No person close to window. Keep entire image flat cartoon. Mother and girl talking, boy putting basketball away. No text. 3:2 landscape.

成品不示範風雨期間在窗邊釘木板或處理玻璃。原始颱風參考只取家庭活動主題，不複製其危險動作。颱風提醒核對 [香港天文台](https://www.hko.gov.hk/en/informtc/precaution.htm)；蝴蝶的幼蟲、蛹、成蟲先後核對 [Smithsonian Gardens](https://gardens.si.edu/learn/for-educators/cultivating-habitat/butterfly-gardening/about-butterflies/)。蝴蝶故事是觀察片段，不是包含卵期的完整生命週期圖。

所有圖片已逐張檢查，並按實際構圖校準單頁線索位置。只更新本地，不發布、不提交、不推送。
