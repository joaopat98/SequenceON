import React from 'react';
import './register.css';
import logo from'./images/sequenceON.png';


class Register extends React.Component{
    constructor(props){
        super(props)

        this.state = ({
            username: "",
            password: "",
            email: "",
        });
    }

    login =(ev)=>{
        window.location.assign("/login");    
    }
    clickHandler=(ev)=>{
        ev.preventDefault();
        console.log({password:this.state.password, username:this.state.password, email:this.state.email})
    }

    changeHandler=(ev)=>{
        this.setState({
            [ev.target.name]: ev.target.value,
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
                                    <input type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.changeEmailHandler}/>
                                    </div>
                                </div>
                                <div id="box-margin-small"></div>
                                <div className="row">
                                    <div className="col">
                                        <button type="submit" onClick ={this.clickHandler} className="button"><span>Create Account</span></button>
                                    </div>
                                </div>
                                <div className="row" align="center">
                                    <div className="col my-auto">
                                        <small><button type="button" onClick={this.register} className="btn">Login</button></small>   
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