import React, { useCallback, useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from '@material-ui/core';
import { DEFAULT_VIDEO_CONSTRAINTS } from '../../../const/twilio';
import FlipCameraIcon from './FlipCameraIcon';
import useMediaStreamTrack from '../hooks/useMediaStreamTrack';
import { useVideoInputDevices } from '../hooks/deviceHooks';

const FlipCameraButton = (props) => {
  const { twilioModel: { localTracks } } = props;
  const [supportsFacingMode, setSupportsFacingMode] = useState(null);
  const videoTrack = localTracks && localTracks.find(track => track.name.includes('camera') || track.kind === "video");
  const mediaStreamTrack = useMediaStreamTrack(videoTrack);
  const videoDeviceList = useVideoInputDevices();

  useEffect(() => {
    // The 'supportsFacingMode' variable determines if this component is rendered
    // If 'facingMode' exists, we will set supportsFacingMode to true.
    // However, if facingMode is ever undefined again (when the user unpublishes video), we
    // won't set 'supportsFacingMode' to false. This prevents the icon from briefly
    // disappearing when the user switches their front/rear camera.
    const currentFacingMode = mediaStreamTrack?.getSettings().facingMode;
    if (currentFacingMode && supportsFacingMode === null) {
      setSupportsFacingMode(true);
    }
  }, [mediaStreamTrack, supportsFacingMode]);

  const toggleFacingMode = useCallback(() => {
    const newFacingMode = mediaStreamTrack?.getSettings().facingMode === 'user' ? 'environment' : 'user';
    videoTrack.restart({
      ...(DEFAULT_VIDEO_CONSTRAINTS),
      facingMode: newFacingMode,
    });
  }, [mediaStreamTrack, videoTrack]);

  return supportsFacingMode && videoDeviceList.length > 1 ? (
    <Button onClick={toggleFacingMode} disabled={!videoTrack} startIcon={<FlipCameraIcon />}>
      Flip Camera
    </Button>
  ) : null;
}

export default inject('twilioModel')(observer(FlipCameraButton));
