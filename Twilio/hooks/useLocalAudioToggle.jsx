import { useCallback } from 'react';
import useIsTrackEnabled from './useIsTrackEnabled';

export default function useLocalAudioToggle(localTracks) {
  const audioTrack = localTracks && localTracks.find(track => track.kind === 'audio');
  const isEnabled = useIsTrackEnabled(audioTrack);

  const toggleAudioEnabled = useCallback(() => {
    if (audioTrack) {
      audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
    }
  }, [audioTrack]);

  return [isEnabled, toggleAudioEnabled];
}
