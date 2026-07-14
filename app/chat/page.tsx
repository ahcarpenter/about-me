import type { Metadata } from "next";
import ChatStub from "@/components/ChatStub";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chat",
  description: `Chat with an AI version of ${site.shortName} (prototype).`,
};

export default function ChatPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pb-8 pt-14 sm:pt-20">
      <p className="kicker">Chat</p>
      <h1 className="display mt-3 text-4xl sm:text-6xl">
        Talk to <em>AI me</em>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-soft">
        Eventually this will be a model trained on my writing, my philosophy,
        and an alarming number of my opinions. Right now it’s a polite stub —
        but the seat is warm.
      </p>

      <div className="mt-10">
        <ChatStub />
      </div>

      <p className="mt-4 font-mono text-xs leading-relaxed text-muted">
        Prefer the human? Find him on{" "}
        <a
          href={site.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-line underline-offset-4 hover:text-accent"
        >
          LinkedIn ↗
        </a>{" "}
        or reply to any post on{" "}
        <a
          href={site.substackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-line underline-offset-4 hover:text-accent"
        >
          Substack ↗
        </a>
        .
      </p>
    </div>
  );
}
