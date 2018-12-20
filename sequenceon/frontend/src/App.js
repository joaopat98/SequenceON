import React, {Component} from 'react';
import './App.css';
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faUser,
    faVolumeUp,
    faHeadphones,
    faWindowMaximize,
    faVolumeOff,
    faPause,
    faPlay
} from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SequencerPage from "./components/sequencer-page";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

library.add(faUser, faVolumeUp, faHeadphones, faWindowMaximize, faVolumeOff, faPause, faPlay);

class App extends Component {

    render() {
        return (
            <Router>
                <div className="App">
                    <Switch>
                        <Route path="/sequencer" component={SequencerPage}/>
                        <Route path="/register" component={Register}/>
                        <Route exact path="/" component={Login}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
