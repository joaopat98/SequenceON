import React, {Component} from "react";
import Timer from "../timer";
import Sequencer from "./sequencer/sequencer";
import "./sequencer/sequencer.css";
import TimeLine from "./sequencer/timeline"

class SequencerGroup extends Component {
    constructor(props) {
        super(props);
        this.timer = new Timer(140, this.props.length);
        this.timer.start();
        this.listeners = {};
        this.notes = this.props.notes;
        this.state = {
            xlen: this.props.length,
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
                let data = JSON.parse(content);
                this.notes = data.notes;
                this.forceUpdate();
                this.changeTimer(undefined, data.length);
            }).catch(error => console.log(error));
        }
    }

    readFileContent(file) {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = event => resolve(event.target.result);
            reader.onerror = error => reject(error);
            reader.readAsText(file)
        })
    }

    download = () => {
        let notes = Object.assign({
            "Drums": [],
            "Bass": [],
            "Piano": [],
            "Guitar": [],
            "Electric Guitar": []
        }, this.notes);
        let data = {
            notes: notes,
            length: this.state.xlen
        };
        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(data)], {type: "application/json"});
        a.href = URL.createObjectURL(file);
        let filename = "Song " + this.props.song + ", " + (new Date()).toLocaleString() + ".json";
        console.log(filename);
        a.download = filename.replace(/:/g, "-").replace(/\//g, "-");
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

    copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    copyLink = () => {
        this.copyToClipboard(window.location.href);
        alert("Shareable link copied to clipboard!");
    }

    warnLen = len => {
        if (len !== undefined && this.props.online) {
            let data = {instrument: this.props.instrument, action: "length", length: len};
            this.chatSocket.send(JSON.stringify(data));
        }
    }

    componentDidMount() {
        if (this.props.online) {
            let protocol;
            switch (window.location.protocol) {
                case "http:":
                    protocol = "ws:";
                    break;
                case "https:":
                    protocol = "wss:";
            }
            this.chatSocket = new WebSocket(
                protocol + '//' + window.location.host +
                '/ws/group');

            this.chatSocket.onopen = e => {
                window.setInterval(() => this.chatSocket.send(JSON.stringify({action: "ping"})), 1000)
            };


            this.chatSocket.onmessage = e => {
                let data = JSON.parse(e.data);
                let message = data['message'];
                data = JSON.parse(message);
                let changing;
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
                        changing = this.notes[data.instrument];
                        for (let i = 0; i < data.notes.length; i++) {
                            let change = data.notes[i];
                            let j = changing.findIndex(note => (note.x === change.x && note.y === change.y));
                            changing[j].length = change.length;
                        }
                        break;
                    case "offset":
                        
                        break;
                    case "length":
                        this.changeTimer(undefined, data.length);
                        break;
                    case "join":
                        this.notes[data.instrument] = [];
                        let users = Object.assign({}, this.state.users);
                        users[data.instrument] = data.username;
                        this.setState({users: users});
                        break;
                    default:
                        return;
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

    offsetNotes = (notes, offsetX, offsetY, instrument) => {
        if (this.props.online) {
            let data = {notes: notes, offsetX: offsetX, offsetY:offsetY, instrument: instrument, action: "offset"};
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
                                   offsetNotes={this.offsetNotes}
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
                               offsetNotes={this.offsetNotes}
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
                {this.props.online ? (
                    <div className="option-buttons">
                        <br/>
                        <button onClick={this.copyLink}>Shareable link</button>
                        <br/>
                        <button onClick={this.download}>Download copy</button>
                    </div>
                ) : null}
                {!this.props.online ? (
                    <div className="option-buttons">
                        <label htmlFor="filebtn" className="file-btn">Load Song</label>
                        <input id="filebtn" onChange={this.loadNotes} style={{visibility: "hidden"}} type="file"
                               accept="application/json"/>
                    </div>
                ) : null}
                <TimeLine warnLen={this.warnLen} timer={this.timer} changeTimer={this.changeTimer}/>

            </div>
        )
    }
}

export default SequencerGroup;