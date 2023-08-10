const express = require("express");
const app = express();
const events = require("../model/event");
const {start,end,slotduration,timezone} = require("../config/constants")

app.get("/static",(req,res)=>{
    var obj = {
        starthours : start,
        endhours : end,
        duration : slotduration,
        timezone : timezone
    }
    res.send({success : true,info : obj});
})

app.post("/slots", async(req,res)=>{
    const details = req.body.formdata;
    const selectedduration = parseInt(details.duration,10); // convert duration to interger since it is converted to string when sent to backend
    
    const selecteddate = new Date(req.body.date); // when using Date object date is converted to UTC -> 5hrs 30min is reduced form IST timezone
    const hoursToAdd = 5; // we add back 5hrs 30min to make it back to IST
    const minutesToAdd = 30;
    selecteddate.setHours(selecteddate.getHours() + hoursToAdd)
    selecteddate.setMinutes(selecteddate.getMinutes() + minutesToAdd)// selected Date is back to the originally selected date by the user.
    
    const endselecteddate = new Date(selecteddate);
    endselecteddate.setHours(23,59,59,999);// end of selected date is the last millisecond of selecteddate

    try{

        const bookedevents = events.find({
            startDateTime : { $gte : selecteddate , $lt : endselecteddate}
        }); // retrieve booked slots for the selected date to check overlap

        if(start.slice(2,3) === "A"){ // to convert the start constant to hours in 24 format
            startHours = parseInt(start.slice(0,3),10);
        }
        else{
            startHours = parseInt(start.slice(0,3),10) + 12;
        }
        
        if(end.slice(2,3) === "A"){// to convert the end constant to hours in 24 form
            endHours = parseInt(end.slice(0,3),10);
        }
        else{
            endHours = parseInt(end.slice(0,3),10) + 12;
        }

        const freeslots = []; // array which will contain our free slots

        let tempslot = new Date(selecteddate);
        tempslot.setHours(startHours,0,0,0);// temp slot of the date to start our loop from and check for overlap on bookedevent
        tempslot.setHours(tempslot.getHours() + hoursToAdd);// since time is getting converted to UTC have to add 5hrs 30 min
        tempslot.setMinutes(tempslot.getMinutes() + minutesToAdd);// since time is getting converted to UTC have to add 5hrs 30 min
        while(tempslot.getHours() < (endHours + hoursToAdd)){
            
            const slotloopstart = new Date(tempslot); // loopslotstart for the 
            const slotloopend = new Date(tempslot);

            slotloopend.setMinutes(slotloopend.getMinutes() + slotduration);

            let isoverlapped = false;

            console.log(slotloopstart);
            for(const event in bookedevents){
                if((event.startDateTime >= slotloopstart && event.startDateTime <= slotloopend) || (event.endDateTime >= slotloopstart && event.endDateTime <= slotloopend)){
                    isoverlapped = true;
                    console.log("loop broken");
                    break;
                }
            }

            if(!isoverlapped){
                freeslots.push(slotloopstart);
            }

            tempslot.setMinutes(tempslot.getMinutes() + slotduration);
            console.log("incremented",tempslot.getHours());
        }

        if(tempslot.getMinutes() < minutesToAdd){
            freeslots.push(tempslot);
        }

        res.send({success : true,info : freeslots});

    }
    catch(error){
        console.log("*********error*********",error);
        res.send({success : false});
    }
})

module.exports = app;