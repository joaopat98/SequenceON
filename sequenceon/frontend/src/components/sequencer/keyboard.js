import React, { Component } from "react";
import MIDISounds from "midi-sounds-react";
import Key from "./key";

class Keyboard extends Component {
    constructor(props) {
        super(props);
        if (this.props.drums)
            this.drums = [7, 17, 14, 35, 56, 46, 65, 50, 30, 74, 110, 80, 90];
        this.playing = false;
    }

    startPlaying = (ev, pitch) => {
        this.playing = true;
        let key = ev.currentTarget;
        document.onmouseup = () => {
            this.playing = false;
            if (this.envelope)
                this.envelope.cancel();
            document.onmouseup = null;
            if (key.classList.contains("pressed"))
                key.classList.remove("pressed");
        }
        this.playNote(ev, pitch)
    }

    playNote = (ev, pitch) => {
        if (this.props.drums) {
            this.midiSounds.playDrumsNow([this.drums[this.drums.length - pitch - 1]]);
        }
        else {
            let envelope = this.midiSounds.player.queueWaveTable(this.midiSounds.audioContext, this.midiSounds.equalizer.input, window[this.midiSounds.player.loader.instrumentInfo(this.props.instrumentId).variable], 0, pitch + 24, 123456789, 1)
            this.envelope = envelope;
            let key = ev.currentTarget;
            key.classList.add("pressed");
            key.onmouseleave = () => {
                envelope.cancel();
                key.classList.remove("pressed");
                key.onmouseleave = null;
            }
        }
    }

    keyEnter = (ev, pitch) => {
        if (this.playing) {
            this.playNote(ev, pitch)
        }
    }

    componentDidMount() {
        if (this.props.drums)
            this.drums.map(drum => this.midiSounds.cacheDrum(drum));
        else
            this.midiSounds.cacheInstrument(this.props.instrumentId);
    }

    render() {
        let arr = [];
        let kwfr = i => {
            return "calc(" + this.props.keyHeight + " * " + i + ")";
        }
        for (let i = (this.props.drums ? 13 : 7 * 12); i > 0; i--)
            arr.push(i - 1);
        return (

            <div ref={this.props.scrollRef} className="keyboard-container" style={{
                width: this.props.width,
                height: this.props.height
            }}>
                <div className="key-container">
                    {arr.map(i => (
                        <Key key={i} pitch={i} drums={this.props.drums} keyHeight={this.props.keyHeight} keyDown={this.startPlaying} keyEnter={this.keyEnter} />
                    ))}
                </div>
                <div hidden>
                    {this.props.drums ?
                        <MIDISounds
                            ref={(ref) => (this.midiSounds = ref)}
                            appElementName="root"
                            drums={this.drums}
                        />
                        :
                        <MIDISounds
                            ref={(ref) => (this.midiSounds = ref)}
                            appElementName="root"
                            instruments={[this.props.instrumentId]}
                        />
                    }
                </div>
            </div>
        )
    }
}

export default Keyboard;