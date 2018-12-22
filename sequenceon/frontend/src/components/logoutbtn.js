import React from "react";
import Request from "../request";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./signout.css"

class LogoutBtn extends React.Component {
    logout = ev => {
        Request.post("api/user/logout", new FormData).then(() => window.location.assign("/login"))
    }

    render() {
        return (
            <div onClick={this.logout} style={{cursor: "pointer"}}>
                <FontAwesomeIcon className="signoutbtn" icon="sign-out-alt"/>
            </div>
        )
    }
}

export default LogoutBtn;