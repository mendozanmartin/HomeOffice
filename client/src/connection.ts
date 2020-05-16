

class Audio {

    private readonly audioId: string;

    constructor(audioId: string) {
        this.audioId = audioId;
    }

    public Initialize() {
        navigator.getUserMedia({ audio: true }, this.streamMedia, this.streamMediaError);
    }

    public Destroy() {

    }

    private streamMedia = (stream: MediaStream) => {
        // const audioTracks = stream.getAudioTracks();
        const audio = document.getElementById(this.audioId) as HTMLAudioElement;
        audio.srcObject = stream;
    }

    private streamMediaError = (error: any) => {
        console.log(error);
    }
}

export default Audio;