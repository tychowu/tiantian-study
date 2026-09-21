import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Archive, GripVertical, Undo2 } from "lucide-react";

type Card = { id: string; title: string; subtitle: string; img?: string; icon: string; accent: string; stars: string; comingSoon?: boolean; testOnly?: boolean };
const ARCHIVE_KEY = "tiantian-game-archive-v1";
const ORDER_KEY = "tiantian-game-order-v1";
function readArchive(): string[] {
  try { const value = JSON.parse(localStorage.getItem(ARCHIVE_KEY) ?? "[]"); return Array.isArray(value) ? value.filter(v => typeof v === "string") : []; } catch { return []; }
}
export default function GameShelf({ initialGames, testUnlocked, onOpen }: { initialGames: Card[]; testUnlocked: boolean; onOpen: (id: string) => void }) {
  const [games, setGames] = useState(initialGames);
  const [archived, setArchived] = useState(readArchive);
  const [showArchive, setShowArchive] = useState(false);
  const [notice, setNotice] = useState("");
  const [overArchive, setOverArchive] = useState(false);
  const [flight, setFlight] = useState<{ game: Card; x: number; y: number; width: number; height: number; targetX: number; targetY: number } | null>(null);
  const reducedMotion = useReducedMotion();
  const archiveButton = useRef<HTMLButtonElement>(null);
  const floatingArchive = useRef<HTMLDivElement>(null);
  const archivePanel = useRef<HTMLElement>(null);
  const [ghost, setGhost] = useState<{ game: Card; x: number; y: number; width: number; height: number } | null>(null);
  const suppressClick = useRef(false);
  const cleanup = useRef<() => void>(() => {});
  const grid = useRef<HTMLDivElement>(null);
  const visible = games.filter(g => !archived.includes(g.id));
  const stored = games.filter(g => archived.includes(g.id));
  useEffect(() => () => cleanup.current(), []);
  useEffect(() => {
    try { localStorage.setItem(ORDER_KEY, JSON.stringify(games.map(g => g.id))); localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archived)); }
    catch { setNotice("這個瀏覽器無法儲存設定；本次排列仍可使用。"); }
  }, [games, archived]);

  const moveTo = (id: string, index: number) => {
    setGames(current => {
      const shown = current.filter(g => !archived.includes(g.id));
      const from = shown.findIndex(g => g.id === id);
      if (from < 0 || from === index) return current;
      const [card] = shown.splice(from, 1); shown.splice(index, 0, card);
      let cursor = 0;
      return current.map(g => archived.includes(g.id) ? g : shown[cursor++]);
    });
  };
  const start = (event: ReactPointerEvent<HTMLDivElement>, game: Card) => {
    if (event.button !== 0 || flight) return;
    // Touch users drag the handle; the rest of the card remains available for page scrolling.
    if (event.pointerType !== "mouse" && !(event.target as HTMLElement).closest(".game-drag-handle")) return;
    cleanup.current();
    const node = event.currentTarget;
    const pointerId = event.pointerId;
    const rect = node.getBoundingClientRect();
    const origin = { x: event.clientX, y: event.clientY };
    const offset = { x: origin.x - rect.left, y: origin.y - rect.top };
    const slots = Array.from(grid.current!.children).map(el => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 + window.scrollX, y: r.top + r.height / 2 + window.scrollY };
    });
    const original = games;
    let dragging = false, lastIndex = visible.findIndex(g => g.id === game.id), frame = 0;
    let point = { ...origin };
    const isOverArchive = () => [floatingArchive.current, archiveButton.current, archivePanel.current].some(el => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return point.x >= r.left && point.x <= r.right && point.y >= r.top && point.y <= r.bottom;
    });
    const update = () => {
      setGhost({ game, x: point.x - offset.x, y: point.y - offset.y, width: rect.width, height: rect.height });
      const over = isOverArchive();
      setOverArchive(over);
      if (over) return;
      const bounds = grid.current!.getBoundingClientRect();
      if (point.y < bounds.top || point.y > bounds.bottom || point.x < bounds.left || point.x > bounds.right) return;
      let closest = 0, distance = Infinity;
      slots.forEach((slot, i) => {
        const d = Math.hypot(point.x + window.scrollX - slot.x, point.y + window.scrollY - slot.y);
        if (d < distance) { distance = d; closest = i; }
      });
      if (closest !== lastIndex) { lastIndex = closest; moveTo(game.id, closest); }
    };
    const autoScroll = () => {
      if (dragging) {
        const delta = isOverArchive() ? 0 : point.y < 85 ? -12 : point.y > window.innerHeight - 85 ? 12 : 0;
        if (delta) { window.scrollBy(0, delta); update(); }
      }
      frame = requestAnimationFrame(autoScroll);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      point = { x: e.clientX, y: e.clientY };
      if (!dragging && Math.hypot(point.x - origin.x, point.y - origin.y) < 7) return;
      e.preventDefault();
      if (!dragging) node.setPointerCapture(pointerId);
      dragging = true; suppressClick.current = true; update();
    };
    const dispose = () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", finish); window.removeEventListener("pointercancel", cancel); window.removeEventListener("keydown", key);
      if (node.hasPointerCapture(pointerId)) node.releasePointerCapture(pointerId);
    };
    const end = (cancelled: boolean) => {
      const collect = dragging && !cancelled && isOverArchive();
      dispose(); setGhost(null); setOverArchive(false);
      if (collect) {
        const target = (floatingArchive.current ?? archiveButton.current)!.getBoundingClientRect();
        setGames(original);
        setFlight({ game, x: point.x - offset.x, y: point.y - offset.y, width: rect.width, height: rect.height, targetX: target.left + target.width / 2, targetY: target.top + target.height / 2 });
        archive(game);
      } else if (dragging) { if (cancelled) setGames(original); setNotice(cancelled ? "已取消移動。" : `已調整「${game.title}」的位置。`); }
      window.setTimeout(() => { suppressClick.current = false; }, 0);
      cleanup.current = () => {};
    };
    const finish = (e: PointerEvent) => { if (e.pointerId === pointerId) { point = { x: e.clientX, y: e.clientY }; end(false); } };
    const cancel = (e: PointerEvent) => { if (e.pointerId === pointerId) end(true); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") end(true); };
    window.addEventListener("pointermove", move, { passive: false }); window.addEventListener("pointerup", finish); window.addEventListener("pointercancel", cancel); window.addEventListener("keydown", key);
    frame = requestAnimationFrame(autoScroll); cleanup.current = dispose;
  };
  const archive = (game: Card) => { setArchived(ids => ids.includes(game.id) ? ids : [...ids, game.id]); setNotice(`「${game.title}」已放進遊戲收納盒，可隨時放回。`); };
  return <>
    <div className={`shelf-toolbar ${ghost ? "is-sorting" : ""}`}><p>{ghost ? "移動卡片來排列，拖進收納盒就能收起。" : "拖動卡片調整順序，拖進收納盒即可收起；平板請按住右上角六點。"}</p><button ref={archiveButton} className={`shelf-storage-toggle ${overArchive ? "is-drop-ready" : ""}`} onClick={() => { if (!suppressClick.current) setShowArchive(v => !v); }} aria-expanded={showArchive}><motion.span key={stored.length} className="shelf-box-icon" animate={reducedMotion ? {} : { scale: [1, 1.25, 1], rotate: [0, -9, 9, 0] }} transition={{ duration: .55 }}><Archive size={18}/></motion.span> {overArchive ? "放開，收進盒子！" : `遊戲收納盒（${stored.length}）`}</button></div>
    <p className="shelf-notice" role="status">{notice}</p>
    {showArchive && <section ref={archivePanel} className={`shelf-storage ${overArchive ? "is-drop-ready" : ""}`} aria-label="遊戲收納盒"><h3>遊戲收納盒</h3><p>暫時收起，不是刪除。想玩的時候，再放回學習台。</p>{stored.length === 0 ? <p>收納盒還是空的。把卡片拖到這裡，放開就能收好。</p> : <div className="shelf-stored-list">{stored.map(game => <div key={game.id}><img src={game.img} alt="" draggable={false}/><b>{game.title}</b><button onClick={() => { setArchived(ids => ids.filter(id => id !== game.id)); setNotice(`「${game.title}」已放回學習台。`); }}><Undo2 size={16}/> 放回學習台</button></div>)}</div>}</section>}
    <div className="game-grid" ref={grid}>{visible.map((game, index) => {
      const testLocked = Boolean(game.testOnly && !testUnlocked);
      const locked = Boolean(game.comingSoon || testLocked);
      return <motion.div layout="position" initial={false} transition={{ layout: { type: "spring", stiffness: 360, damping: 32 } }} key={game.id} data-game-id={game.id} className={`game-card shelf-card ${locked ? "is-coming" : ""} ${ghost?.game.id === game.id ? "is-dragging" : ""}`} style={{ "--accent": game.accent } as CSSProperties} onPointerDown={e => start(e, game)} onDragStart={e => e.preventDefault()}>
        <div className="shelf-card-tools"><button className="game-drag-handle" aria-label={`拖曳排列${game.title}`} title="拖曳排列；方向鍵移動，Delete 鍵收納" onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === "Delete") { e.preventDefault(); archive(game); archiveButton.current?.focus(); } else if (["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(e.key)) { e.preventDefault(); moveTo(game.id, Math.max(0, Math.min(visible.length - 1, index + (["ArrowLeft", "ArrowUp"].includes(e.key) ? -1 : 1)))); setNotice(`已調整「${game.title}」的位置。`); } }}><GripVertical size={12}/></button></div>
        <button className="game-card-open" aria-disabled={locked} onClick={() => { if (!suppressClick.current && !game.comingSoon) onOpen(game.id); }}>
          <span className="game-icon" aria-hidden="true">{game.img ? <img src={game.img} alt="" loading="lazy" draggable={false}/> : game.icon}</span><b className="game-title">{game.title}</b><span className="game-sub">{game.subtitle}</span><span className="game-foot"><span className="game-stars">{game.stars}</span>{testLocked ? <span className="game-coming-sticker">暫未開放 · 輸入密碼</span> : game.testOnly ? <span className="game-test-sticker">測試模式 · 可開啟</span> : game.comingSoon ? <span className="game-coming-sticker">打磨中 · 暫未開放</span> : <span className="game-go">開始 →</span>}</span>
        </button>
      </motion.div>;
    })}</div>
    {visible.length === 0 && <div className="shelf-empty">遊戲都在收納盒裡。打開「遊戲收納盒」，把想玩的放回來吧！</div>}
    {(ghost || flight) && <div ref={floatingArchive} className={`shelf-floating-drop ${overArchive ? "is-drop-ready" : ""}`}><motion.span animate={flight && !reducedMotion ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : { scale: 1, rotate: 0 }} transition={{ duration: .65 }}><Archive size={26}/></motion.span><b>{flight ? "收好了！" : overArchive ? "放開，收進盒子！" : "遊戲收納盒"}</b><small>{flight ? "想玩時隨時放回" : "把卡片拖到這裡"}</small></div>}
    {ghost && <div className="game-drag-preview" aria-hidden="true" style={{ left: ghost.x, top: ghost.y, width: ghost.width, height: ghost.height, "--accent": ghost.game.accent } as CSSProperties}><span className="game-icon"><img src={ghost.game.img} alt=""/></span><b>{ghost.game.title}</b><span>{overArchive ? "放開就收進盒子" : "放開就排在這裡"}</span></div>}
    {flight && <motion.div className="game-drag-preview shelf-archive-flight" aria-hidden="true" style={{ left: flight.x, top: flight.y, width: flight.width, height: flight.height, "--accent": flight.game.accent } as CSSProperties} initial={{ x: 0, y: 0, scale: 1, opacity: 1 }} animate={{ x: flight.targetX - flight.x - flight.width / 2, y: flight.targetY - flight.y - flight.height / 2, scale: .04, opacity: 0, rotate: 12 }} transition={{ duration: reducedMotion ? .01 : .65, ease: [0.32, 0, 0.2, 1] }} onAnimationComplete={() => setFlight(null)}><span className="game-icon"><img src={flight.game.img} alt=""/></span><b>{flight.game.title}</b></motion.div>}
  </>;
}
