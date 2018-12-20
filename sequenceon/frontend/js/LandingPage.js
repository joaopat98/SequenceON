import React from 'react';
import './LandingPage.css';
import logo from'./images/sequenceON.png';


class LandingPage extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return( 
            <div className="container-fluid landing-container">
                <div className="row row-top">
                    <div className="col col-left">
                        <div className="info-box">
                            <div className="row" align="center">
                                <div className="col">
                                    <img type='image' id ="img" src = {logo}></img>
                                </div>
                            </div>
                            <div className="row" align="center">
                                <div className="col">
                                    <h1>Make Music Together. Online</h1>
                                    <button>Create Account</button><button>Make Music</button>
                                    <small><p>
                                        Benefits: 
                                        <p>-Allows to save song progress</p>
                                        <p>-Check Other profiles and chat</p>
                                    </p></small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col"></div>
                </div>
                <div className="row row-bottom">
                    <div className="col">
                        <div className="row row-color-1" align="center">
                            <div className="col col-bottom-1">
                            </div>
                            <div className="col my-auto">
                                <h2>Be creative Alone or Jam With others</h2>
                                <small><p>In SequenceON you can play alone, with your friends or just with total strangers</p></small>
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
                                <h3>Insert Tutorial Here</h3>
                            </div>
                            <div className="col my-auto">
                                <h2>Easy and Intuitive</h2>
                            </div>
                        </div>
                    
                        <div className="row row-color-4" align="center">
                            <div className="col my-auto">
                                <h2>Save your progress and check other profiles!</h2>
                            </div>
                            <div className="col col-bottom-4">
                            </div>
                        </div>
                        <div className="row row-color-5" align="center">
                            <div className="col my-auto">
                                <h2>Who are we?</h2>
                                <img type='image' id ="img" src = {logo}></img>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LandingPage;