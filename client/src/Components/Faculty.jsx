import React, { Component,useEffect,useState } from 'react';
import './Faculty.css';
import Header from './Header';
import {Redirect} from 'react-router-dom'
import axios from 'axios';

//This is Faculty Home Page Component
export default function Faculty(props){
    //schedules - contain all the schedules that student are requesting
    const [schedules,setSchedules]=useState([])
    //useEffect - fetch all the schedules that student requested
    useEffect(()=>{
        axios.get('/allSchedule')
        .then(result=>{
            setSchedules(result.data)
        })
    },[])
    //modifySchedule - decides wheather the faculty accept or reject the schedule
    //and update to students
    const modifySchedule=(id,type,index)=>{
        axios.patch(`/modifySchedule/${id}`,{
            Status:type
        })
        .then(result=>{
            const newSchedules=[...schedules]
            if(type==='Rejected'){
                newSchedules.splice(index,1)
                setSchedules(newSchedules)
            }
            else{
                console.log(result.data)
                newSchedules[index]=result.data
                setSchedules(newSchedules)
            }
        })
    }
    //Here if user is authenticated he redirect to the requested page,
    // else redirected to Home Page
    return(
        <>
        {(localStorage.getItem('token') && props.location.state)  ?
            <div id='facultyPage'>
                <Header/>
                <div className='welcomeMsg'>Welcome Faculty ,</div>
                <h2>Requested Meeting Schedules</h2>
                <div className='facultyTable'>
                    <table className='meetingRequest'>
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((data,index)=>{
                                return(
                                    <tr>
                                        <td>{data.student.Name}</td>
                                        <td>{data.Date}</td>
                                        <td>{data.Slot}</td>
                                        {data.Status==='Pending' &&
                                            <td><button onClick={()=>modifySchedule(data._id,'Confirmed',index)}>Accept</button><button onClick={()=>modifySchedule(data._id,'Rejected',index)}>Reject</button></td>
                                        }
                                        {data.Status==='Confirmed' &&
                                            <td>{data.Status}</td>
                                        }
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div> : <Redirect to='/Home'/>
        }
        </>
        
    )
}