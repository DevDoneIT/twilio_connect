import ParticipantTracks from './ParticipantTracks';
import React from 'react';
import { inject, observer } from 'mobx-react';

const MainParticipant = props => {
  const {
    twilioModel: { room, selectedParticipant, mainParticipant },
  } = props;
  const { localParticipant } = room;

  console.log('mainParticipant', mainParticipant);

  const videoPriority =
    mainParticipant?.identity === selectedParticipant?.identity &&
    mainParticipant?.identity !== localParticipant?.identity
      ? 'high'
      : null;

  return (
    /* audio is disabled for this participant component because this participant's audio 
       is already being rendered in the <ParticipantStrip /> component.  */
    <div className="mainBlock">
      <ParticipantTracks
        participant={mainParticipant}
        videoOnly
        enableScreenShare={mainParticipant?.identity !== localParticipant?.identity}
        videoPriority={videoPriority}
        isLocalParticipant={mainParticipant?.identity === localParticipant?.identity}
      />
    </div>
  );
}

export default inject('twilioModel')(observer(MainParticipant));
