import React, {Component} from "react";
import Note from "./note";
import MIDISounds from "midi-sounds-react";
import GridBackground from "./grid-background";

import {shallowEqual} from 'shouldcomponentupdate-children';
import Caret from "./caret";

class Grid extends Component {
    constructor(props) {
        super(props);
        if (this.props.drums)
            this.drums = [7, 17, 14, 35, 56, 46, 65, 50, 30, 74, 110, 80, 90];
        this.state = {
            selectedNotes: [],
            notes: this.props.notes[this.props.instrument],
            noteSize: 1,
            caret: 0
        }
        this.shiftState = false;
        this.removeNotes = this.removeNotes.bind(this);
    }

    static getDerivedStateFromProps(props) {
        return {notes: props.notes[props.instrument]};
    }

    receiveUpdate = data => {
        switch (data.action) {
            case "add":
                data.notes.forEach(note => {
                    let notes = [...this.state.notes, {x: note.x, y: note.y, length: note.length}];
                    this.setState({notes: notes});
                });
                break;
            case "remove":
                let notes = this.state.notes.slice();
                for (let i = 0; i < this.state.selectedNotes.length; i++) {
                    let j = notes.indexOf(this.state.selectedNotes[i]);
                    notes.splice(j, 1);
                }
                this.setState({notes: notes, selectedNotes: []});
                break;
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        return shallowEqual(this.props, nextProps, this.state, nextState);
    }

    addNote = (x, y, length) => {
        length = length !== undefined ? length : this.state.noteSize;
        this.props.addNote({x: x, y: y, length: length}, this.props.instrument);
        let notes = [...this.state.notes, {x: x, y: y, length: length}];
        this.setState({notes: notes});
    }

    removeNotes = ev => {
        if (String.fromCharCode(ev.keyCode) === ".") {
            let notes = this.state.notes.slice();
            for (let i = 0; i < this.state.selectedNotes.length; i++) {
                let j = notes.indexOf(this.state.selectedNotes[i]);
                notes.splice(j, 1);
            }
            this.props.notes[this.props.instrument] = notes;
            this.props.removeNotes(this.state.selectedNotes, this.props.instrument);
            this.setState({notes: notes, selectedNotes: []});
        }
    }

    selectNote = (ev, note, selected) => {
        if (note !== undefined && !selected) {
            if (this.shiftState) {
                this.setState(prevState => ({
                    selectedNotes: [...prevState.selectedNotes, note]
                }));
            } else {
                this.setState({selectedNotes: [note,]});
            }
        } else if (!ev.target.classList.contains("note")) {
            this.setState({selectedNotes: []})
        }
    }

    changeLen = (note, length) => {
        let i = this.state.notes.indexOf(note)
        let notes = this.state.notes.slice();
        notes[i].length = length;
        this.setState({notes: notes, noteSize: length});
    }

    updateShiftState = ev => {
        if (ev.keyCode === 16) {
            this.shiftState = ev.type === "keydown"
        }
    }

    componentDidMount() {
        if (this.props.drums)
            this.drums.map(drum => this.midiSounds.cacheDrum(drum));
        document.addEventListener("click", this.selectNote);
        document.addEventListener("keydown", this.removeNotes);
        document.addEventListener("keyup", this.updateShiftState);
        document.addEventListener("keydown", this.updateShiftState);
        this.props.timer.registerCallback(this.playNotes);
        this.props.listeners[this.props.instrument] = this.receiveUpdate;
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.selectNote);
        document.removeEventListener("keydown", this.removeNotes);
        document.removeEventListener("keyup", this.updateShiftState);
        document.removeEventListener("keydown", this.updateShiftState);
        this.props.timer.removeCallback(this.playNotes);
    }

    playNotes = cur => {
        if (!this.props.muted && (this.props.solo === undefined || this.props.solo === this.props.instrument)) {
            let notes = this.state.notes.filter(note => note.x === cur);
            if (this.drums) {
                let drums = notes.map(note => this.drums[this.drums.length - note.y - 1]);
                this.midiSounds.playDrumsNow(drums);
            } else {
                notes = notes.map(note => {
                    return {pitch: 7 * 12 + 23 - note.y, duration: this.props.timer.timeUnits(note.length)}
                });
                notes.forEach(note => {
                    this.midiSounds.playChordNow(this.props.instrumentId, [note.pitch], note.duration);
                })
            }
        }
    }

    render() {

        let xarr = [];
        let yarr = [];
        for (let i = 0; i < this.props.xlen; i++)
            xarr.push(i);
        for (let i = 0; i < (this.props.drums ? 13 : 7 * 12); i++)
            yarr.push(i);
        return (
            <div onScroll={ev => this.props.onScroll(ev.target.scrollTop)} className="grid-container"
                 style={{height: this.props.height, width: this.props.width}}>
                {this.props.show ?
                    <div>
                        <div className="grid-empty"
                             style={{height: "calc(" + (this.props.drums ? 13 : 7 * 12) + " * " + this.props.cellHeight + ")"}}/>
                        <GridBackground drums={this.props.drums} key="backGrid" xlen={this.props.xlen}
                                        ylen={this.props.drums ? 13 : 7 * 12} cellWidth={this.props.cellWidth}
                                        cellHeight={this.props.cellHeight} addNote={this.addNote}/>
                    </div>
                    : null
                }
                {this.props.show ?
                    <div className="notes" style={{
                        width: "2px",
                        height: "calc(" + (this.props.drums ? 13 : 7 * 12) + " * " + this.props.cellHeight + ")"
                    }}>
                        {this.state.notes.filter(note => note.x < this.props.timer._repeat).map(note => {
                            return <Note key={Math.floor(Math.random() * 1000000)}
                                         onClick={this.selectNote}
                                         cellHeight={this.props.cellHeight}
                                         cellWidth={this.props.cellWidth}
                                         note={note}
                                         changeLen={this.changeLen}
                                         select={this.selectNote}
                                         selected={this.state.selectedNotes.indexOf(note) !== -1}/>
                        })}
                        <Caret timer={this.props.timer} cellWidth={this.props.cellWidth}/>
                    </div>
                    : null
                }
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

export default Grid;