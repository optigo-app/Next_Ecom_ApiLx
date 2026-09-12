import React from 'react'
import './Calllog.scss'
import { Button } from '@mui/material'

const Calllog = () => {
    const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
    const loginUserDetails = JSON.parse(sessionStorage.getItem('loginUserDetail'));

    const handleRedirect = () => {
        window.open(`http://calllog.web/?userid=${loginUserDetails?.userid}&YearCode=${storeInit?.YearCode}&sv=${storeInit?.sv}&sp=14&version=v4&type=website&mode=calllog`, '_blank');

    };

    return (
        <div className='smr_callLog_mainDiv'>
            {/* <iframe src={`http://calllog.web/?userid=${loginUserDetails?.userid}&YearCode=${storeInit?.YearCode}&sv=${storeInit?.sv}&sp=14&version=v4&type=website&mode=calllog`} name="myiFrame" style={{ border: "1px solid #000 ", scrolling: "no", frameborder: "1", marginheight: "0px", marginwidth: "0px", height: "400px", width: "80%" }} allowfullscreen></iframe> */}
            <iframe cusatt="ifm" id="iTask" pageid="18222" name="iTask" isgroupedmenu="0" src="http://calllog.web" frameborder="0" onload="ResizeFrame(this)" style={{ border: "1px solid #000 ", scrolling: "no", frameborder: "1", marginheight: "0px", marginwidth: "0px", height: "400px", width: "80%" }}></iframe>
            <Button className='smr_callLog_Button' variant="contained" onClick={handleRedirect}>Call log login</Button>
        </div>
    )
}

export default Calllog;


{/* <iframe cusatt="ifm" id="iTask" pageid="18222" name="iTask" isgroupedmenu="0" src="https://live.optigoapps.com/ITASK/task/app/itask?-=NzI4MjAyNTA2MjAxNjEzNTgzMTMjIyN7e2xpdmUub3B0aWdvYXBwcy5jb219fXt7MjB9fXt7aXRhc2t9fXt7aXRhc2t9fQ==-FLGz0l3QhQg=&amp;yc=e3tsaXZlLm9wdGlnb2FwcHMuY29tfX17ezIwfX17e2l0YXNrfX17e2l0YXNrfX0=&amp;ifid=iTask&amp;pid=18222" frameborder="0" onload="ResizeFrame(this)" style="width: 100%; height: 396px;" height="919"></iframe> */ }