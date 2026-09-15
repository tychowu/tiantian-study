import { useEffect, useMemo, useState } from "react";
import { lookupWord } from "@/lib/glossary";
import { onVoicesReady, speak, stopSpeaking } from "@/lib/speech";
import { Volume2 } from "lucide-react";

type Token = { text: string; zh: string | null; punct: string };

const PUNCT = /^([^.,!?;:]*)([.,!?;:]*)$/;

export function parseBilingual(src: string): Token[] {
  return src
    .split(/\s+/)
    .filter(Boolean)
    .map((raw) => {
      const matched = raw.match(PUNCT);
      let body = matched ? matched[1] : raw;
      const punct = matched ? matched[2] : "";
      let zh: string | null = null;
      if (body.includes("|")) {
        const [word, meaning] = body.split("|");
        body = word;
        zh = meaning || null;
      } else {
        zh = lookupWord(body) ?? null;
      }
      return { text: body, zh, punct };
    });
}

/** 把 "Hydrogen|氫氣 is|是" 還原成乾淨的英文句子，用來朗讀。 */
export function plainEnglish(src: string): string {
  return src
    .split(/\s+/)
    .map((token) => token.replace(/\|.*$/, ""))
    .join(" ")
    .trim();
}

type Props = {
  text: string;
  size?: "md" | "lg";
};

/**
 * 英文句子：點任何一個單字，就會彈出它的繁中翻譯小紙條，同時把這個字唸出來。
 */
export default function BilingualText({ text, size = "md" }: Props) {
  const tokens = useMemo(() => parseBilingual(text), [text]);
  const [active, setActive] = useState<number | null>(null);
  const [voiceReady, setVoiceReady] = useState(false);

  useEffect(() => {
    setActive(null);
  }, [text]);

  // Safari 的語音清單是非同步載入的，先探一次。
  useEffect(() => onVoicesReady(setVoiceReady), []);

  useEffect(() => stopSpeaking, []);

  const handleWord = (index: number, word: string) => {
    setActive(active === index ? null : index);
    speak(word, "en");
  };

  return (
    <div className={`bili ${size === "lg" ? "is-lg" : ""}`}>
      <p className="bili-line">
        {voiceReady && (
          <button
            type="button"
            className="bili-speak"
            onClick={() => speak(plainEnglish(text), "en")}
            aria-label="把整句英文唸一遍"
          >
            <Volume2 size={15} />
          </button>
        )}
        {tokens.map((token, index) => (
          <span className="bili-wrap" key={`${token.text}-${index}`}>
            <button
              type="button"
              className={`bili-word ${active === index ? "is-active" : ""} ${token.zh ? "" : "is-plain"}`}
              onClick={() => handleWord(index, token.text)}
              aria-label={token.zh ? `${token.text}，翻譯：${token.zh}` : token.text}
            >
              {token.text}
              {token.punct}
            </button>
            {token.zh && active === index ? (
              <span className="bili-tip" role="tooltip">
                {token.zh}
              </span>
            ) : null}
          </span>
        ))}
      </p>
    </div>
  );
}
