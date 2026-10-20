/**
 * Format video duration into digital timestamp format (H:MM:SS or MM:SS)
 * - If duration > 60 minutes (>= 3600 seconds): Formats as H:MM:SS (e.g. 1:02:03, 2:08:00)
 * - If duration <= 60 minutes: Formats as MM:SS (e.g. 24:00, 45:00)
 */
export function formatDuration(duration?: string, durationSec?: number): string {
  if (!duration && !durationSec) return '00:00';
  if (duration === 'LIVE') return 'LIVE';

  // Already formatted like 1:02:03 or 24:00
  if (duration && /^\d+:\d{2}(:\d{2})?$/.test(duration.trim())) {
    return duration.trim();
  }

  let totalSec = durationSec || 0;
  if (!totalSec && duration) {
    const minMatch = duration.match(/(\d+)\s*min/i);
    const mMatch = duration.match(/^(\d+)\s*m$/i);
    if (minMatch) {
      totalSec = parseInt(minMatch[1], 10) * 60;
    } else if (mMatch) {
      totalSec = parseInt(mMatch[1], 10) * 60;
    } else {
      const parsedNum = parseInt(duration, 10);
      if (!isNaN(parsedNum)) {
        totalSec = parsedNum > 300 ? parsedNum : parsedNum * 60;
      }
    }
  }

  if (totalSec <= 0) {
    return duration || '00:00';
  }

  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = Math.floor(totalSec % 60);

  if (hours > 0) {
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

/**
 * Format duration into human-readable text (e.g. "2h 8m" or "24m")
 */
export function formatDurationText(duration?: string, durationSec?: number): string {
  if (!duration && !durationSec) return '';
  if (duration === 'LIVE') return 'LIVE';

  let totalSec = durationSec || 0;
  if (!totalSec && duration) {
    const minMatch = duration.match(/(\d+)\s*min/i);
    const mMatch = duration.match(/^(\d+)\s*m$/i);
    if (minMatch) totalSec = parseInt(minMatch[1], 10) * 60;
    else if (mMatch) totalSec = parseInt(mMatch[1], 10) * 60;
    else {
      const parsed = parseInt(duration, 10);
      if (!isNaN(parsed)) totalSec = parsed > 300 ? parsed : parsed * 60;
    }
  }

  if (totalSec <= 0) return duration || '';

  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}
