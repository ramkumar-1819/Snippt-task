import React, { Component,useState,useEffect } from 'react';
import axios from 'axios';
import './Auth.css';

//This is the Home component 
export default function Login(props){
    //loginFormHandler - Check user's input are valid and 
    //if valid it redirected to the next page
    const loginFormHandler=(e)=>{
        //Perform Client side validation before making API request
        e.preventDefault()
        const errorElement=document.getElementsByClassName('error')
        errorElement.innerHTML=""
        const user=document.getElementById('userType')
        if(user.value==='Type'){
            errorElement.innerHTML="Select Type"
            return
        }
        //Make API request to check user is valid
        //If valid he redirected to next page and set token in local storage
        axios.post('/Signin',{
            type:user.value,
            email:document.getElementById('username').value,
            password:document.getElementById('userpass').value
        })
        .then(result=>{
            localStorage.setItem('token',result.data.token)
            props.history.push({
                pathname:`/${user.value}`,
                state:result.data.user
            })
        })
        .catch(err=>err.response.data)
    }
    return(
        <div id='LoginPage'>
            <h3>Snippt Scheduler</h3>
            <div id='signin'>SignIn</div>
            <form className='userForm' onSubmit={loginFormHandler}>
                <input type="email" required placeholder='Email' id='username'/>
                <input type="password" required placeholder='Password' id='userpass'/>
                <select defaultValue='Type' id='userType'>
                    <option value="Type" disabled>Type</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Student">Student</option>
                </select>
                <div className="error"></div>
                <button type='submit' className='userButton'>LogIn</button>
            </form>            
        </div>
    )
}