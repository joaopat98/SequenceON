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
            errors: {},
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
                else if (response.status === 400) {
                    response.json().then(errors => {
                        this.setState({errors: errors});
                    });
                }
                else if (response.status === 404) {
                    this.setState({errors: {password: "No user with such username/password combination"}})
                }
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
                        <img type='image' id="img" src={logo}></img>
                    </div>
                </div>
                <div className="row" align="center">
                    <div className="col my-auto">
                        <form>
                            <div id="login-box">
                                <div id="box-margin"></div>
                                <div className="row">
                                    <div className="col">
                                        <input type="text" name="username" placeholder="Username"
                                               value={this.state.username} onChange={this.changeHandler}/>
                                    </div>
                                </div>
                                {this.state.errors.username !== undefined ? (
                                    <div className="row">
                                        <div className="col">
                                            <p>{this.state.errors.username}</p>
                                        </div>
                                    </div>
                                ) : null}
                                <div id="box-margin-small"></div>
                                <div className="row">
                                    <div className="col">
                                        <input type="password" name="password" placeholder="Password"
                                               value={this.state.password} onChange={this.changeHandler}/>
                                    </div>
                                </div>
                                {this.state.errors.password !== undefined ? (
                                    <div className="row">
                                        <div className="col">
                                            <p>{this.state.errors.password}</p>
                                        </div>
                                    </div>
                                ) : null}
                                <div id="box-margin-small"></div>
                                <div className="row">
                                    <div className="col">
                                        <button type="submit" onClick={this.clickHandler} className="button">LOGIN
                                        </button>
                                    </div>
                                </div>
                                <div className="row margin-btn"/>
                                <div className="row" align="center">
                                    <div className="col my-auto">
                                        <small>
                                            <button type="button" onClick={this.register} className="btn">register
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