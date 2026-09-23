# 中文四格故事擴充

來源：使用者提供《看图写话2中文(1).pdf》，62 頁。每兩頁合併一個四格故事，共 31 個；故事名稱為本網站新擬。

- `chinese-pdf-scenes.json` 按 PDF 次序保存每個故事的情節、問題及插畫分鏡。
- `scripts/build-chinese-pdf-content.mjs` 產生遊戲資料；`sourcePages` 保留頁碼對應。
- 圖片全部由內建 image_gen 重繪，沿用 `seed-four.webp` 的平面卡通畫風；保持四格左上、右上、左下、右下閱讀順序。
- 插畫及修訂提示詞見 `chinese-pdf-image-prompts.json`；最終 31 張 WebP 存在 `client/public/images/stories/chinese-pdf-*.webp`。紙箱火車採用 `-v2`，第二格已修正為想像氣泡，避免先製成再製作的順序錯誤。
- 每個故事：4 個可點讀觀察問題、3 個思考方向、4 張排序情節卡、示範故事及自由續編問題。沿用現有粵語語音選擇，不錄音或上傳孩子聲音。
- 中文故事庫增加搜尋、每頁 12 張、延遲載入圖片；返回選圖保留分頁及搜尋。
- 安全與內容調整：求助警員不追趕；火災遠離現場；清河留在岸邊；裁剪、煮食由大人協助；生病情節不把寒冷、淋雨或單次飲食當作確定病因；眼鏡不是懲罰；動物故事明示童話。

本批只更新本地，未授權發布或推送。

驗證：`node scripts/check-chinese-pdf.mjs`、`./node_modules/.bin/tsc --noEmit`、`./node_modules/.bin/vite build`。

實測通過：搜尋「盆栽」、點第三格顯示相應問題、四格排序、示範展開、共 37 個四格故事分 4 頁、最後一張狐狸故事載入、Back 返回保留第 4 頁；768px 平板直向沒有橫向溢出，圖片與提示使用同一個 `stage-scroll` 容器。原有英文 86 張 PDF 卡片的檢查亦通過。
