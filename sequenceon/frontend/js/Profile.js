import React from 'react';
import './profile.css';
import CustomNavBar from './CustomNavBar';
import Sequence from './Sequence';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class Profile extends React.Component{
    constructor(props){
        super(props)

        this.state = ({
            username: "",
            password: "",
        });
    }

    
    render(){
        return( 
            <div className ="container-fluid loginContainer">
                <div className = "row">
                    <div className = "col" >
                        <CustomNavBar/>
                    </div>
                </div>
                <div className = "space-rows"></div> 
                <div className = "row">
                    <div className = "col col-no-padding" >
                        <div class="row row-banner">
                            <div  class="col-5 little-margin" align="center">
                            <div class="row">
                                <div class="col-4">
                                    <div className="square-pic">
                                        <FontAwesomeIcon icon="user-tie" size="5x"/>
                                    </div>
                                </div>
                                <div class="col-6 color">
                                    <h2>Hobbit Barão</h2>
                                    <small><p>Coimbra,Portugal</p></small>
                                </div>
                            </div>
                            <div className = "space-rows"></div> 
                            <div class="row">
                                <div class="col-3 color">
                                    7
                                </div>
                                <div class="col-3 color">
                                    55
                                </div>
                                <div class="col-3 color">
                                    45 
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-3 color">
                                    <small>Sequences</small> 
                                </div>
                                <div class="col-3 color">
                                    <small>Followers</small>
                                </div>
                                <div class="col-3 color">
                                    <small>Following</small>
                                </div>
                            </div>
                                
                            </div>
                        </div>
                    </div>
                </div> 
                <div className="row info-field">
                    <div className="col my-auto">
                        <div className="row">
                            <div className="col-3"></div>
                            <div class="col">
                                <div class="row">
                                    <div className="col-4">
                                        Member Since:
                                    </div>
                                    <div className="col-4 info-detail" align="center">
                                        04-10-2000
                                    </div>
                                </div>
                                <div className="margin"></div>
                                <div className="row">
                                    <div className="col-4">
                                        Email:
                                    </div>
                                    <div className="col-4 info-detail" align="center">
                                        email@email.com
                                    </div>
                                </div>
                                <div className="margin"></div>
                                <div className="row">
                                    <div className="col-4">
                                        Instrument:
                                    </div>
                                    <div className="col-4 info-detail" align="center">
                                        Drums
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div className="col my-auto" >

                        <Sequence></Sequence>

                    </div>
                </div>                                  
            </div>
        )
    }
}

export default Profile;