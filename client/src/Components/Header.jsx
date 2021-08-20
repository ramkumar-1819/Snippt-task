import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'

//This is Header Component Contain Logo and Logout things
function Header(props){
    //logOut - remove the json token from storage
    const logOut=()=>{
        localStorage.removeItem('token')
        props.history.push('/Home')
    }
    return(
        <div className='Header'>
                <h1>Snippet Schedular</h1>
                <button type='button' onClick={logOut}>Logout</button>
        </div>
    )
}
export default  withRouter(Header)