import { Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useYouTubePlayer } from '@/hooks/use-youtube-player';
import type { YouTubeTrack } from '@/lib/youtube.types';
import avatarAsset from "@/assets/avatar-default.png.asset.json";
const avatar = avatarAsset.url;

export function ChatMusicPlayer({ track, onStop }: { track: YouTubeTrack; onStop: () => void }) {
  const player = useYouTubePlayer(track.id);
  return <div className="chat-music-player" aria-label="YouTube music player">
    <div className="chat-music-controls">
      <img className="chat-music-avatar" src={avatar} alt="" />
      <Button variant="reference" size="reference" title={player.muted ? 'Unmute music' : 'Mute music'} aria-label={player.muted ? 'Unmute music' : 'Mute music'} onClick={player.toggleMute} disabled={!player.ready}>{player.muted ? <VolumeX /> : <Volume2 />}</Button>
    </div>
    <div className="chat-music-video">
      <div className="chat-music-host" ref={player.hostRef} />
      <div className="chat-music-actions">
      <Button variant="reference" size="reference" className="chat-music-fullscreen" title="Fullscreen music" aria-label="Fullscreen music" onClick={() => { const host = player.hostRef.current; if (host?.requestFullscreen) void host.requestFullscreen().catch(() => {}); }}>F</Button>
      <Button variant="reference" size="reference" title={player.playing ? 'Pause music' : 'Play music'} aria-label={player.playing ? 'Pause music' : 'Play music'} onClick={player.togglePlay} disabled={!player.ready}>{player.playing ? <Pause /> : <Play />}</Button>
      <Button variant="reference" size="reference" title="Stop music" aria-label="Stop music" onClick={onStop}><X /></Button>
      </div>
    </div>
    {player.error && <p className="chat-music-error" role="alert">{player.error}</p>}
  </div>;
}