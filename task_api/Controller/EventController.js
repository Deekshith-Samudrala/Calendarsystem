const express = require("express");
const app = express();
const slots = require("../model/event");
const {start,end,slotduration,timezone} = require("../config/constants")

app.get("/getconstants",(req,res)=>{

    try{
        let obj = {
            start : start,
            end : end,
            slotduration : slotduration,
            timezone : timezone
        }

        res.send({success : true,info : obj})
    }
    catch(error){
        res.send({success : false,error : error});
    }
})

app.post("/bookslot", async (req,res)=>{

    try{
        
        let slotstart = new Date(req.body.date);
        let timezone = req.body.timezone;

        //since i want my database to have times in UTC i offset them based on the timezone selected by the user
        if(timezone === "IST"){
            slotstart.setHours(slotstart.getHours() - 5);
            slotstart.setMinutes(slotstart.getMinutes() - 30);
        }
        if(timezone === "CDT"){
            slotstart.setHours(slotstart.getHours() + 5);
        }

        let slotend = new Date(slotstart);
        slotend.setMinutes(slotend.getMinutes() + slotduration);

        //iam checking again for overlap on the booked slot
        let bookedslots = await slots.find({
            startDateTime : { $gte : slotstart , $lt : slotend }
        });

        let isoverlapped = false;

        for(var temp of bookedslots){ // To check if theres an overlap of the selected slot.
            if(
                (slotstart >= temp.startDateTime && slotend < temp.startDateTime) ||
                (slotstart > temp.endDateTime &&  slotend <= temp.endDateTime) ||
                ( slotstart <= temp.startDateTime &&  slotend >= temp.endDateTime)
            ){
                isoverlapped = true;
                break;
            } 
        }

        let data = {
            name : req.body.data.name,
            contact : req.body.data.contact,
            startDateTime : slotstart,
            endDateTime : slotend
        };

        if(!isoverlapped){
            let result = await slots.create(data);
            res.send({success : true,info : result});
        }
        else{
        res.send({success : false,error : "The slot is already booked ! Please try again !"});
        }

    }
    catch(error){
        console.log("*****error*****",error);
        return res.send({success : false,error : error});
    }
})

app.post("/freeslots", async(req,res)=>{ 

    const details = req.body.formdata;
    const selectedtimezone = details.timezone;

    const selecteddate = new Date(req.body.date); // when using Date object date is converted to UTC -> 5hrs 30min is reduced form IST timezone

    var hoursToAdd = 5;
    var minutesToAdd = 30;
    // we reduce 5hrs 30min to make it to UTC since data coming from frontend is intended to be UTC but taken as IST and then converted to UTC when sent to backend
    //we offset this time to make it to UTC again

    selecteddate.setHours(selecteddate.getHours() + hoursToAdd)
    selecteddate.setMinutes(selecteddate.getMinutes() + minutesToAdd)// selected Date is back to the originally selected date by the user.
    
    const endselecteddate = new Date(selecteddate);
    endselecteddate.setHours(23,59,59,999);// end of selected date is the last millisecond of selecteddate

    try{

        const bookedevents = await slots.find({
            startDateTime : { $gte : selecteddate , $lt : endselecteddate}
        }) // retrieve booked slots for the selected date to check overlap.

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
            //This while loops over all the possible slots on the selected date.

            const slotloopstart = new Date(tempslot); // looping slot start to check for overlap
            const slotloopend = new Date(tempslot); // looping slot end to check for overlap

            slotloopend.setMinutes(slotloopend.getMinutes() + slotduration);

            let isoverlapped = false;

            //this for loop loops on bookedevents array to check for overlap to exclude that slots
            //before sending the available slots to the user.
            for(var temp of bookedevents){
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
                //These if conditions exist to display times according to the time zone selected by the user
                if(selectedtimezone == "IST"){
                    // we add 5hrs 30min to convert to IST.
                    slotloopstart.setHours(slotloopstart.getHours() + 5);
                    slotloopstart.setMinutes(slotloopstart.getMinutes() + 30);
                }
                if(selectedtimezone == "UTC"){
                    // we need not add anything since time is UTC
                }
                if(selectedtimezone == "CDT"){
                    slotloopstart.setHours(slotloopstart.getHours() - 5);
                    // we subtract 5hrs to make it CDT
                }
                freeslots.push(slotloopstart);
            }

            tempslot.setMinutes(tempslot.getMinutes() + slotduration); 
        }

        if(tempslot.getMinutes() < minutesToAdd){ 
            // This is to add the last slot which gets excluded since our loop is 
            // in hours and our slot duration is 30min so last slot gets excluded.

            //These if conditions exist to display times according to the time zone selected by the user
            if(selectedtimezone == "IST"){
                // we add 5hrs 30min to convert to IST.
                tempslot.setHours(tempslot.getHours() + 5);
                tempslot.setMinutes(tempslot.getMinutes() + 30);
            }
            if(selectedtimezone == "UTC"){
                // we need not add anything since time is UTC
            }
            if(selectedtimezone == "CDT"){
                tempslot.setHours(tempslot.getHours() - 5);
                // we subtract 5hrs to make it CDT
            }
            freeslots.push(tempslot);
        }
        
        //timezone is also sent because when user books a slot i offset the time to convert it to UTC
        //before inserting into my database since my database is in UTC format.
        //i use this "timezoneselected" in my bookslot api.
        res.send({success : true,info : freeslots,timezoneselected : selectedtimezone});

    }
    catch(error){
        console.log("*********error*********",error);
        res.send({success : false,error : error});
    }
})

app.get("/slotsinrange/:startdate/:enddate",async (req,res)=>{

    try{
        startdate = req.params.startdate;
        enddate = req.params.enddate; 

        const bookedslotsinrange = await slots.find({
            startDateTime : { $gte : startdate , $lt : enddate}
        }) // retrieve booked slots for the selected date to check overlap.
        console.log(bookedslotsinrange);
        res.send({success : true,info : bookedslotsinrange});
    }
    catch(error){
        console.log(error);
        res.send({success : false,error :error});
    }   
})

module.exports = app;