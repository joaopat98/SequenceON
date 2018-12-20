import React from 'react';
import './login.css';
import logo from'./images/sequenceON.png';

class Login extends React.Component{
    constructor(props){
        super(props)

        this.state = ({
            username: "",
            password: "",
        });
    }

    register=(ev)=>{
        window.location.assign("/register");    
}
    clickHandler=(ev)=>{
        ev.preventDefault();
        console.log({password:this.state.password, username:this.state.password})
    }

    changeUserHandler=(ev)=>{
        this.setState({
            username: ev.target.value,
        });
    }
    changePassHandler=(ev)=>{
        this.setState({
            password: ev.target.value,
        });
    }


    render(){
        return( 
            <div className="container-fluid loginContainer">
                <div className="row" align="center">   
                    <div className="col my-auto" >
                        <img type='image' id ="img" src = {logo}></img>
                    </div>   
                </div>
                    <div className="row" align="center">
                        <div className="col my-auto" >
                            <form>
                                <div id="login-box">
                                    <div id="box-margin"></div>
                                    <div className="row">
                                        <div className="col">
                                            <input type="text" name="username" placeholder="Username" value={this.state.username} onChange={this.changeUserHandler}/>
                                        </div>
                                    </div>   
                                    <div id="box-margin-small"></div>
                                    <div className="row">
                                        <div className="col">
                                            <input type="text" name="password" placeholder="Password" value={this.state.password} onChange={this.changePassHandler}/>                                
                                        </div>
                                    </div>
                                    <div id="box-margin-small"></div>
                                    <div className="row">
                                        <div className="col">
                                            <button type="submit" onClick ={this.clickHandler} className="button">LOGIN</button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-3"></div>
                                        <div className="col-3">
                                            <small><button type="button" onClick={this.register} className="btn">Register</button></small>   
                                        </div>
                                        <div className="col-3">
                                            <small><button type="button" onClick={this.register} className="btn">Password</button></small>
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