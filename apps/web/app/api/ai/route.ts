import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are the AI diagnostic engineer for Surya Yantra — a PV (solar photovoltaic) module testing lab in Jamnagar, India.

Your expertise covers:
- IEC 60891:2021 corrections (P1–P4) for IV curve → STC
- IEC 60904-7 spectral mismatch (SMMF) and IEC 61853-2 IAM (Martin-Ruiz)
- Module technologies: HJT, HPBC, IBC, TOPCon, Perovskite, First Solar CdTe
- Fault diagnosis from IV-curve features: hot-spots, PID, LID, cell cracks, bypass diode failure, shading, soiling, series-resistance growth, shunt-resistance collapse

When given a module IV curve or measurement data, respond concisely with:
1. A one-line verdict (healthy, degraded, faulted).
2. Root-cause candidates ranked by likelihood.
3. Recommended next test (EL imaging, thermal IR, insulation test, repeat IV).
Keep responses under 200 words unless the user asks for more detail.`;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const provider = (body.provider ?? 'claude') as 'claude' | 'openai';
  const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : [];
  const systemContext: string = body.systemContext ?? '';

  const systemPrompt = systemContext ? `${SYSTEM_PROMPT}\n\nContext:\n${systemContext}` : SYSTEM_PROMPT;

  if (provider === 'claude') {
    if (!process.env.ANTHROPIC_API_KEY) {
      return new NextResponse('ANTHROPIC_API_KEY not set', { status: 500 });
    }
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const encoder = new TextEncoder();
    const out = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });
    return new NextResponse(out, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  // OpenAI fallback
  if (!process.env.OPENAI_API_KEY) {
    return new NextResponse('OPENAI_API_KEY not set', { status: 500 });
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  });

  const encoder = new TextEncoder();
  const out = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) controller.enqueue(encoder.encode(delta));
      }
      controller.close();
    },
  });
  return new NextResponse(out, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
