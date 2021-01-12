import React from 'react';
import { inject, observer } from 'mobx-react';
import Publication from './Publication';

/*
 *  The object model for the Room object (found here: https://www.twilio.com/docs/video/migrating-1x-2x#object-model) shows
 *  that Participant objects have TrackPublications, and TrackPublication objects have Tracks.
 *
 *  The React components in this application follow the same pattern. This ParticipantTracks component renders Publications,
 *  and the Publication component renders Tracks.
 */

const ParticipantTracks = ({
  participant,
  videoOnly,
  enableScreenShare,
  videoPriority,
  isLocalParticipant,
}) => {
  let filteredPublications = Array.from(participant.tracks.values());
  console.log("$$$$$$$$$$ participant", participant);
  console.log("$$$$$$$$$4 filteredPublications", filteredPublications)
  if (participant.publications) {
    if (enableScreenShare && participant.publications.some(p => p.trackName.includes('screen'))) {
      filteredPublications = participant.publications.filter(p => !p.trackName.includes('camera'));
    } else {
      filteredPublications = participant.publications.filter(p => !p.trackName.includes('screen'));
    }
  }
  console.log("$$$$$$$$$4 filteredPublications 2222", filteredPublications)

  return (
    <>
      {filteredPublications.map(publication => (
        <Publication
          key={publication.kind}
          publication={publication}
          participant={participant}
          isLocalParticipant={isLocalParticipant}
          videoOnly={videoOnly}
          videoPriority={videoPriority}
        />
      ))}
    </>
  );
}

export default inject('twilioModel')(observer(ParticipantTracks));
