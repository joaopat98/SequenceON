import React from 'react';
import './CustomNavBar.css';
import { Nav,NavItem,NavDropdown,MenuItem, Navbar } from 'react-bootstrap';
import icon from'./images/cd.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



class CustomNavBar extends React.Component{
    
    render(){
        return (
            <div>
                <header>
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
                    </link>
                </header>
                <Navbar fixedTop="true" inverse="true" fluid="true">
                    <Nav>
                        <div className="container">
                            <div className="row" >
                                <div className="col-1" >
                                    <NavItem eventKey={1} href="#">
                                        <img type='image' className ="header-icon" src = {icon}></img>
                                    </NavItem>
                                </div>
                                <div className="col">
                                    <NavItem eventKey={2} href="#">
                                        <FontAwesomeIcon icon="envelope" size="2x"/>
                                    </NavItem>
                                </div>
                                <div className="col-2" >
                                    <NavItem eventKey={1} href="#">
                                       <small>Username</small> <FontAwesomeIcon icon="user-circle" size="2x"/>
                                    </NavItem>
                                </div>
                                <div className="col-1" >
                                    <NavItem eventKey={1} href="#">
                                        <FontAwesomeIcon icon="cog" size="2x"/>
                                    </NavItem>
                                </div>

                            </div>
                        </div>
                    </Nav>
                </Navbar>
            </div>
        )
    }
}

export default CustomNavBar
