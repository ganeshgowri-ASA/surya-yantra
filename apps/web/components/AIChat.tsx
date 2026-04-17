'use client';

import { useRef, useState } from 'react';
import { Send, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChat({
  systemContext,
  provider = 'claude',
}: {
  systemContext?: string;
  provider?: 'claude' | 'openai';
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setBusy(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, provider, systemContext }),
        signal: ctrl.signal,
      });

      if (!res.body) {
        const err = await res.text();
        setMessages((m) => [...m, { role: 'assistant', content: `Error: ${err}` }]);
        return;
      }

      setMessages((m) => [...m, { role: 'assistant', content: '' }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: 'assistant', content: buf };
          return copy;
        });
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        setMessages((m) => [
          ...m,
          { role: 'assistant', content: `Error: ${(e as Error).message}` },
        ]);
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="flex h-[600px] flex-col rounded-lg border bg-card">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            <div>
              <Sparkles className="mx-auto mb-2 h-8 w-8 text-primary" />
              Ask about module faults, degradation, or IV curve anomalies.
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              'flex gap-3',
              m.role === 'user' ? 'flex-row-reverse' : 'flex-row',
            )}
          >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              {m.role === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-primary" />}
            </div>
            <div
              className={cn(
                'max-w-[75%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm',
                m.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground',
              )}
            >
              {m.content || '…'}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t p-3">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the AI about this module’s IV curve…"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            className="resize-none"
          />
          <Button onClick={send} disabled={busy || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
