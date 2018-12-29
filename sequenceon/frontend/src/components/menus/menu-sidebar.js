import React from "react";
import Sidebar from "react-sidebar";
import "./menu-sidebar.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Request from "../../request";

const styles = {
    sidebar: {
        width: 256,
        height: "100%"
    },
    sidebarLink: {
        display: "block",
        padding: "16px 0px",
        color: "#757575",
        textDecoration: "none",
        cursor: "pointer"
    },
    divider: {
        margin: "8px 0",
        height: 1,
        backgroundColor: "#757575"
    },
    content: {
        padding: "16px",
        height: "100%",
        backgroundColor: "white"
    }
};

const SidebarContent = props => {
    const style = props.style
        ? {...styles.sidebar, ...props.style}
        : styles.sidebar;

    function logout() {
        Request.post("api/user/logout", new FormData).then(() => window.location.assign("/login"))
    }

    if (props.logedin) {
        return (
            <div style={styles.content}>
                <a href="/" style={styles.sidebarLink}>
                    Main Menu
                </a>
                <a href="/landing" style={styles.sidebarLink}>
                    Landing Page
                </a>
                <a href="https://www.youtube.com/watch?v=oecYY892f6M" style={styles.sidebarLink}>
                    Tutorial
                </a>
                <a onClick={logout} style={styles.sidebarLink}>
                    Logout
                </a>
                <div style={styles.divider}/>
            </div>
        );
    } else return (
        <div style={styles.content}>
            <a href="/" style={styles.sidebarLink}>
                Landing Page
            </a>
            <a href="/login" style={styles.sidebarLink}>
                Login
            </a>
            <a href="/register" style={styles.sidebarLink}>
                Register
            </a>
            <a href="https://www.youtube.com/watch?v=oecYY892f6M" style={styles.sidebarLink}>
                Tutorial
            </a>
            <div style={styles.divider}/>
        </div>
    );
};

class MenuSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: false
        }
    }

    onSetOpen = open => {
        this.setState({sidebarOpen: open});
    };

    render() {
        let sidebar = <SidebarContent logedin={this.props.logedin}/>;
        const sidebarProps = {
            sidebar: sidebar,
            open: this.state.sidebarOpen,
            touch: true,
            shadow: true,
            pullRight: true,
            touchHandleWidth: 10,
            dragToggleDistance: 10,
            onSetOpen: this.onSetOpen,
            styles: {sidebar: {background: "white"}}
        };
        return (
            <Sidebar {...sidebarProps}>
                <div onClick={() => this.onSetOpen(false)}>
                    {this.props.children}
                </div>
                <div className="menu-btn" onClick={() => this.onSetOpen(true)} style={{cursor: "pointer"}}>
                    <FontAwesomeIcon icon="bars"/>
                </div>
            </Sidebar>
        );
    }
}

export default MenuSidebar;