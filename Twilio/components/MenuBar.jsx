import React from 'react';
import { inject, observer } from 'mobx-react';

import ToggleAudioButton from './ToggleAudioButton';
import ToggleVideoButton from './ToggleVideoButton';

import Button from '../../Button';

import OnLineConnect from '../../../res/iconComp/OnLineConnect';
import VolumeIcon from '../../../res/iconComp/VolumeIcon';
import VolumeNoIcon from '../../../res/iconComp/VolumeNoIcon';
import LeptopNextIcon from '../../../res/iconComp/LeptopNextIcon';
import AttachmentIcon from '../../../res/iconComp/AttachmentIcon';
import HandIcon from '../../../res/iconComp/HandIcon';
import ReportIcon from '../../../res/iconComp/ReportIcon';
import StreamLictIcon from '../../../res/iconComp/StreamLictIcon';

const NavButton = props => {
  const { 
      children, 
      click = () => { }, } = props;

  return (
    <div className="navButton" onClick={() => click()}>
      {children}
    </div>
  )
};

const MenuBar = (props) => {
  const {
    group, 
    disconnect,
    owner = true,
    sound = true,
    twilioModel: { roomState, raiseHand },
    groupsModel: { leaveGroup},
    showHideNav
  } = props;

  const isReconnecting = roomState === 'reconnecting';

  return (
    <div className="navBlock">
      <div className="navTitle"></div>
      {owner ? 
        <div className="ownerButtons">
          <ToggleVideoButton disabled={isReconnecting} />
          <NavButton key="phone" click={() => disconnect()}>
            <OnLineConnect />
          </NavButton>
          <ToggleAudioButton disabled={isReconnecting} />
          {sound ? 
            <NavButton key="soundOn" click={() => {}}>
              <VolumeIcon />
            </NavButton> 
          :
            <NavButton key="soundOff" click={() => {}}>
              <VolumeNoIcon />
            </NavButton> 
          }
          <NavButton key="laptop" click={() => {}}>
            <LeptopNextIcon />
          </NavButton>
          <NavButton key="attach" click={() => {}}>
            <AttachmentIcon />
          </NavButton>
        </div>
      :
        <div className="regularButtons">
          <NavButton key="heandicon" click={() => raiseHand("me")}>
            <HandIcon />
          </NavButton>
          <NavButton key="attach" click={() => {}}>
            <AttachmentIcon />
          </NavButton>
          <NavButton key="streamList" click={() => {}}>
            <StreamLictIcon />
          </NavButton>
          <NavButton key="report" click={() => {}}>
            <ReportIcon />
          </NavButton>
          <Button
            label="Leave This Group"
            redGradient width100
            onClick={() => leaveGroup({ id: group.id, reasone: 'leave button' })}
          />
        </div>
      }
      <div className="areaClick" onClick={() => showHideNav(false)} />
    </div>
  );
}

export default inject('groupsModel', 'twilioModel')(observer(MenuBar));
