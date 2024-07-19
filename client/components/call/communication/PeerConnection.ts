import MediaDevice from './MediaDevice';
import Emitter from './Emitter';
import socket from './socket';

const PeerConnection_CONFIG = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };

class PeerConnection extends Emitter {
  peerConnection: RTCPeerConnection;
  mediaDevice: MediaDevice;
  friendID: String;
  /**
     * Create a PeerConnection.
     * @param {String} friendID - ID of the friend you want to call.
     */
  constructor(friendID) {
    super();
    this.peerConnection = new RTCPeerConnection(PeerConnection_CONFIG);

    this.peerConnection.onicecandidate = (event) => socket.emit('call', {
      to: this.friendID,
      candidate: event.candidate
    });
    
    this.peerConnection.ontrack = (event) => this.emit('peerStream', event.streams[0]);

    this.mediaDevice = new MediaDevice();
    
    this.friendID = friendID;
  }

  /**
   * Starting the call
   * @param {Boolean} isCaller
   */
  start(isCaller) {
    this.mediaDevice.on('stream', (stream) => {
        stream.getTracks().forEach((track) => {
          this.peerConnection.addTrack(track, stream);
        });
        this.emit('localStream', stream);
        if (isCaller) socket.emit('request', { to: this.friendID });
        else this.createOffer();
    }).start();

    return this;
  }

  /**
   * Stop the call
   * @param {Boolean} isStarter
   */
  stop(isStarter) {
    if (isStarter) {
      socket.emit('end', { to: this.friendID });
    }
    this.mediaDevice.stop();
    this.peerConnection.close();
    this.peerConnection = null;
    this.off();
    return this;
  }

  createOffer() { /** Request a peer connection  */
    this.peerConnection.createOffer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  createAnswer() { /** Answer a peer connection  */
    this.peerConnection.createAnswer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  /**
   * @param {RTCLocalSessionDescriptionInit} desc - Session description
   */
  getDescription(desc) {
    this.peerConnection.setLocalDescription(desc);
    socket.emit('call', { to: this.friendID, sdp: desc });
    return this;
  }

  /**
   * @param {RTCSessionDescriptionInit} sdp - Session description
   * One end of a connection—or potential connection—and how it's configured. 
   * Each RTCSessionDescription consists of session descriptors describing an offer or answer negotiation process.
   */
  setRemoteDescription(sdp) {
    const rtcSdp = new RTCSessionDescription(sdp);
    this.peerConnection.setRemoteDescription(rtcSdp);
    return this;
  }

  /**
   * @param {RTCIceCandidateInit} candidate - ICE Candidate
   *  A candidate Internet Connectivity Establishment (ICE) configuration  is used to establish an RTCPeerConnection
   */
  addIceCandidate(candidate) {
    if (candidate) {
      const iceCandidate = new RTCIceCandidate(candidate);
      this.peerConnection.addIceCandidate(iceCandidate);
    }
    return this;
  }
}

export default PeerConnection;
