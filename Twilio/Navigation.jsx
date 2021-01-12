import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';

import VideoCamIcon from '../../res/iconComp/VideoCamIcon';
import VideoCamNoIcon from '../../res/iconComp/VideoCamNoIcon';
import OnLineConnect from '../../res/iconComp/OnLineConnect';
import MicIcon from '../../res/iconComp/MicIcon';
import MicNoIcon from '../../res/iconComp/MicNoIcon';
import VolumeIcon from '../../res/iconComp/VolumeIcon';
import VolumeNoIcon from '../../res/iconComp/VolumeNoIcon';
import LeptopNextIcon from '../../res/iconComp/LeptopNextIcon';
import AttachmentIcon from '../../res/iconComp/AttachmentIcon';

const NavButton = props => {
  const { children, click = () => { } } = props;

  return (
    <div className="navButton" onClick={() => click()}>
      {children}
    </div>
  )
};

const Navigation = props => {
  const {
    showHideNav, owner = false,
    twilioModel: { 
      mic, videoScreen, sound,
    }
  } = props;

  useEffect(() => {
  });

  return (
    <div className="navBlock">
      <div className="navTitle"></div>
      {owner ? 
        <div className="ownerButtons">
          {videoScreen ? 
            <NavButton key="cameraOn" click={() => {}}>
              <VideoCamIcon />
            </NavButton>
          :
            <NavButton key="cameraOff" click={() => {}}>
              <VideoCamNoIcon />
            </NavButton>
          }
          <NavButton key="phome" click={() => {}}>
            <OnLineConnect />
          </NavButton>
          {mic ? 
            <NavButton key="micOn" click={() => {}}>
              <MicIcon />
            </NavButton>
          :
            <NavButton key="micOff" click={() => {}}>
              <MicNoIcon />
            </NavButton>
          }
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

        </div>
      }
      <div className="areaClick" onClick={(e) => showHideNav(e)} />
    </div>
  )
}

export default inject('twilioModel')(observer(Navigation));
