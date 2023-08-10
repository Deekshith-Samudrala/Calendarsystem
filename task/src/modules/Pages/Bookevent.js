import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from "yup";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import slotservice from '../../Services/slotservice';

const Bookevent = () => {

   let [selecteddate,setSelecteddate] = useState("");
   let [dateerr,setDateerr] = useState(true);
   let [formsubmit,setFormsubmit] = useState(false);

   useEffect(()=>{
      
      const getstatic = async ()=>{
         let result = await slotservice.getstaticdetails();
      }
      
      getstatic();

   },[])

   const disabledbeforedate = new Date(2023,7,3);
   const disabledafterdate = new Date(2023,9,3);

   const isvaliddate = (date)=>{
      return date <= disabledafterdate && date >= disabledbeforedate;
   }

   let formschema = yup.object({
      name : yup.string().required("Enter your name"),
      contact : yup.number().required("Enter contact Number").typeError("Enter only Numbers").min(7000000000,"Enter valid Number").max(9999999999,"Enter valid Number"),
      duration : yup.string().required("Select the duration"),
      timezone : yup.string().required("Select a time zone")
   })

   let {handleChange,touched,handleSubmit,errors,values} = useFormik({
      initialValues : {
         name : "",
         contact : "",
         duration : "",
         timezone : "",
      },
      onSubmit : async (formdata)=>{
         setFormsubmit(true);
         selecteddate.setHours(0,0,0,0);
         let obj = {formdata : formdata,date : selecteddate.toLocaleDateString('en-us')}
         console.log(obj);
         let result = await slotservice.availableslots(obj);
      },
      validationSchema : formschema
   })

      let datechange = (date)=>{
         setDateerr(false);
         setSelecteddate(date);
      }
   
    return (
        <>
            <div className='container-fluid'>
            <h2 className='text-center my-3'><u><i><b>Slot Booking</b></i></u></h2>
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
                                 <label>Duration</label> 
                                 <select className={'form-control' + (errors.duration && touched.duration ? " is-invalid" : "")} name="duration" onChange={handleChange}>
                                    <option value="">Select Duration</option>
                                    <option value="30">30 Min</option>
                                    <option value="60">60 Min</option>
                                 </select>
                                 <small className='text-danger'>
                                    {
                                       errors.duration && touched.duration ? errors.duration : ""
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
                                 <div className='alert alert-danger text-center'>Please submit the form to check available slots</div>
                              </div>
                           ) 
                        }
                     </div>
                  </div>
                </div>
            </div>
        </>
    )
}

export default Bookevent