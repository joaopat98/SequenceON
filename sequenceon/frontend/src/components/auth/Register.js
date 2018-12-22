import React from 'react';
import './register.css';
import logo from './images/sequenceON.png';
import Request from "../../request";


class Register extends React.Component {
    constructor(props) {
        super(props)

        this.state = ({
            username: "",
            password1: "",
            password2: "",
            email: "",
        });
    }

    login = (ev) => {
        window.location.assign("/login");
    }
    clickHandler = (ev) => {
        ev.preventDefault("api");
        let fd = new FormData();
        for(let elem in this.state)
            fd.append(elem, this.state[elem]);
        Request.post("api/user/register", fd).then(response => {
            if (response.status === 200)
                window.location.assign("/")
        });
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
                                <div id="box-margin-small"></div>
                                <div className="row">
                                    <div className="col">
                                        <input type="password" name="password1" placeholder="Password"
                                               value={this.state.password1} onChange={this.changeHandler}/>
                                    </div>
                                </div>
                                <div id="box-margin-small"></div>
                                <div className="row">
                                    <div className="col">
                                        <input type="password" name="password2" placeholder="Confirm Password"
                                               value={this.state.password2} onChange={this.changeHandler}/>
                                    </div>
                                </div>
                                <div id="box-margin-small"></div>
                                <div className="row">
                                    <div className="col">
                                        <input type="text" name="email" placeholder="Email" value={this.state.email}
                                               onChange={this.changeHandler}/>
                                    </div>
                                </div>
                                <div id="box-margin-small"></div>
                                <div className="row">
                                    <div className="col">
                                        <button type="submit" onClick={this.clickHandler} className="button"><span>Create Account</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="row" align="center">
                                    <div className="col my-auto">
                                        <small>
                                            <button type="button" onClick={this.login} className="btn">Login</button>
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

export default Register;