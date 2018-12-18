import React, { Component } from "react";
import { shallowEqual } from 'shouldcomponentupdate-children';


class GridBackground extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowEqual(this.props, nextProps, this.state, nextState);
    }

    render() {
        console.log("rendered background");
        let xarr = [];
        let yarr = [];
        for (let i = 0; i < this.props.xlen; i++)
            xarr.push(i);
        for (let i = 0; i < this.props.ylen; i++)
            yarr.push(i);
        return (
            <div className="grid" style={{
                width: "calc(" + this.props.xlen + " * " + this.props.cellWidth + ")"
            }}>{
                    yarr.map(i => {
                        return (
                            <div key={i} className="grid-row" style={{ height: this.props.cellHeight }}>
                                {xarr.map(j => {
                                    return (
                                        <div key={j} onClick={ev => ev.preventDefault()} onDoubleClick={() => this.props.addNote(j, i)} style={{ width: this.props.cellWidth, height: this.props.cellHeight }} className={"grid-item back-cell" + ((j % 4) === 0 ? " measure" : "")} />
                                    )
                                })}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default GridBackground;