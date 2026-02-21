export function calculateReadingTime(markdown: string): number {
  const words = markdown
    .replace(/[#_*`>\-\n]/g, "")
    .trim()
    .split(/\s+/).length;

  return Math.max(1, Math.ceil(words / 200));
}
