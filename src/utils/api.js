import { apiUrl, baseurl } from "./constants";
import axios from "axios";

export async function updateEmployeeData(formData, empId) {

    console.log("I  update");
    axios
      .put(`${baseurl}${apiUrl.updateEmployee}${empId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 201) {
            return true;
        }
      })
      .catch((error) => {
        console.error("Error updating customer with ID ${id}:", error);
      });
}

