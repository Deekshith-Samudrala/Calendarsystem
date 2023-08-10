import axios from "axios";
import {api} from "../Constants/api"

const bookaslot = async (data)=>{
    let result = await axios.post(`${api}/event/bookslot`,data);
    return result.data;
}

const availableslots = async (data)=>{
    let result = await axios.post(`${api}/event/slots`,data);
    return result.data;
}
export default { bookaslot, availableslots };