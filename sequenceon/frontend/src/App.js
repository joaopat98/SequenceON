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
    faPlay,
    faUserCircle,
    faEnvelope,
    faCog,
    faUserTie,
    faUsers,
    faSignOutAlt,
    faAngleDoubleDown
} from '@fortawesome/free-solid-svg-icons';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import SequencerPage from "./components/sequencer-page";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Group from "./components/menus/Group";
import Menu from "./components/menus/Menu";
import Request from "./request";
import LandingPage from "./components/menus/LandingPage";
import LogoutBtn from "./components/logoutbtn";

library.add(faUser, faVolumeUp, faHeadphones, faWindowMaximize, faVolumeOff, faPause, faPlay, faUserCircle, faEnvelope, faCog, faUserTie, faUsers, faSignOutAlt, faAngleDoubleDown);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            logedin: false
        }
    }

    componentDidMount() {
        Request.post("api/user/logincheck", new FormData()).then(response => {
            this.setState({
                ready: true,
                logedin: response.status === 200
            });
        });
    }

    render() {
        if (this.state.ready) {
            if (this.state.logedin) {
                return (
                    <Router>
                        <div className="App">
                            <Switch>
                                <Route path="/sequencer" component={SequencerPage}/>
                                <Route exact path="/" component={Menu}/>
                            </Switch>
                            <LogoutBtn/>
                        </div>
                    </Router>
                );
            } else {
                return (
                    <Router>
                        <div className="App">
                            <Switch>
                                <Route path="/login" component={Login}/>
                                <Route path="/register" component={Register}/>
                                <Route component={LandingPage}/>
                            </Switch>
                        </div>
                    </Router>
                )
            }
        }
        else return null;
    }
}

export default App;
