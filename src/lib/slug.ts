export function generateSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\w\sㄱ-ㅎ가-힣-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}
