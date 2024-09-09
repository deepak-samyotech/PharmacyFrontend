/*eslint-disable*/
import { toast } from "react-toastify";
import { apiUrl, baseurl } from "./constants";
import axios from "axios";
import Swal from "sweetalert2";
import { HttpStatusCodes } from 'utils/statusCodes';


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
    console.error("Error fetching data:", error);
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

