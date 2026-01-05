type AvatarFallback = {
  initials: string;
  colorIndex: number;
};

/**
 * Generate avatar fallback from username
 * - Deterministic (same username = same result)
 * - Safe for dark/light mode
 */
export function getAvatarFallback(username?: string): AvatarFallback {
  if (!username) {
    return { initials: "?", colorIndex: 0 };
  }

  const cleaned = username
    .trim()
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ");

  const parts = cleaned.split(" ").filter(Boolean);

  let initials = "";

  if (parts.length === 1) {
    initials = parts[0].slice(0, 2);
  } else {
    initials = parts[0][0] + parts[1][0];
  }

  initials = initials.toUpperCase();

  // Simple hash for stable color selection
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colorIndex = Math.abs(hash) % 6;

  return { initials, colorIndex };
}

export const avatarVariants = [
  "bg-primary text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-muted text-muted-foreground",
  "bg-card text-card-foreground",
  "bg-destructive text-destructive-foreground",
];
