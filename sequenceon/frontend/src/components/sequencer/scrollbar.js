import React, { Component } from "react";

class ScrollBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pos: 0,
        }
    }

    onDrag = ev => {
        ev.preventDefault();
        ev.stopPropagation();
        let pos = Math.min(Math.max(0, (ev.clientX - this.offset - this.boxX) / this.len), 0.98);
        this.props.timer.setProgress(pos / 0.98);
        this.setState({ pos: pos });
    }

    onHold = ev => {
        this.wasPlaying = this.props.timer.isRunning;
        this.props.timer.stop();
        ev.preventDefault();
        ev.stopPropagation();
        this.boxX = ev.currentTarget.getBoundingClientRect().x;
        this.len = ev.currentTarget.getBoundingClientRect().width;
        this.baseX = this.scrollBarBall.getBoundingClientRect().x;
        this.offset = this.scrollBarBall.getBoundingClientRect().width / 2;
        let pos = Math.min(Math.max(0, (ev.clientX - this.offset - this.boxX) / this.len), 0.98);
        this.props.timer.setProgress(pos / 0.98);
        this.setState({ pos: pos });
        let drag = this.onDrag.bind(this);
        document.addEventListener("mousemove", drag);
        let self = this;
        function end() {
            document.removeEventListener("mousemove", drag);
            document.removeEventListener("mouseup", end);
            if (self.wasPlaying)
                self.props.timer.start();
        };
        document.addEventListener("mouseup", end);
    }

    componentDidMount() {
        this.props.timer.registerCallback(() => {
            this.setState({ pos: this.props.timer.getProgress() * 0.98 });
        });
    }

    render() {
        return (
            <div className="timeline-element scrollbar-container">
                <div className="scrollbar" onMouseDown={this.onHold}>
                    <div className="scrollbar-bar" />
                    <div className="scrollbar-ball"
                        style={{ left: "calc(100% * " + this.state.pos + ")" }} ref={(ref) => (this.scrollBarBall = ref)} />
                </div>
            </div>
        )
    }
}

export default ScrollBar;