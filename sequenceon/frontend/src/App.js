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
    faAngleDoubleDown,
    faBars,
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
import MenuSidebar from "./components/menus/menu-sidebar";

library.add(faUser, faVolumeUp, faHeadphones, faWindowMaximize, faVolumeOff, faPause, faPlay, faUserCircle, faEnvelope, faCog, faUserTie, faUsers, faSignOutAlt, faAngleDoubleDown, faBars);

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
                            <MenuSidebar logedin={true}>
                                <Switch>
                                    <Route path="/sequencer" component={SequencerPage}/>
                                    <Route path="/landing" render={() => <LandingPage logedin={true}/>}/>
                                    <Route component={Menu}/>
                                </Switch>
                            </MenuSidebar>
                            {/*<LogoutBtn/>*/}
                        </div>
                    </Router>
                );
            } else {
                return (
                    <Router>
                        <div className="App">
                            <MenuSidebar logedin={false}>
                                <Switch>
                                    <Route path="/login" component={Login}/>
                                    <Route path="/register" component={Register}/>
                                    <Route render={() => <LandingPage logedin={false}/>}/>
                                </Switch>
                            </MenuSidebar>
                        </div>
                    </Router>
                )
            }
        } else return null;
    }
}

export default App;
