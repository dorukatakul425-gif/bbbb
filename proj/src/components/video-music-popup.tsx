import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useRef, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { searchYouTube } from '@/lib/youtube.functions';
import type { YouTubeTrack } from '@/lib/youtube.types';
import { MusicConfirmation } from './music-confirmation';
import { Search, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import popularAsset from "@/assets/video-music-popular.png.asset.json";
const popular = popularAsset.url;
import favoritesAsset from "@/assets/video-music-favorites.png.asset.json";
const favorites = favoritesAsset.url;
import recentAsset from "@/assets/video-music-recent.png.asset.json";
const recent = recentAsset.url;
import recentActiveAsset from "@/assets/video-music-recent-active.png.asset.json";
const recentActive = recentActiveAsset.url;
import searchAsset from "@/assets/video-music-search.png.asset.json";
const search = searchAsset.url;
import searchActiveAsset from "@/assets/video-music-search-active.png.asset.json";
const searchActive = searchActiveAsset.url;
import closeAsset from "@/assets/video-music-close.png.asset.json";
const close = closeAsset.url;
import sourceSwitchAsset from "@/assets/video-music-source-switch.jpg.asset.json";
const sourceSwitch = sourceSwitchAsset.url;

const TEST_TRACKS: YouTubeTrack[] = [
  { id: '60ItHLz5WEA', title: 'Test Müzik - Faded', channel: 'Test', image: 'https://i.ytimg.com/vi/60ItHLz5WEA/mqdefault.jpg' },
  { id: 'kJQP7kiw5Fk', title: 'Test Müzik 2', channel: 'Test', image: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg' },
];
type View = 'popular' | 'favorites' | 'recent' | 'search';
const headings: Record<View, string> = {
  popular: 'Choose music from Popular',
  favorites: 'Choose music from Favorites',
  recent: 'Play recent music',
  search: 'Search for music',
};

export function VideoMusicPopup({ open, onOpenChange, onPlay, recentTracks }: { open: boolean; onOpenChange: (open: boolean) => void; onPlay: (track: YouTubeTrack) => void; recentTracks: YouTubeTrack[] }) {
  const [view, setView] = useState<View>('popular');
  const [source, setSource] = useState<'Y' | 'M'>('Y');
  const [saved, setSaved] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchFn = useServerFn(searchYouTube);
  const requestRef = useRef(0);
  const [results, setResults] = useState<YouTubeTrack[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selected, setSelected] = useState<YouTubeTrack | null>(null);
  const [favoriteTracks, setFavoriteTracks] = useState<YouTubeTrack[]>([]);
  const runSearch = async (term: string, pageToken?: string) => {
    if (!term.trim()) return;
    const request = ++requestRef.current;
    setLoading(true); setSearchError(null);
    try {
      const response = await searchFn({ data: { query: term, pageToken } });
      if (request !== requestRef.current) return;
      setResults((old) => pageToken ? [...old, ...response.tracks.filter((track) => !old.some((item) => item.id === track.id))] : response.tracks);
      setNextPage(response.nextPageToken); setSearchError(response.error);
    } catch { if (request === requestRef.current) setSearchError('YouTube search could not be reached. Please try again.'); }
    finally { if (request === requestRef.current) setLoading(false); }
  };
  useEffect(() => {
    if (!open || view !== 'popular') return;
    void runSearch(source === 'Y' ? 'popular music Azerbaijan' : 'popular music Turkish Uzbek');
    return () => { requestRef.current++; };
  }, [open, view, source]);
  const tracks = view === 'recent' ? recentTracks : view === 'favorites' ? favoriteTracks : view === 'popular' ? [...TEST_TRACKS, ...results] : results;
  const tabs: { id: View; label: string; image: string }[] = [
    { id: 'popular', label: 'Popular', image: popular },
    { id: 'favorites', label: 'Favorites', image: favorites },
    { id: 'recent', label: 'Recent', image: view === 'recent' ? recentActive : recent },
    { id: 'search', label: 'Search', image: view === 'search' ? searchActive : search },
  ];
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="video-music-backdrop" />
        <Dialog.Content className="video-music-popup" aria-describedby={undefined} onOpenAutoFocus={(event) => event.preventDefault()} onCloseAutoFocus={(event) => {
          event.preventDefault();
          document.querySelector<HTMLButtonElement>('.video-control')?.focus({ preventScroll: true });
        }}>
          <div className="video-music-surface">
            <div className="video-music-tabs" role="tablist" aria-label="Music library">
              <Button variant="reference" size="reference" className="video-music-source" title="Switch music source" aria-label="Switch music source" onClick={() => setSource(source === 'Y' ? 'M' : 'Y')}><img src={sourceSwitch} alt="" />{source}</Button>
              {tabs.map((tab) => <Button key={tab.id} variant="reference" size="reference" role="tab" aria-selected={view === tab.id} aria-label={tab.label} title={tab.label} className={`video-music-tab${view === tab.id ? ' selected' : ''}`} onClick={() => setView(tab.id)}><img src={tab.image} alt="" /></Button>)}
            </div>
            <Dialog.Title className="video-music-heading">{headings[view]}</Dialog.Title>
            {view === 'search' && <form className="video-music-search" onSubmit={(event) => { event.preventDefault(); setSubmittedQuery(query.trim()); void runSearch(query.trim()); }}>
              <label><Search aria-hidden="true" /><input aria-label="Search music" placeholder="Search music with the" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
              <Button variant="reference" size="reference" type="submit" className="video-music-search-submit">Axtar</Button>
            </form>}
            <div className="video-music-results" role="tabpanel" aria-label={headings[view]}>
              {searchError && view === 'search' ? <p className="video-music-empty" role="alert">{searchError}</p> : loading && view === 'search' ? <div className="video-music-loader" role="status" aria-label="Loading music">{Array.from({ length: 8 }, (_, i) => <span key={i} />)}</div> : tracks.length > 0 ? <div className="video-music-grid">
                {tracks.map((track) => <article className="video-music-track" key={track.id}>
                  <div className="video-music-art"><Button variant="reference" size="reference" className="video-music-select" aria-label={`Select ${track.title}`} onClick={() => setSelected(track)}><img src={track.image} alt="" draggable={false} /></Button>
                    <Button variant="reference" size="reference" className="video-music-save" aria-label={`Favorite ${track.title}`} aria-pressed={saved.includes(track.id)} title="Favorite" onClick={() => { setSaved((items) => items.includes(track.id) ? items.filter((id) => id !== track.id) : [...items, track.id]); setFavoriteTracks((items) => items.some((item) => item.id === track.id) ? items.filter((item) => item.id !== track.id) : [...items, track]); }}>
                      {saved.includes(track.id) && <Star className="video-music-saved-star" />}
                    </Button>
                  </div>
                  <Button variant="reference" size="reference" className="video-music-track-title" onClick={() => setSelected(track)}>{track.title}</Button>
                </article>)}
              </div> : (view !== 'search' || submittedQuery !== null) && <p className="video-music-empty">No music has been found</p>}
              {nextPage && !loading && view === 'search' && <Button variant="reference" size="reference" className="video-music-more" onClick={() => void runSearch(view === 'search' ? submittedQuery ?? query : source === 'Y' ? 'popular music Azerbaijan' : 'popular music Turkish Uzbek', nextPage)}>More music</Button>}
            </div>
          </div>
          <MusicConfirmation track={selected} onCancel={() => setSelected(null)} onConfirm={(track) => { onPlay(track); setSelected(null); onOpenChange(false); }} />
          <Dialog.Close asChild><Button variant="reference" size="reference" className="video-music-close" aria-label="Close video music"><img src={close} alt="" /></Button></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}