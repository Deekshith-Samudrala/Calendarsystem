import axios from "axios";
import {api} from "../Constants/api"

const getstaticdetails = async ()=>{
    let result = await axios.get(`${api}/event/static`);
    return result.data;
}

const availableslots = async (data)=>{
    let result = await axios.post(`${api}/event/slots`,data);
    return result.data;
}
export default {getstaticdetails, availableslots};