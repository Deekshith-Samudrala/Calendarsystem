import axios from "axios";
import {api} from "../Constants/api"

const getconstantsdetails = async()=>{
    let result = await axios.get(`${api}/event/getconstants`);
    return result.data;
}

const bookaslot = async (data)=>{
    let result = await axios.post(`${api}/event/bookslot`,data);
    return result.data;
}

const availableslots = async (data)=>{
    let result = await axios.post(`${api}/event/freeslots`,data);
    return result.data;
}

const bookedslotsinrange = async(startdate,enddate)=>{
    let result = await axios.get(`${api}/event/slotsinrange/${startdate}/${enddate}`);
    return result.data;
}
export default { getconstantsdetails, bookaslot, availableslots, bookedslotsinrange };