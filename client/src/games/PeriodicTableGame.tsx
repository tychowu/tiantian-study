import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Search, Sparkles, Volume2, X } from "lucide-react";
import { useState, type CSSProperties, type MouseEvent } from "react";
import BilingualText from "@/components/BilingualText";
import SpeakableZh from "@/components/SpeakableZh";
import SafeVideo from "@/components/SafeVideo";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  ELEMENTS,
  ELEMENT_BY_NUMBER,
  type CategoryKey,
  type ChemElement,
} from "@/data/elements";
import { elementFactsEn } from "@/data/elementFacts";
import { elementImage, elementPic, elementWow, isRadioactive } from "@/data/elementExtra";
import { elementVideo } from "@/data/elementVideos";
import { speak } from "@/lib/speech";

const cellVars = (color: string, tint: string) =>
  ({ "--cell": color, "--cell-tint": tint }) as CSSProperties;

/** 主表上的鑭系／錒系色帶與底部展開行的大標籤。 */
const SERIES_HINTS: { row: number; label: string; cat: CategoryKey }[] = [
  { row: 6, label: "鑭系", cat: "lanthanide" },
  { row: 7, label: "錒系", cat: "actinide" },
];
const SERIES_TAGS: { row: number; label: string; range: string; cat: CategoryKey }[] = [
  { row: 9, label: "鑭系", range: "57–71", cat: "lanthanide" },
  { row: 10, label: "錒系", range: "89–103", cat: "actinide" },
];

function ElementCell({
  item,
  dimmed,
  onOpen,
}: {
  item: ChemElement;
  dimmed: boolean;
  onOpen: () => void;
}) {
  const meta = CATEGORY_META[item.cat];
  const radio = isRadioactive(item.n);
  return (
    <button
      type="button"
      className={`pt-cell ${dimmed ? "is-dimmed" : ""} ${radio ? "is-radio" : ""}`}
      style={{ gridColumn: item.col, gridRow: item.row, ...cellVars(meta.color, meta.tint) }}
      onClick={onOpen}
      aria-label={`第 ${item.n} 號 ${item.zh} ${item.en}${radio ? "，有放射性" : ""}`}
    >
      <span className="pt-num">{item.n}</span>
      {radio && (
        <img
          className="pt-radio-bg"
          src="/images/radioactive.png"
          alt=""
          aria-hidden="true"
          title="有放射性"
        />
      )}
      <span className="pt-sym">{item.sym}</span>
      <span className="pt-zh">{item.zh}</span>
    </button>
  );
}

/** 元素插圖：優先顯示生成的 PNG，還沒生成時自動退回 emoji。 */
function ElementPhoto({ item, tint }: { item: ChemElement; tint: string }) {
  const [failed, setFailed] = useState(false);
  const pic = elementPic(item.n);

  if (failed || !pic) {
    return (
      <div className="pt-photo is-fallback" style={{ background: tint }}>
        <span aria-hidden="true">{item.icon}</span>
      </div>
    );
  }

  return (
    <div className="pt-photo">
      <img
        src={elementImage(item.n, item.sym)}
        alt={pic}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function ElementDetail({
  item,
  onClose,
  onJump,
}: {
  item: ChemElement;
  onClose: () => void;
  onJump: (n: number) => void;
}) {
  const meta = CATEGORY_META[item.cat];
  const wow = elementWow(item.n);
  const radio = isRadioactive(item.n);
  const video = elementVideo(item.n);
  // 中文小知識兩句；英文小知識兩句，中英文各取前兩句不重複。
  const zhFacts = [item.factZh, wow?.zh].filter((line): line is string => Boolean(line));
  const enFacts = elementFactsEn(item.n).slice(0, 2);

  // 卡片裡面的點擊不要冒泡到背景，否則一點文字就把卡片關掉了。
  const stop = (event: MouseEvent) => event.stopPropagation();

  return (
    <motion.div
      className="pt-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.zh} ${item.en} 小知識`}
    >
      <div className="pt-detail-scroll" onClick={stop}>
        <div className="pt-detail-card" style={cellVars(meta.color, meta.tint)}>
          <span className="paper-tape tape-left" aria-hidden="true" />
          <span className="paper-tape tape-right" aria-hidden="true" />

          <button type="button" className="pt-close" onClick={onClose} aria-label="回到週期表">
            <X size={22} />
          </button>

          <div className="pt-hero">
            <div className="pt-badge">
              <span className="pt-badge-num">{item.n}</span>
              <span className="pt-badge-sym">{item.sym}</span>
              <span className="pt-badge-mass">{item.mass}</span>
            </div>

            <ElementPhoto key={item.n} item={item} tint={meta.tint} />

            <div className="pt-names">
              <div className="pt-name-row">
                <h3 className="pt-name-zh">{item.zh}</h3>
                <button
                  type="button"
                  className="pt-speak"
                  onClick={() => speak(item.zh, "zh")}
                  aria-label={`聆聽 ${item.zh}`}
                >
                  <Volume2 size={14} />
                </button>
              </div>
              <p className="pt-en-name">
                {item.en}
                <button
                  type="button"
                  className="pt-speak"
                  onClick={() => speak(item.en, "en")}
                  aria-label={`聆聽 ${item.en}`}
                >
                  <Volume2 size={14} />
                </button>
              </p>
              <span className="pt-cat" style={{ background: meta.tint, color: meta.color }}>
                {meta.zh} · {meta.en}
              </span>
              {radio && (
                <span className="pt-radio-tag">
                  <img src="/images/radioactive.png" alt="" aria-hidden="true" /> 有放射性
                </span>
              )}
            </div>
          </div>

          <section className="pt-section">
            <span className="pt-label">
              <Sparkles size={16} /> 小知識 · Fun Fact
            </span>
            <div className="pt-fact-group">
              {zhFacts.map((line) => (
                <div className="pt-fact-zh" key={line}>
                  <SpeakableZh text={line} size="lg" />
                </div>
              ))}
            </div>
            <div className="pt-fact-group">
              {enFacts.map((line) => (
                <BilingualText key={line} text={line} size="lg" />
              ))}
            </div>
          </section>

          {video && (
            <section className="pt-section">
              <span className="pt-label">影片 · Video</span>
              <SafeVideo videoId={video.id} title={video.title} />
              <p className="pt-video-title">{video.title}</p>
            </section>
          )}

          <div className="pt-nav">
            <button type="button" onClick={() => onJump(item.n - 1)} disabled={item.n === 1}>
              <ChevronLeft size={20} /> 前一個
            </button>
            <button type="button" onClick={() => onJump(item.n + 1)} disabled={item.n === 118}>
              下一個 <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PeriodicTableGame() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);
  const [radioOnly, setRadioOnly] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [opened, setOpened] = useState<number | null>(null);

  const filtered = new Set(
    ELEMENTS.filter((item) => {
      const byCat = !activeCategory || item.cat === activeCategory;
      const byRadio = !radioOnly || isRadioactive(item.n);
      const key = keyword.trim().toLowerCase();
      const byKey =
        !key ||
        item.sym.toLowerCase().includes(key) ||
        item.en.toLowerCase().includes(key) ||
        item.zh.includes(keyword.trim()) ||
        String(item.n) === key;
      return byCat && byRadio && byKey;
    }).map((item) => item.n),
  );

  const openedElement = opened !== null ? ELEMENT_BY_NUMBER.get(opened) : undefined;

  return (
    <div className="game-body">
      <div className="pt-toolbar">
        <label className="pt-search">
          <Search size={18} />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="找元素：輸入 6、C、碳 或 Carbon"
            aria-label="搜尋元素"
          />
          {keyword && (
            <button type="button" onClick={() => setKeyword("")} aria-label="清除搜尋">
              <X size={16} />
            </button>
          )}
        </label>
      </div>

      <div className="pt-legend">
        <button
          type="button"
          className={`pt-chip ${activeCategory === null && !radioOnly ? "is-on" : ""}`}
          onClick={() => {
            setActiveCategory(null);
            setRadioOnly(false);
          }}
        >
          全部
        </button>
        <button
          type="button"
          className={`pt-chip pt-chip-radio ${radioOnly ? "is-on" : ""}`}
          onClick={() => setRadioOnly(!radioOnly)}
          title="只看有放射性的元素"
        >
          <img src="/images/radioactive.png" alt="" aria-hidden="true" /> 放射性
        </button>        {CATEGORY_ORDER.map((key) => {
          const meta = CATEGORY_META[key];
          return (
            <button
              key={key}
              type="button"
              className={`pt-chip ${activeCategory === key ? "is-on" : ""}`}
              style={cellVars(meta.color, meta.tint)}
              onClick={() => setActiveCategory(activeCategory === key ? null : key)}
            >
              <i style={{ background: meta.color }} /> {meta.zh}
            </button>
          );
        })}
      </div>

      <p className="pt-tip">
        點一格，就會飛到它的小知識頁面；中文每個字、英文每個字都可以點一下聽發音，點卡片外面就關起來。
      </p>

      <div className="ptable-wrap">
        <div className="ptable">
          {ELEMENTS.map((item) => (
            <ElementCell
              key={item.n}
              item={item}
              dimmed={!filtered.has(item.n)}
              onOpen={() => setOpened(item.n)}
            />
          ))}
          {SERIES_HINTS.map((hint) => {
            const seriesMeta = CATEGORY_META[hint.cat];
            return (
              <span
                key={hint.row}
                className="pt-series-hint"
                style={{ gridColumn: 3, gridRow: hint.row, ...cellVars(seriesMeta.color, seriesMeta.tint) }}
              >
                {hint.label}
              </span>
            );
          })}
          {SERIES_TAGS.map((tag) => {
            const seriesMeta = CATEGORY_META[tag.cat];
            return (
              <span
                key={tag.row}
                className="pt-series-tag"
                style={{ gridColumn: "1 / 3", gridRow: tag.row, color: seriesMeta.color }}
                aria-hidden="true"
              >
                <b>{tag.label}</b>
                <i>{tag.range}</i>
              </span>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {openedElement && (
          <ElementDetail
            key={openedElement.n}
            item={openedElement}
            onClose={() => setOpened(null)}
            onJump={(n) => {
              if (n >= 1 && n <= 118) setOpened(n);
            }}
          />
        )}
      </AnimatePresence>

      <p className="pt-foot">
        <ArrowLeft size={15} /> 看完了就回到學習台，換下一個星球玩玩看。
      </p>
    </div>
  );
}
