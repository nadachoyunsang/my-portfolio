'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { createClient } from '@/lib/supabase/client';
import { uploadIntroVideo, deleteIntroVideo, VIDEO_ACCEPT } from '@/lib/video';

interface SiteContentFormProps {
  content: Record<string, string>;
  introVideoUrl: string | null;
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

export default function SiteContentForm({
  content,
  introVideoUrl,
}: SiteContentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, string>>(content);
  const [saving, setSaving] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(introVideoUrl);
  const [videoUploading, setVideoUploading] = useState(false);

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

    toast('저장되었습니다.', 'success');
    router.push('/admin');
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      e.target.value = '';
      return;
    }
    setVideoUploading(true);
    try {
      const supabase = createClient();
      const url = await uploadIntroVideo(supabase, file);
      setVideoUrl(url);
      toast('영상이 업로드되었습니다.', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : '영상 업로드에 실패했습니다.');
    } finally {
      setVideoUploading(false);
      e.target.value = '';
    }
  };

  const handleVideoDelete = async () => {
    if (!confirm('배경 영상을 삭제하시겠습니까?')) return;
    try {
      const supabase = createClient();
      await deleteIntroVideo(supabase);
      setVideoUrl(null);
      toast('영상이 삭제되었습니다.', 'success');
    } catch {
      toast('영상 삭제에 실패했습니다.');
    }
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
      <div>
        <label className="mb-1 block text-sm font-medium">배경 영상</label>
        {videoUrl ? (
          <div className="space-y-3">
            <video
              src={videoUrl}
              controls
              muted
              className="max-h-48 rounded-lg"
            />
            <div className="flex gap-2">
              <label className="cursor-pointer text-sm text-muted transition-colors hover:text-foreground">
                {videoUploading ? '업로드 중...' : '변경'}
                <input
                  type="file"
                  accept={VIDEO_ACCEPT}
                  onChange={handleVideoUpload}
                  disabled={videoUploading}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={handleVideoDelete}
                disabled={videoUploading}
                className="text-sm text-red-400 transition-colors hover:text-red-300 disabled:opacity-50"
              >
                삭제
              </button>
            </div>
          </div>
        ) : (
          <div>
            {videoUploading ? (
              <p className="text-sm text-muted">업로드 중...</p>
            ) : (
              <input
                type="file"
                accept={VIDEO_ACCEPT}
                onChange={handleVideoUpload}
                className="text-sm text-muted"
              />
            )}
            <p className="mt-1 text-xs text-muted">MP4 형식, 최대 50MB</p>
          </div>
        )}
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? '저장 중...' : '저장'}
      </Button>
    </form>
  );
}
