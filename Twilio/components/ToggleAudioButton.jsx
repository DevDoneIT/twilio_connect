import React from 'react';
import { inject, observer } from 'mobx-react';

import Button from '@material-ui/core/Button';
// import MicIcon from '../../../icons/MicIcon';
// import MicOffIcon from '../../../icons/MicOffIcon';
import MicIcon from '../../../res/iconComp/MicIcon';
import MicNoIcon from '../../../res/iconComp/MicNoIcon';

// import useLocalAudioToggle from '../hooks/useLocalAudioToggle';

const ToggleAudioButton = (props) => {
    const { disabled, className, twilioModel: { localTracks, useToggleAudioEnabled, isAudioAEnabled } } = props;
  // const [isAudioEnabled, toggleAudioEnabled] = useToggleAudioEnabled();
  const hasAudioTrack = localTracks.some(track => track.kind === 'audio');

  return (
    <Button
      className={className}
      onClick={useToggleAudioEnabled}
      disabled={!hasAudioTrack || disabled}
      startIcon={isAudioAEnabled ? <MicIcon /> : <MicNoIcon />}
      data-cy-audio-toggle
    >
      {/* {!hasAudioTrack ? 'No Audio' : isAudioEnabled ? 'Mute' : 'Unmute'} */}
    </Button>
  );
}

export default inject('twilioModel')(observer(ToggleAudioButton));
