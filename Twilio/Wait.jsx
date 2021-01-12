import React from 'react';
import OnLineConnect from '../../res/iconComp/OnLineConnect';
import Button from '../Button';

const Wait = props => {
  const { src, status, owner, name } = props;

  const disconnect = status == "active";
  const ended = status == "ended";

  const groupStatus = () => {
    switch (true) {
      case navigator.onLine && disconnect:
        return (
          <div>
            <div className="waitDisconnect">{owner}<br />is disconnected</div>
            <div className="waitConnection">connection...</div>
          </div>
        );

      case navigator.onLine && ended:
        return (
          <div>
            <div className="waitDisconnect">Group ended</div>
            <Button label="Ok" violetGradien className="waitButton" />
          </div>
        );

      case !navigator.onLine:
        return (
          <div className="waitInfo">
            <div className="waitDisconnect">Connection lost</div>
            <div className="waitConnection">connection...</div>
            <OnLineConnect />
          </div>
        );
    
      default:
        return <div className="waitMessage">waiting for the group start</div>
    }
  }

  return (
    <div className="waitBlock" style={{ color: "red" }}>
      <div className="waitTitle">{name}</div>
      <img src={src} className="waitImage" />
      {groupStatus()}
    </div>
  )
}

export default Wait;
