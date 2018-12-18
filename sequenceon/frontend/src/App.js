import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Sequencer from './components/sequencer/sequencer';
import SequencerGroup from './components/sequencer-group';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faVolumeUp, faHeadphones, faWindowMaximize, faVolumeOff, faPause, faPlay } from '@fortawesome/free-solid-svg-icons'

library.add(faUser, faVolumeUp, faHeadphones, faWindowMaximize, faVolumeOff, faPause, faPlay);

class App extends Component {

    render() {
        return (
            <SequencerGroup instruments={["Drums", "Bass", "Piano", "Guitar", "Electric Guitar"]} />
        );
    }
}

export default App;
