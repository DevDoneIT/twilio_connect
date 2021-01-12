import React, { useState, cloneElement } from 'react';
import { inject, observer } from 'mobx-react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

// import Participant from './Participant';
// import ParticipantsBlock from './PartisipantsBlock';
import Wait from './Wait';
// import Navigation from './Navigation';
import MainParticipant from './components/MainParticipant';
import ParticipantList from './components/ParticipantList';
import MenuBar from './components/MenuBar';

import './twilio.scss';

const TwilioPage = props => {
  const {
    openButton,
    group,
    twilioModel: { room, getGroupCredential, disconnect, mainParticipant },
    userModel: { user },
  } = props;
  const [open, setOpen] = useState(false);
  const [hideNav, showHideNav] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    getGroupCredential(group.id);
  };

  const handleClose = () => {
    setOpen(false);
    disconnect && disconnect();
  };

  return (
    <>
      {openButton && cloneElement(openButton, { onClick: handleClickOpen })}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="stream-dialog"
        className='streamDialogBlock'
        classes={{ container: 'streamDialogConteiner' }}
        onClick={() => {
          !hideNav && showHideNav(true);
        }}
      >
        <DialogContent className="streamDialogContent">
          {room && mainParticipant ? 
            [
              <MainParticipant key="main" />,
              <ParticipantList key="other" owner={group.owner} />,
              hideNav && 
                <MenuBar
                  key="menuBar"
                  disconnect={handleClose}
                  showHideNav={() => showHideNav(false)}
                  owner={group.is_owner || group.owner.id == user.id} 
                />
            ]
          : 
            <Wait
              src={group.image.url}
              status={group.status}
              owner={group.owner.full_name}
              name={group.name}
              showHideNav={showHideNav}
              group={group}
            />
          }
        </DialogContent>
      </Dialog>
    </>
  );
}

export default inject('groupsModel', 'twilioModel', 'userModel')(observer(TwilioPage));
