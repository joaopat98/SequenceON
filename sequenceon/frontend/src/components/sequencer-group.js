import React, {Component} from "react";
import Timer from "../timer";
import Sequencer from "./sequencer/sequencer";
import "./sequencer/sequencer.css";
import TimeLine from "./sequencer/timeline"

class SequencerGroup extends Component {
    constructor(props) {
        super(props);
        this.timer = new Timer(140, 32);
        this.timer.start();
        this.listeners = {};
        this.notes = this.props.notes;
        this.state = {
            xlen: 32,
            selectedInstrument: this.props.instrument,
            users: this.props.users,
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
        var file = new Blob([JSON.stringify(this.notes)], {type: "application/json"});
        a.href = URL.createObjectURL(file);
        a.download = "notes.json";
        a.click();
    }

    selectSequencer = instrument => {
        this.setState({selectedInstrument: instrument})
    }

    changeTimer = (bpm, xlen) => {
        if (bpm !== undefined)
            this.timer.setTime(bpm);
        if (xlen !== undefined) {
            this.timer.setRepeat(xlen);
            if (this.state.xlen !== xlen)
                this.setState({xlen: xlen});
        }
    };

    setSolo = instrument => {
        this.setState({solo: this.state.solo === instrument ? undefined : instrument});
    }

    componentDidMount() {
        if (this.props.online) {
            this.chatSocket = new WebSocket(
                'ws://' + window.location.host +
                '/ws/group');


            this.chatSocket.onmessage = e => {
                let data = JSON.parse(e.data);
                let message = data['message'];
                data = JSON.parse(message);
                switch (data.action) {
                    case "add":
                        data.notes.forEach(note => {
                            let notes = [...this.notes[data.instrument], {
                                x: note.x,
                                y: note.y,
                                length: note.length
                            }];
                            this.notes[data.instrument] = notes;
                        });
                        break;
                    case "remove":
                        let notes = this.notes[data.instrument].slice();
                        for (let i = 0; i < data.notes.length; i++) {
                            let removing = data.notes[i];
                            let j = notes.findIndex(note => (note.x === removing.x && note.y === removing.y));
                            notes.splice(j, 1);
                        }
                        break;
                    case "change_length":
                        let changing = this.notes[data.instrument];
                        for (let i = 0; i < data.notes.length; i++) {
                            let change = data.notes[i];
                            let j = changing.findIndex(note => (note.x === note.x && note.y === change.y));
                            changing[j].length = change.length;
                        }
                        break;
                    case "join":
                        this.notes[data.instrument] = [];
                        let users = Object.assign({}, this.state.users);
                        users[data.instrument] = data.username;
                        this.setState({users: users});
                        break;
                }
                this.listeners[data.instrument](data);
            };

            this.chatSocket.onclose = function (e) {
                console.error('Chat socket closed unexpectedly');
            };
        }
    };


    addNote = (note, instrument) => {
        let notes = [...this.notes[instrument], {x: note.x, y: note.y, length: note.length}];
        this.notes[instrument] = notes;
        if (this.props.online) {
            let data = {instrument: instrument, notes: [note], action: "add"};
            this.chatSocket.send(JSON.stringify(data));
        }
    };

    removeNotes = (notes, instrument) => {
        if (this.props.online) {
            let data = {notes: notes, instrument: instrument, action: "remove"};
            this.chatSocket.send(JSON.stringify(data));
        }
    };

    changeLen = (note, instrument) => {
        if (this.props.online) {
            let data = {notes: [note], instrument: instrument, action: "change_length"};
            this.chatSocket.send(JSON.stringify(data));
        }
    };


    render() {
        let hidden = [...Object.keys(this.state.users)];
        hidden.splice(hidden.indexOf(this.state.selectedInstrument), 1);

        return (
            <div className="sequencer-window">
                <div className="hidden-sequencers">
                    {hidden.map(instrument => (
                        <Sequencer changeLen={this.changeLen}
                                   editable={instrument === this.props.instrument || !this.props.online}
                                   username={this.state.users[instrument]}
                                   removeNotes={this.removeNotes} listeners={this.listeners} key={instrument}
                                   xlen={this.state.xlen}
                                   drums={instrument === "Drums"}
                                   instrument={instrument} notes={this.notes} height="10vh" width="10%"
                                   select={this.selectSequencer} setSolo={this.setSolo} solo={this.state.solo}
                                   timer={this.timer} show={false}/>
                    ))}
                </div>
                <div className="main-sequencer">
                    <Sequencer changeLen={this.changeLen}
                               editable={this.state.selectedInstrument === this.props.instrument || !this.props.online}
                               username={this.state.users[this.state.selectedInstrument]}
                               removeNotes={this.removeNotes} listeners={this.listeners} addNote={this.addNote}
                               key={this.state.selectedInstrument}
                               changeTimer={this.changeTimer}
                               xlen={this.state.xlen}
                               drums={this.state.selectedInstrument === "Drums"}
                               instrument={this.state.selectedInstrument} notes={this.notes} height="70vh" width="80%"
                               select={this.selectSequencer} setSolo={this.setSolo} solo={this.state.solo}
                               timer={this.timer} show={true}/>
                </div>
                <TimeLine timer={this.timer} changeTimer={this.changeTimer}/>

            </div>
        )
    }
}

export default SequencerGroup;