export async function resizeImage(file: File, maxWidth: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('리사이징 실패'))),
        'image/webp',
        0.85,
      );
    };
    img.onerror = () => reject(new Error('이미지 로드 실패'));
    img.src = URL.createObjectURL(file);
  });
}

export async function uploadImage(
  supabase: ReturnType<typeof import('@/lib/supabase/client').createClient>,
  file: File,
  maxWidth: number,
  folder: string,
): Promise<string> {
  const blob = await resizeImage(file, maxWidth);
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

  const { error } = await supabase.storage
    .from('images')
    .upload(fileName, blob, { contentType: 'image/webp' });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from('images').getPublicUrl(fileName);

  return publicUrl;
}
