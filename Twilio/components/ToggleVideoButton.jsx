import React, { useCallback, useRef } from 'react';
import { inject, observer } from 'mobx-react';

import Button from '@material-ui/core/Button';
// import VideoOffIcon from '../../../icons/VideoOffIcon';
// import VideoOnIcon from '../../../icons/VideoOnIcon';
import VideoCamIcon from '../../../res/iconComp/VideoCamIcon';
import VideoCamNoIcon from '../../../res/iconComp/VideoCamNoIcon';

import { useHasVideoInputDevices } from '../hooks/deviceHooks';
import useLocalVideoToggle from '../hooks/useLocalVideoToggle';

const ToggleVideoButton = (props) => {
	const { disabled, className,
		twilioModel: { room: { localParticipant },
			localTracks,
			getLocalVideoTrack,
			removeLocalVideoTrack,
			onError,
		}
  } = props;
  
	const [isVideoEnabled, toggleVideoEnabled] = 
		useLocalVideoToggle({ localParticipant, localTracks, getLocalVideoTrack, removeLocalVideoTrack, onError });
  const lastClickTimeRef = useRef(0);
  const hasVideoDevices = useHasVideoInputDevices();

  const toggleVideo = useCallback(() => {
    if (Date.now() - lastClickTimeRef.current > 500) {
      lastClickTimeRef.current = Date.now();
      toggleVideoEnabled();
    }
  }, [toggleVideoEnabled]);

  return (
    <Button
      className={className}
      onClick={toggleVideo}
      disabled={!hasVideoDevices || disabled}
      startIcon={isVideoEnabled ? <VideoCamIcon /> : <VideoCamNoIcon />}
    >
      {/* {!hasVideoDevices ? 'No Video' : isVideoEnabled ? 'Stop Video' : 'Start Video'} */}
    </Button>
  );
}

export default inject('twilioModel')(observer(ToggleVideoButton));
