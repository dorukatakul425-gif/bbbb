export type YouTubeTrack = {
  id: string;
  title: string;
  channel: string;
  image: string;
};
export type YouTubeSearchResult = {
  tracks: YouTubeTrack[];
  nextPageToken: string | null;
  error: string | null;
};