import { observable, decorate, action } from 'mobx';
import axios from 'axios';
import { isMobile } from 'react-device-detect';
import Video from 'twilio-video';

import { DEFAULT_VIDEO_CONSTRAINTS, twilioResolutionSettings } from '../const/twilio';

import { baseAPI } from '../const/settings';
import { authModel } from './auth';
import { groupsModel } from './groups';
import { userModel } from './user';

export class TwilioModel {
  constructor() {
    this.room = null;
    this.connecting = false;
    this.credential = null;
    this.selectedParticipant = null;
    this.dominantSpeaker = null;
    this.participants = [];
    this.roomState = 'disconnected';
    this.localTracks = [];
    this.isAudioAEnabled = true;
    this.mainParticipant = null;

    this.connectOptions = {
      bandwidthProfile: {
        video: {
          mode: 'collaboration',
          trackSwitchOffMode: 'detected',
          maxSubscriptionBitrate: 2400000,
          dominantSpeakerPriority: 'high',
          maxTracks: 3,
          renderDimensions: {
            high: { width: 1080, height: 720 },
            standard: { width: 1080, height: 720 },
            low: { width: 150, height: 150 }
          }
        }
      },
      audio: { name: 'microphone' },
      video: { name: 'camera', height: 600, frameRate: 24, width: 1000 },
      dominantSpeaker: true,
      networkQuality: { local: 1, remote: 1 },
      maxAudioBitrate: 16000,
      preferredVideoCodecs: [{ codec: 'VP8', simulcast: false }], // roomType !== 'peer-to-peer' && roomType !== 'go'
    };
  }

  getGroupCredential = id => {
    const setCredential = this.setCredential;
    const getGroupParticipants = groupsModel.getGroupParticipants;
    const createLocalTracks = this.createLocalTracks;

    const headers = { 
      "headers": {
        "accept": "application/json, text/plain, */*",
        "session-token": authModel.session_token
      }
    };
    axios.post(`${baseAPI}groups/${id}/credentials`, '', headers)
      .then(function (response) {
        setCredential(response.data);
        getGroupParticipants(id);
        createLocalTracks(response.data);
      })
      .catch(function (error) {
        console.log('error', error);
      })
  }

  setRoom = room => this.room = room;
  setConnecting = value => this.connecting = value;
  setCredential = data => this.credential = data;
  setSelectedParticipant = data => this.selectedParticipant = data;
  setRoomState = () => this.roomState = this.room.state || 'disconnected';
  setLocalTracks = localTracks => this.localTracks = localTracks;

  setMainParticipant = () => {
    console.log(' !!!!!! setMainParticipant !!!!! ');
    const { localParticipant } = this.room;
  
    // The participant that is returned is displayed in the main video area. Changing the order of the following
    // variables will change the how the main speaker is determined.
    const mainParticipant = this.selectedParticipant || this.dominantSpeaker || 
      (this.participants && this.participants[0]) || localParticipant;

    this.mainParticipant = mainParticipant;
  }

  getResolution = key => twilioResolutionSettings[key];

  createLocalTracks = (credential) => {
    const setLocalTracks = this.setLocalTracks;
    const twilioConnect = this.twilioConnect;

    Video.createLocalTracks({
      audio: true,
      video: true,
    }).then(localTracks => {
      setLocalTracks(localTracks);
      twilioConnect(credential, localTracks);
    });
  }

  twilioConnect = (credential, localTracks) => {
    const setConnecting = this.setConnecting;
    const setRoom = this.setRoom;
    const handleDominantSpeakerChanged = this.handleDominantSpeakerChanged;
    const handleParticipantDisconnected = this.handleParticipantDisconnected;
    const participantConnected = this.participantConnected;
    const setRoomState = this.setRoomState;
    const onTrackPublished = this.onTrackPublished;
    const setMainParticipant = this.setMainParticipant;

    setConnecting(true);
    Video.connect(credential.access_token, { ...this.connectOptions, name: credential.room_name, tracks: localTracks, })
      .then(newRoom => {
        console.log('newRoom', newRoom);
        setRoom(newRoom);
        const disconnect = () => newRoom.disconnect();

        // This app can add up to 13 'participantDisconnected' listeners to the room object, which can trigger
        // a warning from the EventEmitter object. Here we increase the max listeners to suppress the warning.
        // newRoom.setMaxListeners(15);
        setRoomState();
        setMainParticipant();

        newRoom
          .on('disconnected', setRoomState)
          .on('reconnected', setRoomState)
          .on('reconnecting', setRoomState);

        newRoom.once('disconnected', () => {
          // Reset the room only after all other `disconnected` listeners have been called.
          setTimeout(() => setRoom(null));
          window.removeEventListener('beforeunload', disconnect);

          if (isMobile) {
            window.removeEventListener('pagehide', disconnect);
          }
        });

        // @ts-ignore
        // window.twilioRoom = newRoom;

        newRoom.localParticipant.videoTracks.forEach(publication =>
          // All video tracks are published with 'low' priority because the video track
          // that is displayed in the 'MainParticipant' component will have it's priority
          // set to 'high' via track.setPriority()
          publication.setPriority('low')
        );

        newRoom.localParticipant.on('trackPublished', onTrackPublished);
        newRoom.on('dominantSpeakerChanged', handleDominantSpeakerChanged);
        newRoom.on('participantDisconnected', handleParticipantDisconnected);
        newRoom.on('participantConnected', participantConnected);

        setConnecting(false);

        // Add a listener to disconnect from the room when a user closes their browser
        window.addEventListener('beforeunload', disconnect);

        if (isMobile) {
          // Add a listener to disconnect from the room when a mobile user closes their browser
          window.addEventListener('pagehide', disconnect);
        }
      })
      .catch(error => {
        // onError(error);
        console.log('error', error);
        setConnecting(false);
      }
    );
  }

  onTrackPublished = publication => {
    console.log('localParticipant', this.room.localParticipant);
    console.log('trackPublished publication', publication);
    this.setMainParticipant();
  }

  setDominantSpeaker = speaker => {
    this.dominantSpeaker = speaker;
    console.log('this.dominantSpeaker', this.dominantSpeaker);
    this.setMainParticipant();
    if (this.dominantSpeaker) {
      this.setParticipants([
        this.dominantSpeaker,
        ...this.participants.filter(participant => participant.identity !== this.dominantSpeaker.identity),
      ]);
    }
  }

  handleDominantSpeakerChanged = (newDominantSpeaker) => {
    console.log('RUN handleDominantSpeakerChanged');
    if (newDominantSpeaker !== null) {
      this.setDominantSpeaker(newDominantSpeaker);
    }
  };

  // Since 'null' values are ignored, we will need to listen for the 'participantDisconnected'
  // event, so we can set the dominantSpeaker to 'null' when they disconnect.
  handleParticipantDisconnected = (participant) => {
    console.log('RUN handleParticipantDisconnected');
    if  (this.dominantSpeaker.identity === participant.identity) {
      this.setDominantSpeaker(null);
    }
    // this.setDominantSpeaker(prevDominantSpeaker => {
    //   return prevDominantSpeaker === participant ? null : prevDominantSpeaker;
    // });
    this.participantDisconnected(participant);
  };

  participantConnected = (participant) => {
    console.log('Run participantConnected');
    const currentPartisipants = this.participants.filter(p => p.identity !== participant.identity);
    this.setParticipants([...currentPartisipants, {...participant, publications: Array.from(participant.tracks.values())}]);
    this.setMainParticipant();
    participant.on('trackPublished', (publication) => this.publicationAdded(participant, publication));
    participant.on('trackUnpublished', (publication) => this.publicationRemoved(participant, publication));
  }

  participantDisconnected = (participant) => {
    this.setParticipants([...this.participants.filter(p => p.identity !== participant.identity)]);
  }

  setParticipants = participants => {
    this.participants = participants;
    // this.participants.forEach(participant => {
    //   participant.on('trackPublished', (publication) => this.publicationAdded(participant, publication));
    //   participant.on('trackUnpublished', (publication) => this.publicationRemoved(participant, publication));
    // })
  }

  publicationAdded = (participant, publication) => {
    console.log('RUN publicationAdded', participant.identity);
    let newParticipant = participant;
    const currentPublications = participant.publications || [];
    newParticipant.publications = [...currentPublications, publication];
    // const currentPartisipants = this.participants.filter(p => p.identity !== participant.identity);
    // -----

    console.log('userModel.user.id', userModel.user.id);
    this.dominantSpeaker = participant;
    console.log('this.dominantSpeaker', this.dominantSpeaker);

    // +++++
    // this.participants = [...currentPartisipants, newParticipant];
  }

  publicationRemoved = (participant, publication) => {
    console.log('RUN publicationRemoved');
    let newParticipant = participant;
    const currentPublications = participant.publications || [];
    newParticipant.publications = currentPublications.filter(p => p !== publication);
    const currentPartisipants = this.participants.filter(p => p.identity !== participant.identity);
    this.participants = [...currentPartisipants, newParticipant];
  }

  getLocalAudioTrack = (deviceId = null) => {
    const options = {};

    if (deviceId) {
      options.deviceId = { exact: deviceId };
    }

    Video.createLocalAudioTrack(options).then(newTrack => {
      const oldTracks = this.localTracks.filter(track => track?.kind === 'video') || [];
      this.setLocalTracks([...oldTracks, newTrack]);
    });
  }

  getLocalVideoTrack = (newOptions) => {
    const publicationAdded = this.publicationAdded;
    const options = {
      ...(DEFAULT_VIDEO_CONSTRAINTS),
      name: `camera-${Date.now()}`,
      ...newOptions,
    };

    const localParticipant = this.room.localParticipant;

    Video.createLocalVideoTrack(options)
      .then(newTrack => {
        const oldTracks = this.localTracks.filter(track => track?.kind === 'audio');
        this.setLocalTracks([...oldTracks, newTrack]);
        const publicationData = localParticipant.publishTrack(newTrack, { priority: 'high' });
        publicationData
          .then(publication => {
            console.log('####### publishTrack publishTrack publishTrack', publication);
            publicationAdded(localParticipant, publication);
          });
      });
  }

  removeLocalVideoTrack = (videoTrack) => {
    if (videoTrack) {
      videoTrack.stop();
      const oldTracks = this.localTracks.filter(track => track?.kind === 'audio');
      this.setLocalTracks([...oldTracks]);
    }
  }

  useToggleAudioEnabled = () => {
    const audioTrack = this.localTracks && this.localTracks.find(track => track.kind === 'audio');

    if (audioTrack) {
      audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
    }

    const audioTrackNew = this.localTracks && this.localTracks.find(track => track.kind === 'audio');
    const isEnabled = audioTrackNew ? audioTrackNew.isEnabled : false;

    this.isAudioAEnabled = isEnabled;
  }

  disconnect = () => {
    this.room.disconnect();
  }

  raiseHand = (data) => {
    console.log("raise hand event")
  }
}

decorate(TwilioModel, {
  connecting: observable,
  room: observable,
  credential: observable,
  selectedParticipant: observable,
  dominantSpeaker: observable,
  participants: observable,
  localTracks: observable,
  raiseHand: action,
  isAudioAEnabled: observable,
  mainParticipant: observable,
})

export const twilioModel = new TwilioModel();
