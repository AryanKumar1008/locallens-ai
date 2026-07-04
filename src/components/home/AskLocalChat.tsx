'use client';

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';
import { CloseIcon } from '@/components/icons';

// ─── Props ───────────────────────────────────────────────────────────────────
export interface AskLocalChatProps {
  /** The destination for the local guide context */
  readonly destination: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Generates a unique message ID */
function createMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

/** Suggested starter questions for the user */
const STARTER_QUESTIONS: readonly string[] = [
  "What's the best time to visit?",
  'Recommend a hidden local restaurant',
  'What should I avoid as a tourist?',
  'Tell me a local legend or story',
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export default function AskLocalChat({ destination }: AskLocalChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // ─── Auto-scroll to bottom on new messages ─────────────────────────────────
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // ─── Focus input when panel opens ──────────────────────────────────────────
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to allow animation to start
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ─── Close on Escape key ───────────────────────────────────────────────────
  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // ─── Send message handler ─────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: createMessageId(),
        role: 'user',
        text: text.trim(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInputValue('');
      setError(null);
      setIsLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination,
            messages: updatedMessages,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || 'Failed to get a response. Please try again.'
          );
        }

        const modelMessage: ChatMessage = {
          id: createMessageId(),
          role: 'model',
          text: data.reply,
        };

        setMessages((prev) => [...prev, modelMessage]);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, destination]
  );

  // ─── Form submit ──────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      sendMessage(inputValue);
    },
    [inputValue, sendMessage]
  );

  // ─── Enter to send, Shift+Enter for new line ─────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(inputValue);
      }
    },
    [inputValue, sendMessage]
  );

  // ─── Clear conversation ───────────────────────────────────────────────────
  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setInputValue('');
  }, []);

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* ─── Floating Action Button ───────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-40',
          'w-14 h-14 rounded-full',
          'bg-accent text-white shadow-xl shadow-accent/30',
          'flex items-center justify-center',
          'hover:bg-accent-hover hover:shadow-2xl hover:shadow-accent/40',
          'hover:scale-105 active:scale-95',
          'transition-all duration-300 ease-out',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          'cursor-pointer',
          isOpen && 'opacity-0 pointer-events-none scale-75'
        )}
        aria-label="Ask a Local guide about this destination"
        title="Ask a Local"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 10h.01" />
          <path d="M12 10h.01" />
          <path d="M16 10h.01" />
        </svg>

        {/* Pulse ring animation */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-accent/30 animate-ping pointer-events-none" />
        )}
      </button>

      {/* ─── Backdrop Overlay ─────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ─── Chat Panel ───────────────────────────────────────────────────── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Ask a Local guide chat"
        className={cn(
          'fixed z-50',
          // Mobile: full-width bottom sheet
          'bottom-0 left-0 right-0',
          // Desktop: right-side panel
          'sm:bottom-4 sm:right-4 sm:left-auto sm:max-w-[420px] sm:w-full',
          // Panel styling
          'rounded-t-2xl sm:rounded-2xl overflow-hidden',
          'flex flex-col',
          'max-h-[85vh] sm:max-h-[680px]',
          // Glass background
          'bg-background/95 backdrop-blur-xl',
          'border border-border/50',
          'shadow-2xl shadow-black/20',
          // Slide animation
          'transition-all duration-300 ease-out',
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full sm:translate-y-8 opacity-0 pointer-events-none'
        )}
      >
        {/* ─── Chat Header ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-surface/30 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
              <span className="text-lg" role="img" aria-label="Guide">
                🗣️
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-foreground truncate">
                Ask a Local
              </h3>
              <p className="text-[11px] text-muted truncate">
                Your guide to {destination}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Clear chat button */}
            {hasMessages && (
              <button
                onClick={clearChat}
                className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
              </button>
            )}

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─── Messages Area ────────────────────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-0"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {/* Empty state — show starter questions */}
          {!hasMessages && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-5 py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <span className="text-3xl" role="img" aria-label="Waving hand">
                  👋
                </span>
              </div>
              <div className="text-center">
                <h4 className="text-sm font-bold text-foreground mb-1">
                  Hello, traveler!
                </h4>
                <p className="text-xs text-muted max-w-[260px] leading-relaxed">
                  I&apos;m your local guide for{' '}
                  <span className="font-semibold text-accent">
                    {destination}
                  </span>
                  . Ask me anything about culture, food, hidden spots, or
                  practical tips!
                </p>
              </div>

              {/* Starter question chips */}
              <div className="flex flex-wrap justify-center gap-2 px-2 max-w-[340px]">
                {STARTER_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => sendMessage(question)}
                    className={cn(
                      'px-3 py-2 rounded-xl text-xs font-medium',
                      'bg-surface border border-border/60 text-foreground/80',
                      'hover:border-accent/40 hover:text-accent hover:bg-accent/5',
                      'transition-all duration-200 cursor-pointer',
                      'text-left leading-snug'
                    )}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat messages */}
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}

          {/* Typing indicator */}
          {isLoading && <TypingIndicator />}

          {/* Error message */}
          {error && (
            <div className="mx-auto max-w-[90%] p-3 rounded-xl bg-error/10 border border-error/20 text-xs text-error text-center animate-fade-in">
              <p>{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  // Retry the last user message
                  const lastUserMsg = [...messages]
                    .reverse()
                    .find((m) => m.role === 'user');
                  if (lastUserMsg) {
                    // Remove the last user message and resend
                    setMessages((prev) => prev.slice(0, -1));
                    sendMessage(lastUserMsg.text);
                  }
                }}
                className="mt-2 text-xs font-semibold text-error underline underline-offset-2 hover:text-error/80 transition-colors cursor-pointer"
              >
                Try again
              </button>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        {/* ─── Input Area ───────────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-border/50 bg-surface/20 px-4 py-3">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about the local culture…"
                rows={1}
                className={cn(
                  'w-full rounded-xl px-4 py-2.5 pr-3 text-sm',
                  'bg-surface border border-border text-foreground',
                  'placeholder:text-muted/50',
                  'transition-all duration-200 ease-out',
                  'hover:border-accent/30',
                  'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60',
                  'resize-none overflow-hidden',
                  'max-h-[120px]'
                )}
                style={{
                  height: 'auto',
                  minHeight: '42px',
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
                disabled={isLoading}
                aria-label="Type your question"
              />
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                'w-10 h-10 rounded-xl shrink-0',
                'flex items-center justify-center',
                'transition-all duration-200 cursor-pointer',
                inputValue.trim() && !isLoading
                  ? 'bg-accent text-white hover:bg-accent-hover shadow-md shadow-accent/20'
                  : 'bg-surface text-muted/40 cursor-not-allowed'
              )}
              aria-label="Send message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>

          <p className="text-[10px] text-muted/50 text-center mt-2">
            Powered by Gemini AI · Responses may not be fully accurate
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Chat Bubble Sub-Component ───────────────────────────────────────────────

interface ChatBubbleProps {
  readonly message: ChatMessage;
}

const ChatBubble = memo(function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-2 max-w-[88%] animate-fade-in',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs',
          isUser
            ? 'bg-accent/20 text-accent'
            : 'bg-surface border border-border/60'
        )}
        aria-hidden="true"
      >
        {isUser ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3.5 h-3.5"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        ) : (
          <span role="img" aria-label="Local guide">
            🗺️
          </span>
        )}
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-accent text-white rounded-tr-md'
            : 'bg-surface border border-border/50 text-foreground/90 rounded-tl-md'
        )}
      >
        {/* Render with line breaks preserved */}
        {message.text.split('\n').map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {line}
          </span>
        ))}
      </div>
    </div>
  );
});

ChatBubble.displayName = 'ChatBubble';

// ─── Typing Indicator Sub-Component ──────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-2 max-w-[88%] mr-auto animate-fade-in">
      <div
        className="w-7 h-7 rounded-full bg-surface border border-border/60 flex items-center justify-center shrink-0 mt-0.5 text-xs"
        aria-hidden="true"
      >
        <span role="img" aria-label="Local guide thinking">
          🗺️
        </span>
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-surface border border-border/50 flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full bg-muted/60 animate-bounce"
          style={{ animationDelay: '0ms', animationDuration: '1.2s' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-muted/60 animate-bounce"
          style={{ animationDelay: '200ms', animationDuration: '1.2s' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-muted/60 animate-bounce"
          style={{ animationDelay: '400ms', animationDuration: '1.2s' }}
        />
        <span className="sr-only">Local guide is typing...</span>
      </div>
    </div>
  );
}
