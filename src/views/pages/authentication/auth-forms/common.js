import axios from "axios";
import Cookies from 'js-cookie';
import Swal from "sweetalert2";

const baseUrl = 'http://localhost:8080/';

export const authenticate = async()=>{
    try{
        console.log("basew : ",baseUrl);
        const token = Cookies.get('user_login');
        console.log("token : ",token);
        if(token){
            const response = await axios.post(`${baseUrl}/admin/auth`,{token});
            return response;
        }else{
            return false;
        }
    }catch(error){
        Swal.fire({icon:'error',text:'error while authenticate',timer:3000});
    }
}