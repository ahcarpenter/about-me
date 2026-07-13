"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

type Message = { role: "me" | "bot"; text: string };

/**
 * Stubbed "chat with AI me" — canned responses only. Swap `reply()` for a
 * real model call (e.g. an API route on a server deployment, or a hosted
 * endpoint) when the AI version of Drew is ready.
 */
const CANNED: string[] = [
  "Good question. The honest answer: I'm a stub. The real AI-Drew is still in training — for now I only know how to say charming placeholder things.",
  "If I were the real Drew, I'd probably answer with a story, a strong opinion, and a link to something he wrote. Soon.",
  "I've noted that down for the actual AI version of me. In the meantime, the Philosophy and Story pages are the closest thing to my brain in text form.",
  "Ask me again after my weights arrive. Until then: yes, Drew really does think writing is thinking.",
  "That's beyond my canned repertoire — but the human me reads everything sent through LinkedIn or Substack, and he's friendlier than average.",
];

const OPENER = `Hey — I'm AI ${site.firstName} (well, a placeholder for him). One day I'll answer questions the way the real one would. Today I'm a stub with good manners. Try me anyway?`;

export default function ChatStub() {
  const [messages, setMessages] = useState<Message[]>([{ role: "bot", text: OPENER }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const cannedIndex = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    const text = input.trim();
    if (!text || typing) return;
    setMessages((m) => [...m, { role: "me", text }]);
    setInput("");
    setTyping(true);
    const reply = CANNED[cannedIndex.current % CANNED.length];
    cannedIndex.current += 1;
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: reply }]);
      setTyping(false);
    }, 900 + Math.random() * 700);
  }

  return (
    <div className="card flex h-[32rem] flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line bg-paper/50 px-5 py-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
        </span>
        <p className="font-mono text-xs tracking-wide text-muted">
          AI {site.firstName.toUpperCase()} · PROTOTYPE — NOT YET WIRED TO A MODEL
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role === "me" ? "msg-me" : "msg-bot"}`}>
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="msg msg-bot inline-flex items-center gap-1.5 py-3">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        )}
      </div>

      <form
        className="flex items-center gap-3 border-t border-line bg-surface px-4 py-3"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${site.firstName} anything…`}
          aria-label="Message"
          className="flex-1 rounded-full border border-line bg-cream px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-faint focus:border-accent"
        />
        <button type="submit" disabled={!input.trim() || typing} className="btn btn-primary py-2.5 disabled:cursor-not-allowed disabled:opacity-40">
          Send
        </button>
      </form>
    </div>
  );
}
