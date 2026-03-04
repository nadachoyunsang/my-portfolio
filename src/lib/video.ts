const BUCKET = 'videos';
const INTRO_PATH = 'intro-background';
const MAX_SIZE_MB = 50;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['video/mp4'];

type SupabaseClient = ReturnType<
  typeof import('@/lib/supabase/client').createClient
>;

export async function uploadIntroVideo(
  supabase: SupabaseClient,
  file: File,
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('MP4 형식만 업로드할 수 있습니다.');
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new Error(`파일 크기는 ${MAX_SIZE_MB}MB 이하여야 합니다.`);
  }

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(INTRO_PATH, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(INTRO_PATH);

  return `${publicUrl}?t=${Date.now()}`;
}

export async function deleteIntroVideo(
  supabase: SupabaseClient,
): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([INTRO_PATH]);

  if (error) throw error;
}

export async function getIntroVideoUrl(
  supabase: SupabaseClient,
): Promise<string | null> {
  const { data, error } = await supabase.storage.from(BUCKET).list('', {
    search: INTRO_PATH,
  });

  if (error) throw error;

  const exists = data.some((file) => file.name === INTRO_PATH);
  if (!exists) return null;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(INTRO_PATH);

  return publicUrl;
}
