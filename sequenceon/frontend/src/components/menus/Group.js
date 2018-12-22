import React from 'react';
import './Group.css';

class Group extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let instruments = ["Drums", "Bass", "Piano", "Guitar", "Electric Guitar"];
        return (
            <div className="container-fluid container-group">
                <div className="row group">
                    <div className="col">
                        <div className="row margin-group" align="center">
                            <div className="col-1"></div>
                            <div className="col-10"><h1><big>Choose your instrument</big></h1>
                            </div>
                        </div>
                        <div className="row">
                            {instruments.map(instrument => {
                                    let available = this.props.available.indexOf(instrument) !== -1;
                                    return (
                                        <div onClick={available ? (() => {
                                            this.props.selectInstrument(instrument)
                                        }) : undefined}
                                             className={"col Slot" + (available ? "" : " used")}>
                                            <div className="row" align="center">
                                                <div className={"col Slot" + (available ? "" : " used")}>
                                                    <div className="margin-slot"/>
                                                    <div className="instrument"></div>
                                                    <p>{instrument}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Group;