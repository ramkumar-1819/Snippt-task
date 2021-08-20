import React, { Component,useState,useEffect } from 'react';
import Header from './Header';
import { Redirect } from 'react-router';
import './Student.css'
import axios from 'axios';

export default function Student(props){
    //totalMeeting - contain total Number of meeting that student request for meeting and confirmed meeting.
    //schedules - contain user requested schedules
    const [totalMeeting,updateTotalMeeting]=useState(0)
    const [schedules,setSchedules]=useState([])
    //useEffect - get user requested and confirmed meetings.
    useEffect(()=>{
        console.log(props.location.state)
        axios.post('/getStudentSchedule',{
            student:props.location.state
        })
        .then(result=>{
            console.log(result)
            setSchedules(result.data);
            updateTotalMeeting(totalNumberOfMeetings(result.data))
        })
        .catch(err=>alert(err.response.data))
    },[])
    //totalNumberOfMeetings - return total number of meetings that user requested and confirmed.
    const totalNumberOfMeetings=(datas)=>{
        let total=0;
            for(let meet of datas){
                if(meet.Status==='Pending' || meet.Status==='Confirmed'){
                    total+=1
                }
            }
        return total
    }
    //scheduleMeeting - Checking constrains and schedule meeting .
    const scheduleMeeting=(e)=>{
        e.preventDefault()
        const date=document.getElementById('meetingDate');
        const slot=document.getElementById('slots')
        if(date.value===""){
            alert('Select Date')
            date.focus()
            return
        }
        if(slot.value==='Slot'){
            alert('Select Slot')
            slot.focus()
            return
        }
        //If student has one confirmed meeting and
        //date of the meeting greater than today's day
        //then he can schedule only after confirmed meeting is done.
        for(let meet of schedules){
            if(meet.Status==='Confirmed'){
                if(new Date(new Date(meet.Date).getTime()+ 18.5 * 60 * 60 * 1000).getTime()>new Date().getTime()){
                    alert('You can Schedule only after the Confirmed Meeting is Over')
                    date.value=""
                    slot.value="Slot"
                    return
                }
            }
        }
        //If total requested and confirmed meeting is 2 then he can't book slot untill the 
        //meeting is over or faculty reject the schedule.
        if(totalMeeting===2){
            let flag=false
            for(let meet of schedules){
                    if(new Date(new Date(meet.Date).getTime()+ 18.5 * 60 * 60 * 1000).getTime()<new Date().getTime()){
                        flag=true
                    }
            }
            if(!flag){
                alert('You can maximum Schedule 2 Slots only')
                date.value=""
                slot.value="Slot"
                return
            }
        }
        //making api request to request for meeting
        axios.post('/Schedule',{
            student:props.location.state,
            Date:date.value,
            Slot:slot.value
        })
        .then(result=>{
            const newSchedules=[...schedules]
            for(let meet=0;meet<newSchedules.length;meet++){
                if(newSchedules[meet].Status==='Rejected' || new Date(new Date(newSchedules[meet].Date).getTime()+ 18.5 * 60 * 60 * 1000).getTime()<new Date().getTime()){
                    delete newSchedules[meet]
                }
            }
            const updatedSchedules=newSchedules.filter(data=>data!==undefined)
            updatedSchedules.push(result.data)
            updatedSchedules.sort(function(a,b){return new Date(a.Date).getTime()-new Date(b.Date).getTime()})
            setSchedules(updatedSchedules)
            updateTotalMeeting(updatedSchedules.length)
            date.value=""
            slot.value='Slot'
        })
        .catch(err=>alert(err.response.data))
    }
    //today - student can book 1 week in advance for a meeting.
    let today = new Date();
    today.setDate(today.getDate() +  7);
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    const yyyy = today.getFullYear();
    if(dd<10){
    dd='0'+dd
    } 
    if(mm<10){
    mm='0'+mm
    } 
    today = yyyy+'-'+mm+'-'+dd;

    return(
        <>
        {(localStorage.getItem('token') && props.location.state)?
            <div id='studentPage'>
                <Header/>
                <div id='Container'> 
                    <div className='scheduleSection'>
                        <button id='bookMeetingButton'>Schedule Meeting</button>
                        <form onSubmit={scheduleMeeting} className='scheduleMeeting'>
                            <input type="date" id='meetingDate' min={today}/>
                            <select id="slots" defaultValue='Slot'>
                                <option value="Slot" disabled>Slot</option>
                                <option value="1pm-2pm">1pm-2pm</option>
                                <option value="4pm-5pm">4pm-5pm</option>
                                <option value="6pm-7pm">6pm-7pm</option>
                            </select>
                            <button type='submit'>Schedule</button>
                        </form>
                    </div>
                    <div className='meetingsSection'>
                        <div id='totalMeeting'>Number of Meeting Scheduled and Requested- {totalMeeting}</div>
                        <h2>Meeting Request History</h2>
                        <div className='studentTable'>
                                <table className='meetingRequest'>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedules.map((data,index)=>{
                                            return(
                                                <tr>
                                                    <td>{data.Date}</td>
                                                    <td>{data.Slot}</td>
                                                    <td>{data.Status}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                        </div>
                    </div>
                </div>
            </div>:<Redirect to='/Home'></Redirect>
            }
        </>
    )
}