import React, { Component } from "react";
import Grid from './grid';
import Keyboard from './keyboard';
import piano from "./Assets/Images/piano.png"
import guitar from "./Assets/Images/guitar.png"
import e_guitar from "./Assets/Images/electric guitar.png"
import harp from "./Assets/Images/harp.png"
import drums from "./Assets/Images/drums.png"
import bass from "./Assets/Images/bass.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { shallowEqual } from 'shouldcomponentupdate-children';

class Sequencer extends Component {
    constructor(props) {
        super(props);
        this.setInstrumentInfo();
        this.state = {
            instrument: this.props.instrument,
            show: this.props.show,
            username: "joaopat98",
            xlen: this.props.timer._repeat,
            bpm: this.props.timer.bpm,
            muted: false
        }
        this.keyboard = React.createRef();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowEqual(this.props, nextProps, this.state, nextState);
    }

    setInstrumentInfo = () => {
        switch (this.props.instrument) {
            case "Bass":
                this.instrumentId = 375;
                this.icon = bass;
                break;
            case "Piano":
                this.instrumentId = 0;
                this.icon = piano;
                break;
            case "Guitar":
                this.instrumentId = 244;
                this.icon = guitar;
                break;
            case "Electric Guitar":
                this.instrumentId = 318;
                this.icon = e_guitar;
                break;
            case "Harp":
                this.instrumentId = 500;
                this.icon = harp;
                break;
            case "Drums":
                this.icon = drums;
                break;
        }
    }

    showThis = () => {
        this.props.select(this.props.instrument);
    }

    scroll = s => {
        this.keyboard.current.scrollTop = s;
    }

    componentDidUpdate() {
        if (this.state.show !== this.props.show)
            this.setState({ show: this.props.show });
    }

    changeBPM = ev => {
        let val = Math.floor(ev.target.value.slice(0, 3));
        this.setState({ bpm: val === 0 ? undefined : val });
    }

    changeLength = ev => {
        let val = Math.floor(ev.target.value.slice(0, 4));
        this.setState({ xlen: val === 0 ? undefined : val });
    }

    setParams = () => {
        this.props.changeTimer(this.state.bpm, this.state.xlen);
    }

    mute = () => {
        this.setState({ muted: !this.state.muted });
    }

    render() {
        let isSolo = this.props.solo === this.props.instrument;
        return (
            <div className={"sequencer-container" + (!this.state.show ? " hidden" : "")}>
                {this.props.show ?
                    <div className="sequencer-header">
                        <img className="header-element instrument left" src={this.icon} />
                        <p className="header-element sec left">{this.state.instrument}</p>
                        <FontAwesomeIcon icon="user" className="header-element right" />
                        <p className="header-element sec">{this.state.username}</p>
                    </div> :
                    <div className="sequencer-header-small">
                        <img className="header-element instrument left" src={this.icon} />
                        <p className="header-element left">{this.state.username}</p>
                    </div>
                }
                {!this.props.show ?
                    <div className="sequencer-buttons-container">
                        <div className="sequencer-buttons">
                            <div title="mute/unmute this track" className="sequencer-button left" onClick={this.mute}>
                                {this.state.muted ? <FontAwesomeIcon icon="volume-off" /> : <FontAwesomeIcon icon="volume-up" />}
                            </div>
                            <div title="solo/unsolo this track" className={"sequencer-button" + (isSolo ? " selected" : "")} onClick={() => this.props.setSolo(this.props.instrument)}>
                                <FontAwesomeIcon icon="headphones" />
                            </div>
                            <div title="focus on this track" onClick={this.showThis} className="sequencer-button right">
                                <FontAwesomeIcon icon="window-maximize" />
                            </div>
                        </div>
                    </div>
                    : null}
                {this.props.show ? (
                    this.props.instrument !== "Drums" ?
                        <div className="sequencer">
                            <Keyboard scrollRef={this.keyboard} drums={false} keyHeight="20px" height="100%" width="10%" instrumentId={this.instrumentId} />
                            <Grid addNote={this.props.addNote} onScroll={this.scroll} muted={this.state.muted} setSolo={this.props.setSolo} solo={this.props.solo} show={true} drums={false} notes={this.props.notes} xlen={this.props.xlen} timer={this.props.timer} bpm={120} cellWidth="30px" cellHeight="20px" height="100%" width="90%" instrumentId={this.instrumentId} instrument={this.props.instrument} />
                        </div>
                        :
                        <div className="sequencer">
                            <Keyboard scrollRef={this.keyboard} drums={true} keyHeight="41px" height="100%" width="10%" instrumentId={this.instrumentId} />
                            <Grid addNote={this.props.addNote} onScroll={this.scroll} muted={this.state.muted} setSolo={this.props.setSolo} solo={this.props.solo} show={true} drums={true} notes={this.props.notes} xlen={this.props.xlen} timer={this.props.timer} bpm={120} cellWidth="30px" cellHeight="41px" height="100%" width="90%" instrumentId={this.instrumentId} instrument={this.props.instrument} />
                        </div>
                )
                    :
                    <div hidden className="sequencer">
                        <Grid onScroll={this.scroll} muted={this.state.muted} setSolo={this.props.setSolo} solo={this.props.solo} show={false} notes={this.props.notes} xlen={this.props.xlen} drums={this.props.instrument === "Drums"} timer={this.props.timer} bpm={120} cellWidth="30px" cellHeight="20px" height="100%" width="90%" instrumentId={this.instrumentId} instrument={this.props.instrument} />
                    </div>
                }
            </div >
        );
    }
}

export default Sequencer;