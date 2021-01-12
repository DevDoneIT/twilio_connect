import React from 'react';
// import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from './ParticipantTracks';
import PartisipantAvatar from './PartisipantAvatar';

export default function Participant({
  participant,
  videoOnly,
  enableScreenShare,
  // onClick,
  // isSelected,
  isLocalParticipant,
  // hideParticipant,
  user,
}) {
  if (participant.videoTracks.size > 0) {
    return (
      // <ParticipantInfo
      //   participant={participant}
      //   onClick={onClick}
      //   isSelected={isSelected}
      //   isLocalParticipant={isLocalParticipant}
      //   hideParticipant={hideParticipant}
      // >
        <ParticipantTracks
          participant={participant}
          videoOnly={videoOnly}
          enableScreenShare={enableScreenShare}
          isLocalParticipant={isLocalParticipant}
        />
      // </ParticipantInfo>
    );
  }

  return <PartisipantAvatar user={user} />
}
