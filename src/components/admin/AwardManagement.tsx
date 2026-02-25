'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import type { Award } from '@/types/award';

interface AwardManagementProps {
  awards: Award[];
}

export default function AwardManagement({
  awards: initialAwards,
}: AwardManagementProps) {
  const router = useRouter();
  const [awards, setAwards] = useState(initialAwards);
  const [newName, setNewName] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newOrganization, setNewOrganization] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editOrganization, setEditOrganization] = useState('');
  const [saving, setSaving] = useState(false);

  const inputClass =
    'w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent';

  const sortByYearDesc = (list: Award[]) =>
    [...list].sort((a, b) => b.year - a.year);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newYear.trim() || !newOrganization.trim()) return;

    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any;

    const { data, error } = await supabase
      .from('awards')
      .insert({
        name: newName.trim(),
        year: parseInt(newYear, 10),
        organization: newOrganization.trim(),
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      alert(`추가 실패: ${error.message}`);
      return;
    }

    setAwards(sortByYearDesc([...awards, data]));
    setNewName('');
    setNewYear('');
    setNewOrganization('');
    router.refresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 수상 내역을 삭제하시겠습니까?`)) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any;
    const { error } = await supabase.from('awards').delete().eq('id', id);

    if (error) {
      alert(`삭제 실패: ${error.message}`);
      return;
    }

    setAwards(awards.filter((a) => a.id !== id));
    router.refresh();
  };

  const startEdit = (award: Award) => {
    setEditingId(award.id);
    setEditName(award.name);
    setEditYear(String(award.year));
    setEditOrganization(award.organization);
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim() || !editYear.trim() || !editOrganization.trim())
      return;

    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any;
    const { error } = await supabase
      .from('awards')
      .update({
        name: editName.trim(),
        year: parseInt(editYear, 10),
        organization: editOrganization.trim(),
      })
      .eq('id', id);

    setSaving(false);

    if (error) {
      alert(`수정 실패: ${error.message}`);
      return;
    }

    setAwards(
      sortByYearDesc(
        awards.map((a) =>
          a.id === id
            ? {
                ...a,
                name: editName.trim(),
                year: parseInt(editYear, 10),
                organization: editOrganization.trim(),
              }
            : a,
        ),
      ),
    );
    setEditingId(null);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* 수상 내역 목록 */}
      <div className="space-y-2">
        {awards.map((award) => (
          <div
            key={award.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-background p-4"
          >
            {editingId === award.id ? (
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`${inputClass} flex-1`}
                  placeholder="수상명"
                />
                <input
                  type="number"
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  className={`${inputClass} w-24`}
                  placeholder="연도"
                />
                <input
                  type="text"
                  value={editOrganization}
                  onChange={(e) => setEditOrganization(e.target.value)}
                  className={`${inputClass} flex-1`}
                  placeholder="수여기관"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleUpdate(award.id)}
                    disabled={saving}
                  >
                    저장
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(null)}
                  >
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <span className="font-medium">{award.name}</span>
                  <span className="ml-3 text-xs text-muted">
                    {award.organization} ({award.year})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(award)}
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(award.id, award.name)}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        ))}
        {awards.length === 0 && (
          <p className="py-8 text-center text-muted">수상 내역이 없습니다.</p>
        )}
      </div>

      {/* 새 수상 내역 추가 */}
      <form onSubmit={handleAdd} className="space-y-4">
        <h3 className="font-semibold">수상 내역 추가</h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">수상명</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="예: 한국기자상"
              required
              className={inputClass}
            />
          </div>
          <div className="w-full sm:w-24">
            <label className="mb-1 block text-sm font-medium">연도</label>
            <input
              type="number"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              placeholder="2024"
              required
              className={inputClass}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">수여기관</label>
            <input
              type="text"
              value={newOrganization}
              onChange={(e) => setNewOrganization(e.target.value)}
              placeholder="예: 한국기자협회"
              required
              className={inputClass}
            />
          </div>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? '추가 중...' : '추가'}
        </Button>
      </form>
    </div>
  );
}
