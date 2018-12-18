import React, { Component } from "react";
import line from "./Assets/Images/caret_line.png";

class Caret extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 0
        }
    }

    componentDidMount() {
        this.props.timer.registerCurCallback(time => {
            this.setState({ time: time });
        });
    }

    render() {
        return (
            <div className="caret-container">
                <img src={line} className="caret" style={{ left: "calc(" + this.state.time + " * " + this.props.cellWidth + ")" }} />
            </div>
        )
    }
}

export default Caret;