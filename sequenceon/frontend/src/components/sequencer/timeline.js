import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ScrollBar from "./scrollbar";

class TimeLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            length: this.props.timer._repeat,
            bpm: this.props.timer.bpm,
            playing: true,
        }
    }

    changeBPM = ev => {
        let val = Math.floor(ev.target.value.slice(0, 3));
        this.setState({ bpm: val === 0 ? undefined : val });
    }

    changeLength = ev => {
        console.log(this.state);
        let val = Math.floor(ev.target.value.slice(0, 4));
        this.setState({ length: val === 0 ? undefined : val });
    }

    setParams = () => {
        this.props.changeTimer(this.state.bpm, this.state.length);
    }

    togglePlay = () => {
        let play = !this.state.playing;
        if (play)
            this.props.timer.start();
        else
            this.props.timer.stop();
        this.setState({ playing: play });
    }

    render() {
        return (
            <div className="timeline-container">
                <div className="timeline-element square" onClick={this.togglePlay}>
                    <FontAwesomeIcon icon={this.state.playing ? "pause" : "play"} />
                </div>
                <div className="timeline-element">
                    <p className="timeline-text">Length:</p>
                    <input className="timeline-input" type="number" value={this.state.length} onChange={this.changeLength} />
                    <p className="timeline-text">BPM:</p>
                    <input className="timeline-input" type="number" value={this.state.bpm} onChange={this.changeBPM} />
                    <button className="timeline-text" onClick={this.setParams}>Set</button>
                </div>
                <ScrollBar timer={this.props.timer} />
            </div>
        )
    }
}

export default TimeLine;