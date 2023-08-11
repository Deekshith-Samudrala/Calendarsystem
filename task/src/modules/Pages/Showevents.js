import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import slotservice from '../../Services/slotservice';

const Showevents = () => {

   let [selectedstartdate,setSelectedstartdate] = useState("");
   let [selectedenddate,setSelectedenddate] = useState("");
   let [slotsinrangearr,setSlotsinrangearr] = useState([]);

   //enabling only a range of dates for the user to select start date from.
   const disabledbeforestartdate = new Date(2023,7,3);
   const disabledafterstartdate = new Date(2023,9,3);
   
   let [disabledbeforeenddate,setDisabledbeforeenddate] = useState(disabledafterstartdate);

   const disabledafterenddate = new Date(2023,9,3);

   const isvalidstartdate = (date)=>{
      return date <= disabledafterstartdate && date >= disabledbeforestartdate;
   }

   const isvalidenddate = (date)=>{
      return date <= disabledafterenddate && date >= disabledbeforeenddate;
   }

   let startdatechange = (date)=>{
      setSelectedstartdate(date);
      setDisabledbeforeenddate(date);
   }

   let enddatechange = (date)=>{
      setSelectedenddate(date);
   }
   
   let getslotsinrange = async ()=>{
      let result = await slotservice.bookedslotsinrange(selectedstartdate,selectedenddate);
      setSlotsinrangearr(result.info);
      console.log(result.info);
   }

   return (
         <>
            <div className='container-fluid'>
               <h2 className='text-center mt-3 mb-5'><u><b>View Booked Slots</b></u></h2>
               <div className='row'>
                  <span style={{marginLeft : "auto"}} className='mr-5'>
                     <DatePicker dateFormat="yyyy/MM/dd" onChange={date=>startdatechange(date)} selected={selectedstartdate} filterDate={isvalidstartdate}></DatePicker>
                  </span>
                  <span style={{marginRight : "auto"}} className='ml-5'>
                     <DatePicker dateFormat="yyyy/MM/dd" onChange={date=>enddatechange(date)} selected={selectedenddate} filterDate={isvalidenddate}></DatePicker>
                  </span>
               </div>
               <div className='row text-center'>
                  <div className='col-md-6 offset-md-3 mt-5'>
                     <button className='btn btn-info' onClick={getslotsinrange}>Get Slots</button>
                  </div>
               </div>
               <div className='text-center mb-5 mt-2'>
                  <label className='text-center'><i>Time is shown in UTC format</i></label>
               </div>
               <div className='row'>
                  <div className='col-md-8 offset-md-2'>
                     {
                        slotsinrangearr.map((slot,index)=>{
                           return(
                              <React.Fragment key={index + 1}>
                                 <label className='btn btn-success mx-4'>{slot.startDateTime.slice(0,10)} Time : {slot.startDateTime.slice(11,16)}</label>
                              </React.Fragment>
                           )
                        })
                     }
                  </div>
               </div>
            </div>
         </>
   )
}

export default Showevents