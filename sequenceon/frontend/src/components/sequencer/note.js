import React, {Component} from "react";

class Note extends Component {
    constructor(props) {
        super(props);
        this.state = {
            length: this.props.note.length,
            prevLength: undefined
        }
    }

    onStretch = ev => {
        ev.preventDefault();
        ev.stopPropagation();
        let len = Math.max(1, (ev.clientX - this.baseX) / this.baseLen);
        let dif = len - Math.floor(len);
        let prevLen = dif > 0.2 ? Math.ceil(len) : Math.floor(len);
        this.setState({length: len, prevLength: prevLen});
    }

    onSize = ev => {
        ev.preventDefault();
        ev.stopPropagation();
        this.baseX = ev.currentTarget.parentNode.getBoundingClientRect().x;
        this.baseLen = parseInt(this.props.cellWidth.substring(0, this.props.cellWidth.length - 2));
        let drag = this.onStretch.bind(this);
        document.addEventListener("mousemove", drag);
        let self = this;

        function end() {
            document.removeEventListener("mousemove", drag);
            document.removeEventListener("mouseup", end);
            let len = self.state.prevLength;
            if (len !== undefined) {
                self.setState({length: len, prevLength: undefined});
                self.props.changeLen(self.props.note, len, self.props.selected);
            }
        }

        document.addEventListener("mouseup", end);
    };

    onHold = ev => {
        ev.stopPropagation();
        this.props.holdNote(ev);
    };

    onClick = ev => {
        ev.stopPropagation();
        this.props.onClick(ev, this.props.note, this.props.selected);
    };

    render() {
        return (
            <div className="note-container" style={{
                top: "calc(" + this.props.cellHeight + " * " + this.props.note.y + ")",
                left: "calc(" + this.props.cellWidth + " * " + this.props.note.x + ")",
                height: this.props.cellHeight,
                cursor: this.state.prevLength !== undefined ? "col-resize" : "default"
            }}>
                {this.state.prevLength !== undefined ?
                    (
                        <div className="preview-note"
                             style={{
                                 width: "calc(" + this.props.cellWidth + " * " + this.state.prevLength + ")",
                             }}/>
                    )
                    : null}
                <div onClick={this.onClick} onMouseDown={this.onHold}
                     className={"note" + (this.props.selected ? " note-selected" : "")}
                     style={{
                         width: "calc(" + this.props.cellWidth + " * " + this.state.length + ")",
                     }}>
                    <div className="note-right" onMouseDown={this.props.editable ? this.onSize.bind(this) : undefined}/>
                </div>
            </div>
        )
    }
}

export default Note;