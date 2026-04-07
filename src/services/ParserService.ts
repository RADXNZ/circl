import { IGUser } from '../types';

export class ParserService {
  /**
   * Attempts to parse raw string data from an Instagram export file (HTML or JSON)
   * and normalizes it into a standard array of IGUser objects.
   */
  static parse(rawData: string): IGUser[] {
    // Attempt JSON parse first
    try {
      const data = JSON.parse(rawData);
      return this.parseJSON(data);
    } catch (e) {
      // Fallback to HTML
      return this.parseHTML(rawData);
    }
  }

  private static parseJSON(data: any): IGUser[] {
    const users: IGUser[] = [];

    // System paths that are NOT real usernames
    const SYSTEM_NAMES = new Set([
      '_u', 'p', 'reels', 'tv', 'stories', 'explore',
      'direct', 'accounts', 'instagram', 'support', 'help',
      'followers', 'following', 'profile history', 'account', 'users',
      'privacy', 'settings', 'notifications', 'activity', 'discover',
    ]);

    const sanitizeUsername = (val: string | undefined): string | undefined => {
      if (!val || typeof val !== 'string') return undefined;
      const clean = val.trim();
      // Must look like a valid IG username
      if (clean.length < 2) return undefined;
      if (clean.includes(' ')) return undefined;
      if (clean.startsWith('http')) return undefined;
      if (SYSTEM_NAMES.has(clean.toLowerCase())) return undefined;
      // Only allow valid IG username characters
      if (!/^[@]?[a-zA-Z0-9._]{1,30}$/.test(clean)) return undefined;
      return clean.startsWith('@') ? clean.substring(1) : clean;
    };

    const extractFromHref = (href: string): string | undefined => {
      if (!href || !href.includes('instagram.com/')) return undefined;
      const match = href.match(/instagram\.com\/([^\/\?#]+)/);
      if (!match || !match[1]) return undefined;
      return sanitizeUsername(match[1]);
    };

    const extractDeep = (obj: any): void => {
      if (!obj || typeof obj !== 'object') return;

      if (Array.isArray(obj)) {
        // Simple array: recurse into each element
        for (const item of obj) extractDeep(item);
        return;
      }

      // Structure 1: { string_list_data: [...] } — Instagram's standard format
      if (obj.string_list_data && Array.isArray(obj.string_list_data)) {
        for (const item of obj.string_list_data) {
          let username: string | undefined =
            sanitizeUsername(item.value) ||
            sanitizeUsername(item.username) ||
            extractFromHref(item.href) ||
            sanitizeUsername(obj.title);

          if (username) {
            users.push({
              username,
              url: item.href || '',
              timestamp: item.timestamp,
            });
          }
        }
        // ⚠️ CRITICAL: Do NOT recurse further into this object's values —
        // that would double-process the string_list_data items above.
        return;
      }

      // Structure 2: Direct object with href (link-style)
      if (obj.href && typeof obj.href === 'string') {
        const username: string | undefined =
          sanitizeUsername(obj.value) ||
          sanitizeUsername(obj.username) ||
          sanitizeUsername(obj.title) ||
          extractFromHref(obj.href);

        if (username) {
          users.push({ username, url: obj.href, timestamp: obj.timestamp });
        }
        // ⚠️ Do NOT recurse further — prevent double-processing nested props
        return;
      }

      // Structure 3: Unknown object — recurse into values to discover nested data
      for (const val of Object.values(obj)) {
        if (val && typeof val === 'object') extractDeep(val);
      }
    };

    extractDeep(data);

    return this.deduplicate(users);
  }

  private static parseHTML(html: string): IGUser[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = doc.querySelectorAll('a');

    const users: IGUser[] = [];

    links.forEach(link => {
      const href = link.getAttribute('href') || '';
      if (!href.includes('instagram.com/')) return;

      // Try to extract username from the href itself (most reliable)
      const match = href.match(/instagram\.com\/([^\/\?#]+)/);
      const hrefUsername = match?.[1];

      // Also try the link text
      const textUsername = link.textContent?.trim();

      const username = hrefUsername || textUsername;
      if (!username || username.includes(' ') || username.length < 2) return;

      let timestamp: number | undefined;
      const tsStr = link.parentElement?.nextElementSibling?.textContent?.trim();
      if (tsStr && !isNaN(Date.parse(tsStr))) {
        timestamp = new Date(tsStr).getTime();
      }

      users.push({ username, url: href, timestamp });
    });

    return this.deduplicate(users);
  }

  private static deduplicate(users: IGUser[]): IGUser[] {
    const map = new Map<string, IGUser>();
    for (const u of users) {
      // Normalize username to lowercase for accurate deduplication
      const key = u.username.toLowerCase();
      if (!map.has(key)) {
        map.set(key, u);
      }
    }
    return Array.from(map.values());
  }
}

