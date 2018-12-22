import React from 'react';
import './Menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Request from "../../request";


class Menu extends React.Component{
    constructor(props){
        super(props)
    }
    Random=(ev)=>{
        Request.get("api/random").then(response => {
            response.json().then(data => {
                window.location.assign("/sequencer?room=" + data);
            });
        });
    }
    Single=(ev)=>{
        window.location.assign("/sequencer");
    }
    Group=(ev)=>{
        Request.post("api/createroom", new FormData()).then(response => {
            response.json().then(data => {
                window.location.assign("/sequencer?room=" + data);
            });
        });
    }
    render(){
        return( 
           <div className="container-fluid full-vertical">
                <div className="row full-vertical">
                    <div className="col-6 full-vertical reset-padding">
                        <div className="container-fluid col-left-m full-vertical" onClick={this.Random}>
                            <div className="row full-vertical">
                                <div className="col my-auto" align="center">
                                    <FontAwesomeIcon icon="users" size="5x"/>
                                    <FontAwesomeIcon icon="users" size="5x"/>
                                    <FontAwesomeIcon icon="users" size="5x"/>
                                    <br></br> <h2>Random</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 reset-padding">
                        <div className="container-fluid">
                            <div className="row top-m half-vertical" align="center"  onClick={this.Single}>
                                <div className="col my-auto">
                                    <FontAwesomeIcon icon="user" size="7x"/>
                                    <br></br> <h4>Single</h4>
                                </div>
                            </div>
                            <div className="row bottom-m half-vertical" align="center"  onClick={this.Group}>
                                <div className="col my-auto">
                                    <FontAwesomeIcon icon="users" size="7x"/>
                                    <br></br> <h4>Create Group</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
           </div>
        )
    }
}



export default Menu;