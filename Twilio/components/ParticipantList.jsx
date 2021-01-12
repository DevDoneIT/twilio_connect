import React from 'react';
import { inject, observer } from 'mobx-react';
import Participant from './Participant';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      padding: '2em',
      overflowY: 'auto',
      background: 'rgb(79, 83, 85)',
      gridArea: '1 / 2 / 1 / 3',
      zIndex: 5,
      [theme.breakpoints.down('sm')]: {
        gridArea: '2 / 1 / 3 / 3',
        overflowY: 'initial',
        overflowX: 'auto',
        display: 'flex',
        padding: `${theme.sidebarMobilePadding}px`,
      },
    },
    transparentBackground: {
      background: 'transparent',
    },
    scrollContainer: {
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
      },
    },
  })
); 

const ParticipantList = (props) => {
  const classes = useStyles();
  const {
    twilioModel: { room, setSelectedParticipant, selectedParticipant, participants, mainParticipant },
    groupsModel: { groupParticipants },
    owner,
  } = props;
  const { localParticipant } = room;

  if (!participants || participants.length === 0) return null; // Don't render this component if there are no remote participants.

  return (
    <aside
      className={classes.container}
    >
      <div className={classes.scrollContainer}>
        <Participant participant={localParticipant} isLocalParticipant={true} user={owner}/>
        {participants.map(participant => {
          const isSelected = participant === selectedParticipant;
          const hideParticipant =
            participant === mainParticipant && !isSelected;
          return (
            <Participant
              key={participant.sid}
              participant={participant}
              isSelected={participant === selectedParticipant}
              onClick={() => setSelectedParticipant(participant)}
              hideParticipant={hideParticipant}
              user={groupParticipants.participants.filter(p => p.id == participant.identity)[0] || null}
            />
          );
        })}
      </div>
    </aside>
  );
}

export default inject('twilioModel', 'groupsModel')(observer(ParticipantList));
