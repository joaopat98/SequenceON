import React from 'react';
import './login.css';
import logo from './images/sequenceON.png';
import Request from "../../request";

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = ({
            username: "",
            password: "",
        });
    }

    register = (ev) => {
        window.location.assign("/register");
    }
    clickHandler = (ev) => {
        ev.preventDefault();
        let fd = new FormData();
        for (let elem in this.state)
            fd.append(elem, this.state[elem]);
        Request.post("api/user/login", fd).then(response => {
                if (response.status === 200)
                    window.location.assign("/")
            }
        );
    }

    changeHandler = (ev) => {
        this.setState({
            [ev.target.name]: ev.target.value,
        });
    }


    render() {
        return (
            <div className="container-fluid loginContainer">
                <div className="row" align="center">
                    <div className="col my-auto">
                        <img type='image' id="img" src={logo}/>
                    </div>
                </div>
                <div className="row" align="center">
                    <div className="col my-auto">
                        <form>
                            <div id="login-box">
                                <div id="box-margin"/>
                                <div className="row">
                                    <div className="col">
                                        <input type="text" name="username" placeholder="Username"
                                               value={this.state.username} onChange={this.changeHandler}/>
                                    </div>
                                </div>
                                <div id="box-margin-small"/>
                                <div className="row">
                                    <div className="col">
                                        <input type="password" name="password" placeholder="Password"
                                               value={this.state.password} onChange={this.changeHandler}/>
                                    </div>
                                </div>
                                <div id="box-margin-small"/>
                                <div className="row">
                                    <div className="col">
                                        <button type="submit" onClick={this.clickHandler} className="button">LOGIN
                                        </button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-3"/>
                                    <div className="col-3">
                                        <small>
                                            <button type="button" onClick={this.register} className="btn">Register
                                            </button>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        )
    }
}

export default Login;