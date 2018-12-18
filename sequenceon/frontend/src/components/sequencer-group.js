import React, { Component } from "react";
import Timer from "../timer";
import Sequencer from "./sequencer/sequencer";
import "./sequencer/sequencer.css";
import TimeLine from "./sequencer/timeline";

class SequencerGroup extends Component {
    constructor(props) {
        super(props);
        this.timer = new Timer(140, 32);
        this.timer.start()
        this.notes = {}
        this.props.instruments.forEach(instrument => {
            this.notes[instrument] = [];
        });
        this.state = {
            xlen: 32,
            selectedInstrument: this.props.instruments[0],
            solo: undefined
        }
    }

    loadNotes = event => {
        const input = event.target;
        if ('files' in input && input.files.length > 0) {
            this.readFileContent(input.files[0]).then(content => {
                console.log(this.notes);
                this.notes = JSON.parse(content);
                this.forceUpdate();
            }).catch(error => console.log(error));
        }
    }

    readFileContent(file) {
        const reader = new FileReader()
        return new Promise((resolve, reject) => {
            reader.onload = event => resolve(event.target.result)
            reader.onerror = error => reject(error)
            reader.readAsText(file)
        })
    }

    download = () => {
        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(this.notes)], { type: "application/json" });
        a.href = URL.createObjectURL(file);
        a.download = "notes.json";
        a.click();
    }

    selectSequencer = instrument => {
        this.setState({ selectedInstrument: instrument })
    }

    changeTimer = (bpm, xlen) => {
        if (bpm !== undefined)
            this.timer.setTime(bpm);
        if (xlen !== undefined) {
            this.timer.setRepeat(xlen);
            if (this.state.xlen !== xlen)
                this.setState({ xlen: xlen });
        }
    }

    setSolo = instrument => {
        this.setState({ solo: this.state.solo === instrument ? undefined : instrument });
    }

    render() {
        let hidden = [...this.props.instruments];
        hidden.splice(this.props.instruments.indexOf(this.state.selectedInstrument), 1)
        return (
            <div className="sequencer-window">
                <button onClick={this.download}>download</button>
                <input type="file" onChange={this.loadNotes} />
                <div className="hidden-sequencers">
                    {hidden.map(instrument => (
                        <Sequencer key={instrument} xlen={this.state.xlen} drums={instrument === "Drums"} instrument={instrument} notes={this.notes} height="10vh" width="10%" select={this.selectSequencer} setSolo={this.setSolo} solo={this.state.solo} timer={this.timer} show={false} />
                    ))}
                    <div className="sequencer-container hidden" >
                        <div className="add">ADD</div>
                    </div>
                </div>
                <div className="main-sequencer">
                    <Sequencer key={this.state.selectedInstrument} changeTimer={this.changeTimer} xlen={this.state.xlen} drums={this.state.selectedInstrument === "Drums"} instrument={this.state.selectedInstrument} notes={this.notes} height="70vh" width="80%" select={this.selectSequencer} setSolo={this.setSolo} solo={this.state.solo} timer={this.timer} show={true} />
                </div>
                <TimeLine timer={this.timer} changeTimer={this.changeTimer} />

            </div>
        )
    }
}

export default SequencerGroup;