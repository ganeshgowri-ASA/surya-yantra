'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AIChat } from '@/components/AIChat';

export default function DiagnosticsPage() {
  const [provider, setProvider] = useState<'claude' | 'openai'>('claude');

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Diagnostics</h1>
          <p className="text-muted-foreground">
            Ask Claude / GPT-4o about IV-curve anomalies, degradation, or fault candidates.
          </p>
        </div>
        <div className="w-56 space-y-1">
          <Label className="text-xs">Provider</Label>
          <Select value={provider} onValueChange={(v) => setProvider(v as 'claude' | 'openai')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="claude">Claude Sonnet 4.6</SelectItem>
              <SelectItem value="openai">OpenAI GPT-4o-mini</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          <AIChat provider={provider} />
        </CardContent>
      </Card>
    </div>
  );
}
