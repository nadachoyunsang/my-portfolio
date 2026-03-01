'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { createClient } from '@/lib/supabase/client';

interface SiteContentFormProps {
  content: Record<string, string>;
}

const FIELDS: {
  key: string;
  label: string;
  multiline?: boolean;
  options?: { value: string; label: string }[];
}[] = [
  { key: 'site_name', label: '사이트 이름' },
  { key: 'intro_name', label: '이름' },
  { key: 'intro_job', label: '직업' },
  { key: 'intro_bio', label: '소개글', multiline: true },
  { key: 'contact_email', label: '이메일' },
  {
    key: 'default_grid_size',
    label: '포트폴리오 기본 크기',
    options: [
      { value: 'sm', label: '소' },
      { value: 'md', label: '중' },
      { value: 'lg', label: '대' },
    ],
  },
];

export default function SiteContentForm({ content }: SiteContentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, string>>(content);
  const [saving, setSaving] = useState(false);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();

    const updates = FIELDS.map(({ key }) =>
      supabase
        .from('site_content')
        .upsert({ key, value: values[key] || '' }, { onConflict: 'key' }),
    );

    const results = await Promise.all(updates);
    const error = results.find((r: { error: unknown }) => r.error)?.error;

    setSaving(false);

    if (error) {
      toast('저장에 실패했습니다.');
      return;
    }

    router.refresh();
    toast('저장되었습니다.', 'success');
  };

  const inputClass =
    'w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {FIELDS.map(({ key, label, multiline, options }) => (
        <div key={key}>
          <label className="mb-1 block text-sm font-medium">{label}</label>
          {options ? (
            <select
              value={values[key] || options[0].value}
              onChange={(e) => handleChange(key, e.target.value)}
              className={inputClass}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : multiline ? (
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
