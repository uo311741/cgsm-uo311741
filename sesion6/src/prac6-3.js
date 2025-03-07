import adapter from 'webrtc-adapter';

let localStream,            // Local stream
    localPeerConnection,    // RTC local peer
    remotePeerConnection;   // RTC remote peer
const offerOptions = {        // The options to create the offer
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};

const localVideo = document.getElementById( 'localVideo' );
const remoteVideo = document.getElementById( 'remoteVideo' );
const startButton = document.getElementById( 'startButton' );
const callButton = document.getElementById( 'callButton' );
const hangupButton = document.getElementById( 'hangupButton' );

// Initial state of the buttons
startButton.disabled = false;
callButton.disabled = true;
hangupButton.disabled = true;

// Call handlers
startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;

function start() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
            localStream = stream;
            localVideo.srcObject = stream;
            startButton.disabled = true;
            callButton.disabled = false;
        })
        .catch(error => {
            console.error("Error al acceder a la cámara: ", error);
        });
}

function call() {
    callButton.disabled = true;
    hangupButton.disabled = false;
    
    const servers = null;
    localPeerConnection = new RTCPeerConnection(servers);
    localPeerConnection.onicecandidate = gotLocalIceCandidate;
    
    remotePeerConnection = new RTCPeerConnection(servers);
    remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
    remotePeerConnection.ontrack = gotRemoteTrack;
    
    localStream.getTracks().forEach(track => localPeerConnection.addTrack(track, localStream));
    
    localPeerConnection.createOffer(offerOptions).then(gotLocalDescription);
}

function hangup() {
    localPeerConnection.close();
    remotePeerConnection.close();
    localPeerConnection = null;
    remotePeerConnection = null;
    
    callButton.disabled = false;
    hangupButton.disabled = true;
}

function gotLocalDescription(description) {
    localPeerConnection.setLocalDescription(description);
    remotePeerConnection.setRemoteDescription(description);
    remotePeerConnection.createAnswer().then(gotRemoteDescription);
}

function gotRemoteDescription(description) {
    remotePeerConnection.setLocalDescription(description);
    localPeerConnection.setRemoteDescription(description);
}

function gotLocalIceCandidate(event) {
    if (event.candidate) {
        remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    }
}

function gotRemoteIceCandidate(event) {
    if (event.candidate) {
        localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    }
}

function gotRemoteTrack(event) {
    remoteVideo.srcObject = event.streams[0];
}
