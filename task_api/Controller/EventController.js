const express = require("express");
const app = express();
const slots = require("../model/event");
const {start,end,slotduration} = require("../config/constants")

app.post("/bookslot", async (req,res)=>{

    try{
        
        let slotstart = new Date(req.body.date);
        let slotend = new Date(slotstart);

        slotend.setMinutes(slotend.getMinutes() + slotduration);

        let data = {
            name : req.body.data.name,
            contact : req.body.data.contact,
            startDateTime : slotstart,
            endDateTime : slotend
        };

        let result = await slots.create(data);

        res.send({success : true,info : result});
    }
    catch(error){
        console.log("*****error*****",error);
        res.send({success : false,error : error});
    }

})

app.post("/slots", async(req,res)=>{ // 

    const details = req.body.formdata;
    const selectedtimezone = details.timezone;

    const selecteddate = new Date(req.body.date); // when using Date object date is converted to UTC -> 5hrs 30min is reduced form IST timezone

    if(selectedtimezone == "IST"){
        var hoursToAdd = 5; // we add back 5hrs 30min to make it back to IST
        var minutesToAdd = 30;
    }
    if(selectedtimezone == "UTC"){
        var hoursToAdd = 0; // we need not add anything since time is UTC
        var minutesToAdd = 0;
    }
    if(selectedtimezone == "CDT"){
        var hoursToAdd = -5; // we subtract 5hrs to make it CDT
        var minutesToAdd = 0;
    }
    selecteddate.setHours(selecteddate.getHours() + hoursToAdd)
    selecteddate.setMinutes(selecteddate.getMinutes() + minutesToAdd)// selected Date is back to the originally selected date by the user.
    
    const endselecteddate = new Date(selecteddate);
    endselecteddate.setHours(23,59,59,999);// end of selected date is the last millisecond of selecteddate

    try{

        const bookedevents = await slots.find({
            startDateTime : { $gte : selecteddate , $lt : endselecteddate}
        }) // retrieve booked slots for the selected date to check overlap.

        console.log(bookedevents);

        if(start.endsWith("AM")){ // to convert the start constant to hours in 24 format
            var startHours = parseInt(start.slice(0,3),10);
        }
        else{
            var startHours = parseInt(start.slice(0,3),10) + 12;
        }
        
        if(end.endsWith("AM")){// to convert the end constant to hours in 24 form
            var endHours = parseInt(end.slice(0,3),10);
        }
        else{
            var endHours = parseInt(end.slice(0,3),10) + 12;
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

            for(var temp of bookedevents){
                console.log(temp,slotloopstart);
                if(
                    (temp.startDateTime >= slotloopstart && temp.startDateTime < slotloopend) ||
                    (temp.endDateTime > slotloopstart && temp.endDateTime <= slotloopend) ||
                    (temp.startDateTime <= slotloopstart && temp.endDateTime >= slotloopend)
                ){
                    isoverlapped = true;
                    break;
                }
            }

            if(!isoverlapped){
                freeslots.push(slotloopstart);
            }

            tempslot.setMinutes(tempslot.getMinutes() + slotduration);
        }

        if(tempslot.getMinutes() < minutesToAdd){
            freeslots.push(tempslot);
        }

        res.send({success : true,info : freeslots});

    }
    catch(error){
        console.log("*********error*********",error);
        res.send({success : false,error : error});
    }
})

module.exports = app;