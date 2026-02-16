'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

interface SiteContentFormProps {
  content: Record<string, string>;
}

const FIELDS = [
  { key: 'site_name', label: '사이트 이름' },
  { key: 'intro_name', label: '이름' },
  { key: 'intro_job', label: '직업' },
  { key: 'intro_bio', label: '소개글', multiline: true },
  { key: 'contact_email', label: '이메일' },
];

export default function SiteContentForm({ content }: SiteContentFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(content);
  const [saving, setSaving] = useState(false);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any;

    const updates = FIELDS.map(({ key }) =>
      supabase
        .from('site_content')
        .upsert({ key, value: values[key] || '' }, { onConflict: 'key' }),
    );

    const results = await Promise.all(updates);
    const error = results.find((r: { error: unknown }) => r.error)?.error;

    setSaving(false);

    if (error) {
      alert(`저장 실패: ${error.message}`);
      return;
    }

    router.refresh();
    alert('저장되었습니다.');
  };

  const inputClass =
    'w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {FIELDS.map(({ key, label, multiline }) => (
        <div key={key}>
          <label className="mb-1 block text-sm font-medium">{label}</label>
          {multiline ? (
            <textarea
              value={values[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              rows={4}
              className={inputClass}
            />
          ) : (
            <input
              type="text"
              value={values[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              className={inputClass}
            />
          )}
        </div>
      ))}
      <Button type="submit" disabled={saving}>
        {saving ? '저장 중...' : '저장'}
      </Button>
    </form>
  );
}
