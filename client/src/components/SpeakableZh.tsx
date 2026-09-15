import { useEffect, useMemo, useState } from "react";
import { isSpeakableChar, onVoicesReady, speak } from "@/lib/speech";
import { Volume2 } from "lucide-react";

type Props = {
  text: string;
  /** 大字的中文（卡片主標題用） */
  size?: "md" | "lg";
};

/**
 * 中文句子：每一個字都可以點一下聽發音，也可以一次聽整句。
 */
export default function SpeakableZh({ text, size = "md" }: Props) {
  const chars = useMemo(() => Array.from(text), [text]);
  const [voiceReady, setVoiceReady] = useState(false);

  useEffect(() => onVoicesReady(setVoiceReady), []);

  return (
    <div className={`zh-speak ${size === "lg" ? "is-lg" : ""}`}>
      <p className="zh-line">
        {voiceReady && (
          <button
            type="button"
            className="zh-speak-all"
            onClick={() => speak(text, "zh")}
            aria-label="把整句中文唸一遍"
          >
            <Volume2 size={15} />
          </button>
        )}
        {chars.map((char, index) =>
          isSpeakableChar(char) ? (
            <button
              type="button"
              className="zh-char"
              key={`${char}-${index}`}
              onClick={() => speak(char, "zh")}
              aria-label={`聆聽 ${char}`}
            >
              {char}
            </button>
          ) : (
            <span className="zh-punct" key={`p-${index}`}>
              {char}
            </span>
          ),
        )}
      </p>
    </div>
  );
}
