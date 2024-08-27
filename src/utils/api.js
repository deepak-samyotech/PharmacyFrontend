/*eslint-disable*/
import { toast } from "react-toastify";
import { apiUrl, baseurl } from "./constants";
import axios from "axios";

export async function updateEmployeeData(formData, empId) {
  try {
    console.log("I  update");
    const response = await axios.put(`${baseurl}${apiUrl.updateEmployee}${empId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    if (response.status === 200) return true;
  } catch (error) {
    console.log(error);

  }
}

export async function getInvoiceData(url) {
  try {
    const response = await axios.get(url);

    return response; 
  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      title: 'Error!',
      text: 'Failed to save customer ledger.',
      icon: 'error'
    });
  }
}




