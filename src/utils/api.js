/*eslint-disable*/
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

