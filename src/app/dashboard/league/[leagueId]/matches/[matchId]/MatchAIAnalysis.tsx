"use client";

import { useEffect, useRef, useState } from "react";
import { sendMessage } from "@/app/actions/chat-actions";
import { Loader2, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { saveAnalysis } from "@/app/actions/chat-actions";
import { useToast } from "@/hooks/use-toast";
import { Bookmark, BookmarkCheck } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  matchId: number;
  initialMessages: Message[];
  isActive: boolean;
  initialSaved: boolean;
};

const MAX_MESSAGES_PER_SESSION = 10;

const SUGGESTED_QUESTIONS = [
  "How did this match play out?",
  "Who were the key performers?",
  "Break down the statistics",
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-zinc-900 rounded-2xl rounded-tl-none w-fit">
      <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] md:max-w-[65%] px-4 py-3 rounded-2xl rounded-tr-none bg-zinc-800 border border-[#e8ff47] text-white text-sm font-body leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="md:max-w-[65%] px-4 py-3 rounded-2xl rounded-tl-none bg-zinc-900 text-white text-sm font-body leading-relaxed prose prose-invert prose-sm max-w-none">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default function MatchAIAnalysis({
  matchId,
  initialMessages,
  isActive,
  initialSaved,
}: Props) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(initialSaved);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messageCount = messages.length;
  const isLimitReached = messageCount >= MAX_MESSAGES_PER_SESSION;
  const canSend = input.trim().length > 0 && !isLoading && !isLimitReached;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isActive]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const handleSend = async (text?: string) => {
    const messageToSend = text ?? input.trim();
    if (!messageToSend || isLoading || isLimitReached) return;

    setMessages((prev) => [...prev, { role: "user", content: messageToSend }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsLoading(true);

    try {
      const response = await sendMessage(matchId, messageToSend);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await saveAnalysis(matchId);
      setIsSaved(true);
      toast({
        variant: "default",
        title: "Success! 🎉",
        description: "Analysis saved!",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error! 🎉",
        description: "Analysis could not be saved!",
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {messages.length > 0 && (
        <div className="flex justify-end mb-2">
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
              isSaved
                ? "text-[#e8ff47] bg-zinc-800 cursor-default"
                : "text-zinc-400 hover:text-[#e8ff47] hover:bg-zinc-800"
            }`}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
            {isSaved ? "Saved" : "Save Analysis"}
          </button>
        </div>
      )}
      {/* Message list */}
      <div className="min-h-100 max-h-[70vh] overflow-y-auto space-y-4 scrollbar-none px-2 pb-6">
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-100 gap-6 text-center px-4">
            <div>
              <p className="text-3xl font-bold font-display text-white mb-2 tracking-wide">
                AI MATCH ANALYSIS
              </p>
              <p className="text-sm text-zinc-500">
                Ask me anything about this match
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-sm">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-sm text-left px-4 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:border-[#e8ff47] hover:text-white transition-colors font-body"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message, idx) => (
          <MessageBubble key={idx} message={message} />
        ))}

        {/* Typing indicator */}
        {isLoading && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="mt-4 border-t border-zinc-800 pt-4 px-2 mb-6">
        {/* Message counter */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] uppercase tracking-widest text-zinc-600">
            {isLimitReached
              ? "Analysis limit reached"
              : `${messageCount}/${MAX_MESSAGES_PER_SESSION} messages used`}
          </span>
          {isLimitReached && (
            <span className="text-[10px] text-zinc-500">
              Visit another match to start a new analysis
            </span>
          )}
        </div>

        {/* Input row */}
        {!isLimitReached && (
          <div className="flex items-end gap-3 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 focus-within:border-[#e8ff47] transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about tactics, players, key moments..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 resize-none focus:outline-none font-body leading-relaxed"
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!canSend}
              className={`shrink-0 p-2 rounded-xl transition-all ${
                canSend
                  ? "bg-[#e8ff47] text-black hover:bg-yellow-300"
                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
