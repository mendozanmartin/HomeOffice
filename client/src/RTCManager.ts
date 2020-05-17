import IUser from "./models/IUser";
import IAnswerCall from "./models/IAnswer";

class RTCManager {

    private peerConnection: RTCPeerConnection;
    private readonly audioId: string = "game-audio";

    constructor() {
        this.peerConnection = new RTCPeerConnection();
    }

    requestAudio(): Promise<void> {
        return new Promise((resolve, reject) => {
            navigator.getUserMedia({ audio: true }, (stream) => {
                for (const track of stream.getTracks()) {
                    this.peerConnection.addTrack(track);
                }
                resolve();
            }, error => {
                reject(error);
            })
        })
    }

    makeOffer(): Promise<RTCSessionDescriptionInit> {
        return this.peerConnection.createOffer();
    }

    setupLocalDescription(offer: RTCSessionDescriptionInit) {
        return this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    }

    setupRemoteRemoveDescription(offer: RTCSessionDescriptionInit) {
        return this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    }

    createAnswer(): Promise<RTCSessionDescriptionInit> {
        return this.peerConnection.createAnswer();
    }

    joinCall(call: IAnswerCall) {
        return this.peerConnection.setRemoteDescription(new RTCSessionDescription(call.answer));
    }
}

export default RTCManager;