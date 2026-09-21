# AGENTS.md — 天天学习空间（给 AI 助理的项目规范）

> 儿童学习网站，用户是 5 岁小朋友「天天」。线上地址 https://tiantian.diwu-pru.vip
> 技术栈：React 19 + Vite 7 + TypeScript + Tailwind 4，纯前端静态站点。

---

## 一、发布流程（最重要，照做即可）

**发布授权规则（用户于 2026-09-21 明确要求）：默认只修改、构建和测试本地文件。未经用户本次明确确认发布，不得运行 release.py、部署网站或 push 到 GitHub。先让用户确认本地效果，再按其指示发布。以下流程只在获得发布授权后执行。**

**一条命令完成发版**（递增版本号 → 类型检查 → 构建 → 提交 → 推送 → 部署）：

```bash
cd /Users/tychowu/WorkBuddy/天天学习空间 && \
/Users/tychowu/.workbuddy/binaries/python/envs/default/bin/python scripts/release.py -m "这次改了什么"
```

可选参数：`--part minor`（功能大改）/ `--part major`（大改版）/ `--no-push`（只提交）/ `--no-deploy`（只推送不部署）。

### 禁止事项（不做会出问题）

- **禁止 `pnpm build` 或 `npm run build`**：build 脚本第二步 `esbuild server/index.ts`，但本项目**没有 `server/` 目录**，必定失败。构建只能用 `./node_modules/.bin/vite build`，产物在 `dist/public`。
- **禁止手动改 `client/src/lib/version.ts`**：版本号唯一来源是这个文件，但由 `release.py` 自动递增（规则 MAJOR.MINOR.PATCH，默认 PATCH +1）。手写会打乱版本记录。
- **禁止向用户索要任何密钥**：腾讯云 SecretId/SecretKey 已固化在 `~/.workbuddy/diwu-pru-config.json`（权限 600），`deploy.py` 会自动读取。
- **不要重复走证书流程**：子域名已建过桶和 SSL，部署必须带 `--update-only`。

### 发布后必须核对

```bash
curl -s "https://tiantian.diwu-pru.vip/" | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1
ls dist/public/assets/ | grep '\.js$'
```

两处的 `index-xxxxx.js` hash **必须一致**，否则是 CDN 缓存未刷新或部署失败。

---

## 二、内容规范（改任何内容都必须遵守）

1. **繁体中文**。所有界面文案、游戏文案用繁体（如「認識」不是「认识」、「時間」不是「时间」）。这是硬性要求，混入简体会被要求返工。
   - 扫描简体的可靠方法：用「简繁不同形」的精准字符集匹配，宽字符集会把「用/看/出/站/色」等简繁同形字误报几百行。
2. **卡片封面图必须透明底**。首页卡片（`.game-icon`）有各自的主题色淡底，插画必须透明浮在上面。
   - **透明图绝对不能转 JPEG**（JPEG 无 alpha 通道，上线会变成白底方块）——用 **WebP**，alpha 完整保留。
   - **不要为了压缩而缩小尺寸**：保留图片原始分辨率（高分屏更清晰），体积靠编码格式控制即可（WebP `quality=82~85, method=6`）。
   - 压缩前先确认 `im.mode in ("RGBA","LA")` 且角像素 alpha < 255。原本就是实底的图（如照片、地图）才可以转 JPEG。
   - 避免把 MB 级未压缩 PNG 直接提交入库；转成 WebP 后体积通常能降到十分之一。
3. **中文发音是广东话（粤语）**。逻辑在 `client/src/lib/speech.ts`，优先级：严格粤语（`yue-HK` /「善怡」/ `Sinji`）→ `zh-HK` → 繁体国语备援。**注意粤语的 lang 是 `yue-HK`，不是 `zh-HK`**，按 `zh-TW/zh-Hant` 筛选会永远选不到粤语。改动时不要破坏这套优先级。
4. **儿童取向**：沙盒型玩法 > 测验型玩法；先猜后看、慢动作回放；避免失败态和速度压力；不出现需要大量识字的题目（用语音/图标代替）。
5. **设计语言**：米白纸张底（#f8f4e9）+ 深海军蓝文字（#18304c）+ 天天橙 `#FF6B3D` 行动色。CSS 写在 `client/src/index.css` 的自定义类里，不要堆砌 Tailwind 类名。

---

## 三、环境注意事项（WorkBuddy 沙箱）

Node/pnpm 会被文件钩子拦截（报 `CODEBUDDY_BROKER_DENY`）。若不使用 `release.py` 而手动跑命令，先 export：

```bash
export CODEBUDDY_BROKERED_FS_HOOK_ENABLED=0 CODEBUDDY_SAFE_DELETE_ENABLED=0 CODEBUDDY_SAFE_DELETE_SANDBOX=0
```

- 批量删除超过 50 项会被拦截 → 清空目录改用 `mv` 到 `~/.Trash`。
- 本地预览：`./node_modules/.bin/vite preview --port 4173 --host 127.0.0.1`，但**改完 CSS/代码必须先 `vite build` 再 preview**，否则测的是旧产物。
- 用 `(命令 &)` 启动的 preview 会中途退出导致 502（误判成破图），要用后台方式启动。

---

## 四、项目结构速查

| 路径 | 说明 |
|---|---|
| `client/src/pages/Home.tsx` | 首页（学习台），卡片网格 + 全屏舞台入口 |
| `client/src/games/*.tsx` | 各个小游戏（Sentence / Math / TimesTable / Clock / PeriodicTable / English / Landmark / Weather / Mtr / Festival / MatterLab / RampLab） |
| `client/src/components/GameStage.tsx` | 全屏舞台外壳（返回、标题、全屏、音效开关） |
| `client/src/lib/speech.ts` | 发音（粤语优先） |
| `client/src/lib/sound.ts` | Web Audio 合成音效（答对/答错） |
| `client/src/lib/version.ts` | 版本号（由脚本维护，勿手改） |
| `client/src/data/*.ts` | 各游戏数据（elements / landmarks / festivals / weather / mtrMap） |
| `client/public/images/` | 图片资源（cards = 卡片封面，其余按游戏分目录） |

Git 仓库：`https://github.com/tychowu/tiantian-study`，分支 `main`。

**push 前检查**：项目由 Manus 导出过，历史上有文件缺失导致被误判为「删除」（如 `server/index.ts`、`client/src/components/ui/accordion.tsx`）。`git status` 里出现意外的删除项时先确认，不要盲目提交。
