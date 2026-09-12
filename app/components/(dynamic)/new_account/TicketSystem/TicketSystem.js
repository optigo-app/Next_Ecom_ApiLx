import React from 'react'
import './TicketSystem.scss'
import { Button } from '@mui/material'

const TicketSystem = () => {
    const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
    const loginUserDetails = JSON.parse(sessionStorage.getItem('loginUserDetail'));

    const handleRedirect = () => {
        window.open(`http://nzen/calllogweb/?userid=${loginUserDetails?.userid}&YearCode=${storeInit?.YearCode}&sv=${storeInit?.sv}&sp=14&version=_Ticketv4&type=website&mode=ticket`, '_blank');
    };

    return (
        <div className='smr_ticketSys_mainDiv'>
            <iframe src={`http://nzen/calllogweb/?userid=${loginUserDetails?.userid}&YearCode=${storeInit?.YearCode}&sv=${storeInit?.sv}&sp=14&version=_Ticketv4&type=website&mode=ticket`} name="myiFrame" style={{ border: "1px solid #000 ", scrolling: "no", frameborder: "1", marginheight: "0px", marginwidth: "0px", height: "400px", width: "80%" }} allowfullscreen></iframe>
            <Button className='smr_ticketSys_Button' variant="contained" onClick={handleRedirect}>Ticket System login</Button>
        </div>
    )
}

export default TicketSystem
