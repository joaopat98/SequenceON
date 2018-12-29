import React, {Component} from "react";
import SequencerGroup from "./sequencer-group";
import Group from "./menus/Group";
import Request from "../request";

class SequencerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            offline: false,
            available_instruments: [],
            sidebarOpen: false
        }
    }

    selectInstrument = instrument => {
        let fd = new FormData();
        fd.append("instrument", instrument);
        Request.post("api/selectinstrument", fd).then(response => {
                response.json().then(data => {
                    this.setState(data);
                })
            }
        );
    };

    onSetSidebarOpen(open) {
        this.setState({sidebarOpen: open});
    }

    componentDidMount() {
        let query = new URLSearchParams(window.location.search);
        let room = query.get("room");
        if (room !== null && room !== undefined) {
            let fd = new FormData();
            fd.append("room", room);
            Request.post("api/joinroom", fd).then(response => {
                response.json().then(data => {
                    data.ready = true;
                    this.setState(data)
                })
            })
        } else
            this.setState({
                offline: true,
                users: {"Drums": "", "Bass": "", "Piano": "", "Guitar": "", "Electric Guitar": ""},
                notes: {"Drums": [], "Bass": [], "Piano": [], "Guitar": [], "Electric Guitar": []},
                length: 64,
                instrument: "Drums"
            });
    }

    render() {
        if (this.state.ready || this.state.offline) {
            if (this.state.instrument !== undefined) {

                return (
                    <SequencerGroup instrument={this.state.instrument}
                                    notes={this.state.notes}
                                    users={this.state.users}
                                    online={!this.state.offline}
                                    length={this.state.length}
                                    song={this.state.song}
                    />
                )
            } else return (
                <Group available={this.state.available_instruments}
                       selectInstrument={this.selectInstrument}/>
            );
        } else
            return null;
    }

}

export default SequencerPage;