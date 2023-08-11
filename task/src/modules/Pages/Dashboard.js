import React, { useEffect, useState } from 'react'
import slotservice from '../../Services/slotservice'

const Dashboard = () => {

    let [details,setDetails] = useState([]);

    useEffect(()=>{
        let getdeets = async()=>{
            let result = await slotservice.getconstantsdetails();
            if(result.success){
                console.log(result);
                setDetails(result.info);
            }
        }
        getdeets();
    },[details])

  return (
        <>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-md-8 offset-md-2'>
                        <div className='text-center mt-3 mb-5'>
                            <h3><u>Welcome To Dr.Johns Online Clinic</u></h3> 
                        </div>
                    </div>
                    <div className='col-md-4 offset-md-4'>
                        <table className='table table-dark table-striped table-hover'>
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td className='text-center border-right'>Timezone</td>
                                    <td className='text-center'>{details.timezone}</td>
                                </tr>
                                <tr>
                                    <td className='text-center border-right'>Start-Hours</td>
                                    <td className='text-center'>{details.start}</td>
                                </tr>
                                <tr>
                                    <td className='text-center border-right'>End-Hours</td>
                                    <td className='text-center'>{details.end}</td>
                                </tr>
                                <tr>
                                    <td className='text-center border-right'>Slot-Duration</td>
                                    <td className='text-center'>{details.slotduration}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
  )
}

export default Dashboard