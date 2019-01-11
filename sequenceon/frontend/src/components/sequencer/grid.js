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
            caret: 0,
            mouseState: undefined,
        };
        this.baseLen = parseInt(this.props.cellWidth.substring(0, this.props.cellWidth.length - 2));
        this.baseHeight = parseInt(this.props.cellHeight.substring(0, this.props.cellHeight.length - 2));
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
                for (let i = 0; i < data.notes.length; i++) {
                    let removing = data.notes[i];
                    let j = this.state.notes.findIndex(note => (note.x === removing.x && note.y === removing.y));
                    this.state.notes.splice(j, 1);
                    this.forceUpdate()
                }
                break;
            case "change_length":
                for (let i = 0; i < data.notes.length; i++) {
                    let change = data.notes[i];
                    let j = this.state.notes.findIndex(note => (note.x === change.x && note.y === change.y));
                    let notes = this.state.notes.slice();
                    notes[j].length = change.length;
                    this.setState({notes: notes});
                }
                break;
            case "offset":
                for (let i = 0; i < data.notes.length; i++) {
                    let change = data.notes[i];
                    let j = this.state.notes.findIndex(note => (note.x === change.x && note.y === change.y));
                    let notes = this.state.notes.slice();
                    notes[j].x += data.offsetX;
                    notes[j].y += data.offsetY;
                    this.setState({notes: notes});
                }
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
    };

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
    };

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
    };

    changeLen = (note, length, selected) => {
        if (selected) {
            let offset = length - note.length;
            this.state.selectedNotes.forEach(n => {
                n.length = Math.max(1, n.length + offset);
                this.props.changeLen(n, this.props.instrument)
            });
            this.forceUpdate()
        } else {
            let i = this.state.notes.indexOf(note);
            let notes = this.state.notes.slice();
            notes[i].length = length;
            this.setState({notes: notes, noteSize: length});
            this.props.changeLen(notes[i], this.props.instrument);
        }
    };

    updateShiftState = ev => {
        if (ev.keyCode === 16) {
            this.shiftState = ev.type === "keydown"
        }
    };

    copyNotes = () => {
        if (this.props.show && this.props.editable) {
            this.copiedNotes = this.state.selectedNotes;
            console.log(this.copiedNotes);
        }
    };

    pasteNotes = () => {
        if (this.props.show && this.props.editable) {
            let min = Math.min(...this.copiedNotes.map(note => note.x));
            let offset = this.props.timer.cur - min;
            let newNotes = this.copiedNotes.map(note => {
                this.props.addNote({x: note.x + offset, y: note.y, length: note.length}, this.props.instrument);
                return {x: note.x + offset, y: note.y, length: note.length};
            });
            newNotes = [...this.state.notes, ...newNotes];
            this.setState({notes: newNotes})
        }
    };

    componentDidMount() {
        if (this.props.drums)
            this.drums.map(drum => this.midiSounds.cacheDrum(drum));
        document.addEventListener("click", this.selectNote);
        if (this.props.editable) {
            document.addEventListener("copy", this.copyNotes);
            document.addEventListener("paste", this.pasteNotes.bind(this));
            document.addEventListener("keydown", this.removeNotes);
            document.addEventListener("keyup", this.updateShiftState);
            document.addEventListener("keydown", this.updateShiftState);
        }
        this.props.timer.registerCallback(this.playNotes);
        this.props.listeners[this.props.instrument] = this.receiveUpdate.bind(this);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.selectNote);
        if (this.props.editable)
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
    };

    startSelection = ev => {
        let rect = ev.currentTarget.getBoundingClientRect();
        this.baseX = ev.clientX - rect.x + ev.currentTarget.scrollLeft;
        this.baseY = ev.clientY - rect.y + ev.currentTarget.scrollTop;
        ev.currentTarget.addEventListener("mousemove", this.updateSelection);
        this.wasShift = this.shiftState;
        this.prevNotes = this.state.selectedNotes;
    };

    endSelect = ev => {

        ev.currentTarget.removeEventListener("mousemove", this.updateSelection);
        if (this.state.mouseState === "selecting") {
            let baseLen = parseInt(this.props.cellWidth.substring(0, this.props.cellWidth.length - 2));
            let baseHeight = parseInt(this.props.cellHeight.substring(0, this.props.cellHeight.length - 2));
            let s = {
                x1: Math.floor(Math.min(this.state.baseX, this.state.x) / baseLen),
                x2: Math.ceil(Math.max(this.state.baseX, this.state.x) / baseLen),
                y1: Math.floor(Math.min(this.state.baseY, this.state.y) / baseHeight),
                y2: Math.ceil(Math.max(this.state.baseY, this.state.y) / baseHeight),
            };
            let notes;
            if (this.wasShift) {
                notes = this.state.notes.filter(note => {
                    return s.x1 <= note.x + note.length - 1 && s.x2 > note.x && s.y1 <= note.y && s.y2 > note.y && this.prevNotes.indexOf(note) === -1;
                });
                notes = notes.concat(this.prevNotes);
            } else {
                notes = this.state.notes.filter(note => {
                    return s.x1 <= note.x + note.length - 1 && s.x2 > note.x && s.y1 <= note.y && s.y2 > note.y;
                });
            }

            this.setState({mouseState: undefined, selectedNotes: notes});
        }
    };

    holdNote = ev => {
        if (this.props.editable) {
            let rect = ev.currentTarget.getBoundingClientRect();
            this.pos = {x: rect.x, y: rect.y};
            let elem = ev.currentTarget;

            let startDrag = () => {
                elem.removeEventListener("mousemove", startDrag);
                this.setState({mouseState: "dragging"});
            };
            this.offsetX = 0;
            this.offsetY = 0;
            this.selectedNotes = JSON.parse(JSON.stringify(this.state.selectedNotes));
            elem.addEventListener("mousemove", startDrag.bind(this));
        }
    };

    dragNotes = ev => {
        let offsetX = 0;
        let offsetY = 0;
        if (ev.clientX > this.pos.x + this.baseLen) {
            offsetX = 1;
            this.pos.x += this.baseLen;
        } else if (ev.clientX < this.pos.x) {
            offsetX = -1;
            this.pos.x -= this.baseLen;
        }

        if (ev.clientY > this.pos.y + this.baseHeight) {
            offsetY = 1;
            this.pos.y += this.baseHeight;
        } else if (ev.clientY < this.pos.y) {
            offsetY = -1;
            this.pos.y -= this.baseHeight;
        }

        if (offsetX !== 0 || offsetY !== 0) {
            this.offsetX += offsetX;
            this.offsetY += offsetY;
            this.state.selectedNotes.forEach(note => {
                note.x += offsetX;
                note.y += offsetY;
            });
            this.forceUpdate();
        }
    };

    stopDragging = () => {
        this.props.offsetNotes(this.selectedNotes, this.offsetX, this.offsetY, this.props.instrument);
        this.setState({mouseState: undefined})
    };


    updateSelection = ev => {
        let rect = ev.currentTarget.getBoundingClientRect();
        let notes;
        let baseLen = parseInt(this.props.cellWidth.substring(0, this.props.cellWidth.length - 2));
        let baseHeight = parseInt(this.props.cellHeight.substring(0, this.props.cellHeight.length - 2));
        let x = ev.clientX - rect.x + ev.currentTarget.scrollLeft;
        let y = ev.clientY - rect.y + ev.currentTarget.scrollTop;
        console.log(x);
        let s = {
            x1: Math.floor(Math.min(this.baseX, x) / baseLen),
            x2: Math.ceil(Math.max(this.baseX, x) / baseLen),
            y1: Math.floor(Math.min(this.baseY, y) / baseHeight),
            y2: Math.ceil(Math.max(this.baseY, y) / baseHeight),
        };
        if (this.wasShift) {
            notes = this.state.notes.filter(note => {
                return s.x1 <= note.x + note.length - 1 && s.x2 > note.x && s.y1 <= note.y && s.y2 > note.y && this.prevNotes.indexOf(note) === -1;
            });
            notes = notes.concat(this.prevNotes);
        } else {
            notes = this.state.notes.filter(note => {
                return s.x1 <= note.x + note.length - 1 && s.x2 > note.x && s.y1 <= note.y && s.y2 > note.y;
            });
        }

        this.setState({
            mouseState: "selecting",
            baseX: this.baseX,
            baseY: this.baseY,
            x: x,
            y: y,
            selectedNotes: notes
        })
    };

    render() {
        let rect;
        if (this.state.mouseState === "selecting") {
            let x = Math.min(this.state.baseX, this.state.x);
            let y = Math.min(this.state.baseY, this.state.y);
            let w = Math.max(this.state.baseX, this.state.x) - x;
            let h = Math.max(this.state.baseY, this.state.y) - y;
            rect = {x: x, y: y, w: w, h: h};
        }
        let xarr = [];
        let yarr = [];
        for (let i = 0; i < this.props.xlen; i++)
            xarr.push(i);
        for (let i = 0; i < (this.props.drums ? 13 : 7 * 12); i++)
            yarr.push(i);
        return (
            <div onMouseDown={this.startSelection} onMouseUp={this.endSelect}
                 onScroll={ev => this.props.onScroll(ev.target.scrollTop)} className="grid-container"
                 style={{height: this.props.height, width: this.props.width}}>
                {this.props.show ?
                    <div>
                        <div className="grid-empty"
                             style={{height: "calc(" + (this.props.drums ? 13 : 7 * 12) + " * " + this.props.cellHeight + ")"}}/>
                        <GridBackground editable={this.props.editable} drums={this.props.drums} key="backGrid"
                                        xlen={this.props.xlen}
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
                            return <Note editable={this.props.editable}
                                         holdNote={this.holdNote}
                                         key={Math.floor(Math.random() * 1000000)}
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

                {this.state.mouseState !== undefined ? (
                    <div className="select-area"
                         onMouseMove={this.state.mouseState === "selecting" ? this.updateSelection : this.dragNotes}
                         onMouseUp={this.state.mouseState === "dragging" ? this.stopDragging : undefined}
                         style={{
                             width: "calc(" + this.props.xlen + " * " + this.props.cellWidth + ")",
                             height: "calc(" + yarr.length + " * " + this.props.cellHeight + ")"
                         }}>
                        {this.state.mouseState === "selecting" ? (
                            <div className="selection"
                                 style={{left: rect.x, top: rect.y, width: rect.w + "px", height: rect.h + "px"}}/>
                        ) : null}
                    </div>
                ) : null}
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