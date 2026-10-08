import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import type { YouTubeTrack } from '@/lib/youtube.types';
import closeAsset from "@/assets/video-music-close.png.asset.json";
const close = closeAsset.url;

export function MusicConfirmation({ track, onCancel, onConfirm }: { track: YouTubeTrack | null; onCancel: () => void; onConfirm: (track: YouTubeTrack) => void }) {
  return <Dialog.Root open={track !== null} onOpenChange={(open) => { if (!open) onCancel(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className="music-confirm-backdrop" />
      <Dialog.Content className="music-confirm-popup" aria-describedby="music-confirm-description" onOpenAutoFocus={(event) => event.preventDefault()}>
        {track && <div className="music-confirm-surface">
          <Dialog.Title className="music-confirm-title">Put on YouTube music</Dialog.Title>
          <iframe className="music-confirm-preview" title={`Preview ${track.title}`} src={`https://www.youtube.com/embed/${track.id}?playsinline=1&rel=0`} allow="encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          <Dialog.Description id="music-confirm-description" className="music-confirm-description">Play music &quot;{track.title}&quot;?</Dialog.Description>
          <div className="music-confirm-actions">
            <Button variant="reference" size="reference" className="music-confirm-cancel" onClick={onCancel}>Cancel</Button>
            <Button variant="reference" size="reference" className="music-confirm-play" onClick={() => onConfirm(track)}>Put on</Button>
          </div>
        </div>}
        <Dialog.Close asChild><Button variant="reference" size="reference" className="video-music-close" aria-label="Close music confirmation"><img src={close} alt="" /></Button></Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}