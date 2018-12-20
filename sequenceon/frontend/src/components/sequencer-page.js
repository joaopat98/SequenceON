import React, { Component } from "react";
import SequencerGroup from "./sequencer-group";

class SequencerPage extends Component{

    render() {
        return (
            <SequencerGroup instruments={["Drums", "Bass", "Piano", "Guitar", "Electric Guitar"]} />
        );
    }

}

export default SequencerPage;