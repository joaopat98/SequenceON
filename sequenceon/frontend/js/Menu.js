import React from 'react';
import './Menu.css';
import single from'./images/ic.png';


class Menu extends React.Component{

    render(){
        return( 
            <div class="container-fluid container-m">
                <div class="row full-vertical" align="center">
                    <div class="col col-left-m">
                        R
                    </div>
                    <div class="col full-vertical">
                        <div class="row half-vertical" align="center">
                            <div class="col top-m">                                
                                <img type='image' id ="img" src = {single}></img>
                            </div> 
                        </div>
                        <div class="row half-vertical" align="center">
                            <div class="col bottom-m">
                                G
                            </div>    
                        </div>
                    </div>

                </div>  
            </div>
        )
    }
}



export default Menu;