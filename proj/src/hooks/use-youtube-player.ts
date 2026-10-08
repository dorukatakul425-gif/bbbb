import { useEffect, useRef, useState } from 'react';

type Player = {
  playVideo: () => void; pauseVideo: () => void; mute: () => void; unMute: () => void;
  destroy: () => void;
};
type YouTubeApi = { Player: new (element: HTMLElement, options: {
  videoId: string;
  playerVars: Record<string, string | number>;
  events: { onReady: (event: { target: Player }) => void; onStateChange: (event: { data: number }) => void; onError: (event: { data: number }) => void; onAutoplayBlocked: () => void };
}) => Player };

function loadYouTubeApi(): Promise<YouTubeApi> {
  return new Promise((resolve, reject) => {
    const getApi = () => (window as Window & { YT?: YouTubeApi }).YT;
    const existing = getApi();
    if (existing?.Player) { resolve(existing); return; }
    let script = document.querySelector<HTMLScriptElement>('script[data-youtube-api]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.dataset['youtubeApi'] = 'true';
      document.head.appendChild(script);
    }
    let attempts = 0;
    const interval = window.setInterval(() => {
      const api = getApi();
      if (api?.Player) { window.clearInterval(interval); resolve(api); }
      else if (++attempts > 150) { window.clearInterval(interval); reject(new Error('YouTube player could not load.')); }
    }, 100);
  });
}

export function useYouTubePlayer(videoId: string) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let disposed = false;
    setReady(false); setPlaying(false); setMuted(false); setError(null);
    const host = hostRef.current;
    if (!host) return;
    const element = document.createElement('div');
    host.appendChild(element);
    loadYouTubeApi().then((api) => {
      if (disposed) return;
      playerRef.current = new api.Player(element, {
        videoId,
        playerVars: { playsinline: 1, autoplay: 1, controls: 1, origin: window.location.origin, rel: 0 },
        events: {
          onReady: ({ target }) => { if (disposed) return; setReady(true); target.playVideo(); },
          onStateChange: ({ data }) => { if (!disposed) setPlaying(data === 1); },
          onAutoplayBlocked: () => { if (!disposed) setPlaying(false); },
          onError: ({ data }) => { if (!disposed) setError([101, 150].includes(data) ? 'This video cannot be played here. Choose another track.' : data === 153 ? 'YouTube could not verify this player. Open the published site or choose another track.' : 'This YouTube video is unavailable. Choose another track.'); },
        },
      });
    }).catch(() => { if (!disposed) setError('YouTube player could not load. Please try again.'); });
    return () => { disposed = true; playerRef.current?.destroy(); playerRef.current = null; host.replaceChildren(); };
  }, [videoId]);
  return { hostRef, playing, muted, ready, error,
    togglePlay: () => { if (playing) playerRef.current?.pauseVideo(); else playerRef.current?.playVideo(); },
    toggleMute: () => { if (muted) playerRef.current?.unMute(); else playerRef.current?.mute(); setMuted(!muted); },
  };
}