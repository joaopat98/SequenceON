import React from 'react';
import './Sequence.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class Sequence extends React.Component{
    constructor(props){
        super(props)

        
    }

    
    render(){
        return( 
            <div className="Sequence"> 
                <div className="row height" >
                    <div className="col-4 my-auto" align="center">
                        This is a pretty Image
                    </div>
                    <div className="col">
                        <div className="row">
                            <div className="col" align="left">
                                Title
                            </div>
                        </div>
                        <div className="row">
                            <div className="col" align="left">
                                This is a very Pretty Description
                            </div>
                        </div>
                        <div className="row"></div>
                            <div className="col" align="left">
                                    Hobbit
                            </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Sequence;