import { useCallback, useRef } from 'react';

export default function useLocalVideoToggle(props) {
  const {
    localParticipant,
    localTracks,
    getLocalVideoTrack,
    removeLocalVideoTrack,
    onError,
  } = props;

  const videoTrack = localTracks && localTracks.find(track => track.name.includes('camera') || track.kind === "video");
  const previousDeviceIdRef = useRef();

  const toggleVideoEnabled = useCallback(() => {
    if (videoTrack) {
      previousDeviceIdRef.current = videoTrack.mediaStreamTrack.getSettings().deviceId;
      const localTrackPublication = localParticipant?.unpublishTrack(videoTrack);
      // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
      localParticipant.emit('trackUnpublished', localTrackPublication);
      removeLocalVideoTrack(videoTrack);
    } else {
      getLocalVideoTrack({ deviceId: { exact: previousDeviceIdRef.current } })
    }
  }, [videoTrack, localParticipant, getLocalVideoTrack, onError, removeLocalVideoTrack]); // isPublishing

  return [!!videoTrack, toggleVideoEnabled];
}
