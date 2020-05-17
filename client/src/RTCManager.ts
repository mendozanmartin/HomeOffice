import IUser from "./models/IUser";
import IAnswerCall from "./models/IAnswer";

class RTCManager {

    public peerConnection: RTCPeerConnection;
    private readonly audioId: string = "game-audio";
    private localStream: any;
    private audio1: any = document.querySelector('#local-audio');
    private audio2: any = document.querySelector('#remote-audio');

    constructor() {
        this.peerConnection = new RTCPeerConnection();

        this.peerConnection.addEventListener('track', (e) => {
            if (this.audio2.srcObject !== e.streams[0]) {
                this.audio2.srcObject = e.streams[0];
                console.log('Received remote stream');
            }
        });
    }

    requestAudio(): Promise<void> {
        return new Promise((resolve, reject) => {
            navigator.getUserMedia({ audio: true, video: false }, (stream) => {

                this.localStream = stream;
                const audioTracks = this.localStream.getAudioTracks();
                if (audioTracks.length > 0) {
                    console.log(`Using Audio device: ${audioTracks[0].label}`);
                }
                this.localStream.getTracks().forEach(track => this.peerConnection.addTrack(track, this.localStream));
                (this.audio1 as any).srcObject = stream;
                console.log('Adding Local Stream to peer connection');

                resolve();
            }, error => {
                console.log(error);
                reject(error);
            })
        })
    }

    makeOffer(): Promise<RTCSessionDescriptionInit> {
        return this.peerConnection.createOffer();
    }

    setupLocalDescription(offer: RTCSessionDescriptionInit) {
        return this.peerConnection.setLocalDescription(offer);
    }

    async setupRemoteRemoveDescription(offer: RTCSessionDescriptionInit) {
        const answer = new RTCSessionDescription(offer)
        await this.peerConnection.setRemoteDescription(answer);
        return answer
    }

    createAnswer(): Promise<RTCSessionDescriptionInit> {
        return this.peerConnection.createAnswer();
    }

    joinCall(call: IAnswerCall) {
        return this.peerConnection.setRemoteDescription(new RTCSessionDescription(call.answer));
    }
}

export default RTCManager;