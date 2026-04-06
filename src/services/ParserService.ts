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
    
    // IG exports are notoriously messy JSON. We recursively search for "value" strings
    // that look like usernames, or "href" that links to instagram.com/username
    
    const extractDeep = (obj: any) => {
      if (!obj) return;
      if (Array.isArray(obj)) {
        obj.forEach(extractDeep);
      } else if (typeof obj === 'object') {
        
        // Structure 1: string_list_data wrapper
        if (obj.string_list_data && Array.isArray(obj.string_list_data)) {
          obj.string_list_data.forEach((item: any) => {
            const val = item.value || item.title || obj.title;
            if (val && typeof val === 'string') {
              let username = val.trim();
              if (username.startsWith('@')) username = username.substring(1);
              users.push({ username, url: item.href || '', timestamp: item.timestamp });
            }
          });
        } 
        // Structure 2: Direct object with href and value/title
        else if (obj.href && typeof obj.href === 'string') {
          const val = obj.value || obj.title || obj.username;
          if (val && typeof val === 'string') {
            let username = val.trim();
            if (username.startsWith('@')) username = username.substring(1);
            users.push({ username, url: obj.href, timestamp: obj.timestamp });
          } else if (obj.href.includes('instagram.com/')) {
            // Fallback: extract username from URL if it's an instagram link but no value was provided
            const match = obj.href.match(/instagram\.com\/([^\/\?]+)/);
            if (match && match[1]) {
               users.push({ username: match[1], url: obj.href, timestamp: obj.timestamp });
            }
          }
        }

        Object.values(obj).forEach(extractDeep);
      }
    };
    
    extractDeep(data);
    
    // Clean up empty, invalid, or system entries
    const systemNames = new Set([
      '_u', 'p', 'reels', 'tv', 'stories', 'explore', 
      'direct', 'accounts', 'instagram', 'support', 'help'
    ]);
    
    const validUsers = users.map(u => {
      // Fix _u/ capturing bug from fallback regex
      if (u.username === '_u' && u.url && u.url.includes('_u/')) {
        const m = u.url.match(/_u\/([^\/\?]+)/);
        if (m && m[1]) u.username = m[1];
      }
      return u;
    }).filter(u => 
      u.username && 
      !u.username.includes(' ') && 
      !systemNames.has(u.username.toLowerCase())
    );
    
    return this.deduplicate(validUsers);
  }

  private static parseHTML(html: string): IGUser[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = doc.querySelectorAll('a');
    
    const users: IGUser[] = [];
    
    links.forEach(link => {
      const username = link.textContent?.trim();
      const href = link.getAttribute('href') || '';
      
      // Instagram exports have a specific structure, we only want actual users
      if (username && href.includes('instagram.com') && !username.includes(' ')) {
        let parent = link.parentElement;
        let tsStr = parent?.nextElementSibling?.textContent?.trim();
        let timestamp: number | undefined;
        
        if (tsStr && !isNaN(Date.parse(tsStr))) {
          timestamp = new Date(tsStr).getTime();
        }

        users.push({
          username,
          url: href,
          timestamp,
        });
      }
    });

    return this.deduplicate(users);
  }

  private static deduplicate(users: IGUser[]): IGUser[] {
    const map = new Map<string, IGUser>();
    for (const u of users) {
      if (!map.has(u.username)) {
        map.set(u.username, u);
      }
    }
    return Array.from(map.values());
  }
}
