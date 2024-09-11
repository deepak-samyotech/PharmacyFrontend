/*eslint-disable*/
import { toast } from "react-toastify";
import { apiUrl, baseurl } from "./constants";
import axios from "axios";
import Swal from "sweetalert2";
import { HttpStatusCodes } from 'utils/statusCodes';
import employee from "menu-items/employee";


export function handleRetry() {
  window.location.reload();
};

export async function fetchCustomer() {
  try {
    return await axios.get(`${baseurl}/customer`);
  } catch (error) {
    throw error;
  }
}

export async function fetchSupplier() {
  try {
    return await axios.get(`${baseurl}/supplier`);
  } catch (error) {
    throw error;
  }
}

export async function handleRegister(firstName, lastName, email, password) {
  try {
    return await axios.post(`http://localhost:8080/register`, {
      firstName,
      lastName,
      email,
      password
    });
  } catch (error) {
    throw error;
  }
}

export async function handlelogin(values) {
  try {
    return await axios.post(`${baseurl}/login`, {
      email: values.email,
      password: values.password,
    });
  } catch (error) {
    throw error;
  }
}

export async function updateEmployeeData(formData, empId) {
  try {
    const response = await axios.put(`${baseurl}${apiUrl.updateEmployee}${empId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    if (response.status === HttpStatusCodes.OK) return true;
  } catch (error) {
    console.log(error);

  }
}

export async function getInvoiceData(url) {
  try {
    return await axios.get(url);
  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      title: 'Error!',
      text: 'Something went wrong',
      icon: 'error'
    });
  }
}

export async function fetchMedicine() {
  try {
    return await axios.get(`${baseurl}/medicine`);

  } catch (error) {
    throw error;
  }
}

export async function searchMedicines(posValue, searchTerm) {
  try {
    return await axios.get(
      `${baseurl}/medicine/search?product_id=${posValue}`,
      {
        params: { query: searchTerm },
      }
    );

  } catch (error) {
    console.error("Error searching for medicines:", error);
  }
}

export async function searchCustomer(cus_contact, searchTerms) {
  try {
    return await axios.get(
      `${baseurl}/customer/search?cus_contact=${cus_contact}`,
      {
        params: { query: searchTerms },
      }
    );
  } catch (error) {
    console.error("Error searching for customer:", error);
  }
}

export async function customerLedgerPost(formDataCustomerLedger) {
  try {
    return await axios.post(`http://localhost:8080/Customer_ledger`, formDataCustomerLedger, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to save customer ledger.",
      icon: "error",
    });
  }
}

export async function invoiceDataPost(formDataManageInvoice) {
  try {
    return await axios.post(`${baseurl}/manage_invoice`, formDataManageInvoice, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to save invoice.",
      icon: "error",
    });
  }
}

export async function updateProductQuantity(updatedQuantity) {
  try {
    return await axios.put(`${baseurl}/medicine/updateQuantity`, updatedQuantity, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to update new Quantity.",
      icon: "error",
    });
  }
}

export async function todaySales() {
  try {

    return await axios.get(`${baseurl}/manage_invoice/todaySale`);

  } catch (error) {
    console.log("Error : ", error);
    toast.error("Something went wrong while fetching todaysale");
  }
}

export async function putCustomerLedgerData(ledger_id, formData) {
  try {
    return await axios.put(`${baseurl}/customer_ledger/${ledger_id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.log("Error : ", error);
    toast.error("Something went wrong while changing customer ledger");
  }
}

// Account API
export async function PostClosingData(formData) {
  try {
    return axios.post(`${baseurl}/closing`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  } catch (error) {
    throw error;
  }
}

export async function fetchClosingData() {
  try {
    return await axios.get(`${baseurl}/closing`);
  } catch (error) {
    throw error;
  }
}

export async function fetchCustomerLedger() {
  try {
    return await axios.get(`${baseurl}/customer_ledger`);
  } catch (error) {
    throw error;
  }
}

export async function fetchBankData() {
  try {
    return await axios.get("http://localhost:8080/bank");
  } catch (error) {
    throw error;
  }
}

export async function postBankData(formData) {
  try {
    return await axios.post(`${baseurl}/bank`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  } catch (error) {

  }
}

export async function fetchSuplierLedger() {
  try {
    return await axios.get(`${baseurl}/supplier_ledger`);
  } catch (error) {
    throw error;
  }
}

// Customer API's
export async function postCustomerData(formData) {
  try {
    return axios.post(`${baseurl}/customer`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  } catch (error) {
    throw error;
  }
}

export async function handleEditCustomer(id,formData) {
  try {
    return await axios.put(`http://localhost:8080/customer/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  } catch (error) {
    throw error;
  }
}

// Employee 
export async function employeeRegister(formData){
try {
  return await axios.post(
    `${baseurl}/employee-register`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
} catch (error) {
  throw error;
}
}

export async function fetchEmloyeeData() {
  try {
    return await axios.get(`${baseurl}/employee-register`);
  } catch (error) {
    throw error;
  }
}

// Help section
export async function fetchAmbulance() {
  try {
    return await axios.get(`${baseurl}/ambulance`);
  } catch (error) {
    throw error;
  }
}

export async function postAmbulanceData(formData) {
  try {
    return axios.post(`${baseurl}/ambulance`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  } catch (error) {
    throw error;
  }
}

export async function fetchDoctor() {
  try {
    return await axios.get(`${baseurl}/doctor`);
  } catch (error) {
    throw error;
  }
}


export async function postDoctorData(formData) {
  try {
    return axios.post(`${baseurl}/doctor`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  } catch (error) {
    throw error;
  }
}

export async function fetchFireService() {
  try {
    return await axios.get(`${baseurl}/fireService`);
  } catch (error) {
    throw error;
  }
}

export async function postFireServiceData(formData) {
  try {
    return axios.post(`${baseurl}/fireService`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  } catch (error) {
    throw error;
  }
}


export async function fetchHospital() {
  try {
    return await axios.get(`${baseurl}/hospital`);
  } catch (error) {
    throw error;
  }
}

export async function postHospitalData(formData) {
  try {
    return axios.post(`${baseurl}/hospital`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  } catch (error) {
    throw error;
  }
}

// Invoice section
export async function fetchInvoices() {
  try {
    return await axios.get(`${baseurl}/manage_invoice`);
  } catch (error) {
    throw error;
  }
}
