import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from "yup";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import slotservice from '../../Services/slotservice';
import { useNavigate } from 'react-router-dom';

const Bookevent = () => {

   let navigate = useNavigate();

   let [selecteddate,setSelecteddate] = useState("");
   let [dateerr,setDateerr] = useState(true);
   let [formsubmit,setFormsubmit] = useState(false);
   let [formsubmiterr,setFormsubmiterr] = useState("Please submit the form to check available slots")
   let [availableslotsarr,setAvailableslotsarr] = useState([]);
   let [dispdate,setDispdate] = useState();
   let [userdata,setUserdata] = useState();

   const disabledbeforedate = new Date(2023,7,3);
   const disabledafterdate = new Date(2023,9,3);

   const isvaliddate = (date)=>{
      return date <= disabledafterdate && date >= disabledbeforedate;
   }

   let formschema = yup.object({
      name : yup.string().required("Enter your name"),
      contact : yup.number().required("Enter contact Number").typeError("Enter only Numbers").min(7000000000,"Enter valid Number").max(9999999999,"Enter valid Number"),
      timezone : yup.string().required("Select a time zone")
   })

   let {handleChange,touched,handleSubmit,errors} = useFormik({
      initialValues : {
         name : "",
         contact : "",
         timezone : "",
      },
      onSubmit : async (formdata)=>{
         setFormsubmit(true);
         setUserdata(formdata);
         selecteddate.setHours(0,0,0,0);// to make hours minutes seconds and milliseconds to zero.
         let obj = {formdata : formdata,date : selecteddate.toLocaleDateString('en-us')};
         console.log(obj);
         let result = await slotservice.availableslots(obj);
         if(result.success){
            if(result.info.length === 0){
               setFormsubmit(false);
               setFormsubmiterr("There are no available slots on this date !");
            }
            else{
            setAvailableslotsarr(result.info);
            setDispdate(result.info[0])
            console.log(result.info);
         }
         }
         else{
            setFormsubmit(false);
            setFormsubmiterr("An error has occurred ! please try again");
            console.log(result.error);
         }
      },
      validationSchema : formschema
   })

      let datechange = (date)=>{
         setDateerr(false);
         setSelecteddate(date);
      }

      let bookslot = async (e)=>{
         let obj = {
            data : userdata,
            date : e.target.value
         }
         
         let result = await slotservice.bookaslot(obj);
         if(result.success){
            navigate("/");
         }
         else{
            setFormsubmit(false);
            setFormsubmiterr("An error has occurred ! please try again");
            console.log(result.error);
         }
      }
   
    return (
        <>
            <div className='container-fluid'>
            <h2 className='text-center my-3'><u><b>Slot Booking</b></u></h2>
                <div className='row'>
                  <div className='col-md-6 border-right'>
                     <h4 className='text-center my-3'>Check available slots</h4>
                     <form onSubmit={handleSubmit}>
                        <div className='row my-3'>
                           <div className='col-md-6 offset-md-3'>
                              <div className='form-group'>
                                 <label>Name</label>
                                 <input type="text" className={'form-control' + (errors.name && touched.name ? " is-invalid" : "")} name="name" onChange={handleChange}></input>
                                 <small className='text-danger'>
                                       {
                                          errors.name && touched.name ? errors.name : ""
                                       }
                                 </small>
                              </div>
                              <div className='form-group'>
                                 <label>Contact</label>
                                 <input type="text" className={'form-control' + (errors.contact && touched.contact ? " is-invalid" : "")} name="contact" onChange={handleChange}></input>
                                 <small className='text-danger'>
                                       {
                                          errors.contact && touched.contact ? errors.contact : ""
                                       }
                                 </small>
                              </div>
                              <div className='form-group'>
                                 <label>Time-Zone</label>
                                 <select className={'form-control' + (errors.timezone && touched.timezone ? " is-invalid" : "")} name="timezone" onChange={handleChange}>
                                    <option value="">Select a Time Zone</option>
                                    <option>IST</option>
                                    <option>UTC</option>
                                    <option>CDT</option>
                                 </select>
                                 <small className='text-danger'>
                                    {
                                       errors.timezone && touched.timezone ? errors.timezone : ""
                                    }
                                 </small>
                              </div>
                              <div className='form-group'>
                                 <label>Date</label>
                                 <div>
                                    <DatePicker className="form-control" dateFormat="yyyy/MM/dd" onChange={date=>datechange(date)} selected={selecteddate} filterDate={isvaliddate}></DatePicker>
                                 </div>
                              </div>
                              <button type="submit" className='btn btn-primary' disabled={dateerr}>Show availale slots</button>
                           </div>
                        </div>
                     </form>
                  </div>
                  <div className='col-md-6'>
                     <h4 className='text-center my-3'>Available slots</h4>
                     <div className='row'>
                        {
                           formsubmit ? "" : (
                              <div className='col-md-8 offset-md-2'>
                                 <div className='alert alert-danger text-center'>{formsubmiterr}</div>
                              </div>
                           ) 
                        }
                        <div className='col-md-12 ml-4'>
                           {
                              availableslotsarr.length ? 
                              (
                                 <div className='text-center mr-5 mb-2'><i><u>Date Selected : {dispdate.toLocaleString().slice(0,10)}</u></i></div>
                              ) : ""
                           }
                           {
                              availableslotsarr.map((date,index)=>{
                                 return (
                                    <React.Fragment key={index}>
                                       <button className='btn btn-danger btn-lg m-3' onClick={(e)=>bookslot(e)} value={date}>{date.slice(11,16)}</button>
                                    </React.Fragment>
                                 )
                              })
                           }
                        </div>
                     </div>
                  </div>
                </div>
            </div>
        </>
    )
}

export default Bookevent