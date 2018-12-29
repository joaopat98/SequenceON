import React from 'react';
import './LandingPage.css';
import logo from './images/sequenceON.png';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


class LandingPage extends React.Component {
    constructor(props) {
        super(props)
    }

    register = (ev) => {
        window.location.assign("/register");
    }
    login = (ev) => {
        window.location.assign("/login");
    }
    menu = (ev) => {
        window.location.assign("/");
    }

    render() {
        return (
            <div className="container-fluid landing-container">
                <div className="row row-top">
                    <div className="col col-left">
                        <div className="info-box">
                            <div className="row" align="center">
                                <div className="col">
                                    <img type='image' id="img" src={logo}></img>
                                </div>
                            </div>
                            <div className="row" align="center">
                                <div className="col">
                                    <h1>Make Music Together. Online</h1>
                                    {!this.props.logedin ?
                                        <button onClick={this.register} className="btn-landing">Create Account</button>
                                        : null}
                                    {!this.props.logedin ?
                                        <button onClick={this.login} className="btn-landing">Login</button>
                                        : null}
                                    {this.props.logedin ?
                                        <button onClick={this.menu} className="btn-landing">Start Making Music!</button>
                                        : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col"></div>
                    <div className="arrows-down">
                        <FontAwesomeIcon icon={"angle-double-down"}/>
                    </div>
                </div>
                <div className="row row-bottom">
                    <div className="col">
                        <div className="row row-color-1" align="center">
                            <div className="col col-bottom-1">
                            </div>
                            <div className="col my-auto">
                                <h2>Be creative Alone or Jam With others</h2>
                                <small><p>In SequenceON you can play alone, with your friends or just with total
                                    strangers</p></small>
                            </div>
                        </div>
                        <div className="row row-color-2" align="center">
                            <div className="col my-auto">
                                <h2>Make Music with Just a few clicks!</h2>
                            </div>
                            <div className="col col-bottom-2">
                            </div>
                        </div>
                        <div className="row row-color-3" align="center">
                            <div className="col col-bottom-3">
                                <iframe height="100%" width="100%" src="https://www.youtube.com/embed/oecYY892f6M"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen/>
                            </div>
                            <div className="col my-auto">
                                <h2>Easy and Intuitive</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LandingPage;