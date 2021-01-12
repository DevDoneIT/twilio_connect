import React from 'react';
import useTrack from '../hooks/useTrack';
import AudioTrack from './AudioTrack';
import VideoTrack from './VideoTrack';

export default function Publication({ publication, isLocalParticipant, videoOnly, videoPriority }) {
  const track = useTrack(publication);
  
  console.log('track', track);

  if (!track) return null;

  switch (track.kind) {
    case 'video':
      return (
        <VideoTrack
          track={track}
          priority={videoPriority}
          isLocal={(track.name.includes('camera') || track.kind === "video") && isLocalParticipant}
        />
      );
    case 'audio':
      return videoOnly ? null : <AudioTrack track={track} />;
    default:
      return null;
  }
}