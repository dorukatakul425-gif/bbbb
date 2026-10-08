import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import type { YouTubeSearchResult } from './youtube.types';

export const searchYouTube = createServerFn({ method: 'GET' })
  .inputValidator((input: unknown) => z.object({
    query: z.string().trim().min(1).max(160),
    pageToken: z.string().max(300).optional(),
  }).parse(input))
  .handler(async ({ data }): Promise<YouTubeSearchResult> => {
    const apiKey = process.env['YOUTUBE_API_KEY'];
    if (!apiKey) return { tracks: [], nextPageToken: null, error: 'YouTube search is not connected yet.' };
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.search = new URLSearchParams({
      part: 'snippet', type: 'video', q: data.query, maxResults: '20',
      videoEmbeddable: 'true', videoSyndicated: 'true', key: apiKey,
      ...(data.pageToken ? { pageToken: data.pageToken } : {}),
    }).toString();
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
      if (!response.ok) return { tracks: [], nextPageToken: null, error: response.status === 403 ? 'YouTube search is unavailable. Check the API quota and permissions.' : 'YouTube search is temporarily unavailable.' };
      const body = await response.json() as {
        nextPageToken?: string;
        items?: { id?: { videoId?: string }; snippet?: { title?: string; channelTitle?: string; thumbnails?: { medium?: { url?: string } } } }[];
      };
      const tracks = (body.items ?? []).flatMap((item) => {
        const id = item.id?.videoId;
        if (!id || !/^[\w-]{11}$/.test(id)) return [];
        return [{ id, title: item.snippet?.title ?? '', channel: item.snippet?.channelTitle ?? '', image: item.snippet?.thumbnails?.medium?.url ?? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` }];
      });
      return { tracks, nextPageToken: body.nextPageToken ?? null, error: null };
    } catch {
      return { tracks: [], nextPageToken: null, error: 'YouTube search could not be reached. Please try again.' };
    }
  });