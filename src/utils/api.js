/*eslint-disable*/
import { toast } from "react-toastify";
import { addToken, addToken2, apiUrl, baseurl, headers } from "./constants";
import axios from "axios";
import Swal from "sweetalert2";
import { HttpStatusCodes } from 'utils/statusCodes';
import employee from "menu-items/employee";


export function handleRetry() {
  window.location.reload();
};

export async function fetchCustomer() {
  try {
    return await axios.get(`${baseurl}/customer`, addToken);
  } catch (error) {
    throw error;
  }
}

export async function fetchSupplier() {
  try {
    return await axios.get(`${baseurl}/supplier` , addToken);
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
    const response = await axios.put(`${baseurl}${apiUrl.updateEmployee}${empId}`, formData, addToken2)
    if (response.status === HttpStatusCodes.OK) return true;
  } catch (error) {
    console.log(error);

  }
}

export async function getInvoiceData(url) {
  try {
    return await axios.get(url, addToken);
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
    return await axios.get(`${baseurl}/medicine`, addToken);

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
        headers:headers,
      }
    );

  } catch (error) {
    throw error;
  }
}

export async function searchCustomer(cus_contact, searchTerms) {
  try {
    return await axios.get(
      `${baseurl}/customer/search?cus_contact=${cus_contact}`,
      {
        params: { query: searchTerms },
        headers:headers,
      }
    );
  } catch (error) {
    console.error("Error searching for customer:", error);
  }
}

export async function customerLedgerPost(formDataCustomerLedger) {
  try {
    return await axios.post(`${baseurl}/Customer_ledger`, formDataCustomerLedger, addToken2)
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
    return await axios.post(`${baseurl}/manage_invoice`, formDataManageInvoice, addToken2)
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
    return await axios.put(`${baseurl}/medicine/updateQuantity`, updatedQuantity, addToken)
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

    return await axios.get(`${baseurl}/manage_invoice/todaySale`, addToken);

  } catch (error) {
    console.log("Error : ", error);
    toast.error("Something went wrong while fetching todaysale");
  }
}

export async function putCustomerLedgerData(ledger_id, formData) {
  try {
    return await axios.put(`${baseurl}/customer_ledger/${ledger_id}`, formData, addToken2);
  } catch (error) {
    console.log("Error : ", error);
    toast.error("Something went wrong while changing customer ledger");
  }
}

// Account API
export async function PostClosingData(formData) {
  try {
    return axios.post(`${baseurl}/closing`, formData, addToken2)
  } catch (error) {
    throw error;
  }
}

export async function fetchClosingData() {
  try {
    return await axios.get(`${baseurl}/closing`, addToken);
  } catch (error) {
    throw error;
  }
}

export async function fetchCustomerLedger() {
  try {
    return await axios.get(`${baseurl}/customer_ledger`, addToken);
  } catch (error) {
    throw error;
  }
}

export async function fetchBankData() {
  try {
    return await axios.get("http://localhost:8080/bank", addToken);
  } catch (error) {
    throw error;
  }
}

export async function postBankData(formData) {
  try {
    return await axios.post(`${baseurl}/bank`, formData, addToken2)
  } catch (error) {

  }
}

export async function fetchSuplierLedger() {
  try {
    return await axios.get(`${baseurl}/supplier_ledger`, addToken);
  } catch (error) {
    throw error;
  }
}

// Customer API's
export async function postCustomerData(formData) {
  try {
    return axios.post(`${baseurl}/customer`, formData, addToken2)
  } catch (error) {
    throw error;
  }
}

export async function handleEditCustomer(id, formData) {
  try {
    return await axios.put(`http://localhost:8080/customer/${id}`, formData, addToken2)
  } catch (error) {
    throw error;
  }
}

// Employee 
export async function employeeRegister(formData) {
  try {
    return await axios.post(
      `${baseurl}/employee-register`,
      formData,
      addToken2
    );
  } catch (error) {
    throw error;
  }
}

export async function fetchEmloyeeData() {
  try {
    return await axios.get(`${baseurl}/employee-register`, addToken);
  } catch (error) {
    throw error;
  }
}

// Help section
export async function fetchAmbulance() {
  try {
    return await axios.get(`${baseurl}/ambulance`, addToken);
  } catch (error) {
    throw error;
  }
}

export async function postAmbulanceData(formData) {
  try {
    return axios.post(`${baseurl}/ambulance`, formData, addToken2)
  } catch (error) {
    throw error;
  }
}

export async function fetchDoctor() {
  try {
    return await axios.get(`${baseurl}/doctor`, addToken);
  } catch (error) {
    throw error;
  }
}


export async function postDoctorData(formData) {
  try {
    return axios.post(`${baseurl}/doctor`, formData, addToken2)
  } catch (error) {
    throw error;
  }
}

export async function fetchFireService() {
  try {
    return await axios.get(`${baseurl}/fireService`, addToken);
  } catch (error) {
    throw error;
  }
}

export async function postFireServiceData(formData) {
  try {
    return axios.post(`${baseurl}/fireService`, formData, addToken2)
  } catch (error) {
    throw error;
  }
}


export async function fetchHospital() {
  try {
    return await axios.get(`${baseurl}/hospital`, addToken);
  } catch (error) {
    throw error;
  }
}

export async function postHospitalData(formData) {
  try {
    return axios.post(`${baseurl}/hospital`, formData, addToken2)
  } catch (error) {
    throw error;
  }
}

export async function fetchPolice() {
  try {
    return await axios.get(`${baseurl}/police`, addToken);
  } catch (error) {
    throw error;
  }
}

export async function postPoliceData(formData) {
  try {
    return axios.post(`${baseurl}/police`, formData, addToken2);
  } catch (error) {
    throw error;
  }
}

// Invoice section
export async function fetchInvoices() {
  try {
    return await axios.get(`${baseurl}/manage_invoice`, addToken);
  } catch (error) {
    throw error;
  }
}

// Medicine section
export async function fetchSupplierData() {
  try {
    return await axios.get(`${baseurl}/medicine/s-data/:data`, addToken);
  } catch (error) {
    throw error;
  }
}

export async function postMedicineData(formData) {
  try {
    return await axios.post(`${baseurl}/medicine`, formData, addToken2)
  } catch (error) {
    throw error;
  }
}

export async function putMedicineData(id, formData) {
  try {
    return await axios.put(`${baseurl}/medicine/${id}`, formData, addToken2)
  } catch (error) {
    throw error;
  }
}

// report
export async function fetchPurchaseHistoryData() {
  try {
    return await axios.get(`${baseurl}/purchase-history`, addToken);
  } catch (error) {
    throw error;
  }
}

export async function fetchPurchaseReturnData() {
  try {
    return await axios.get(`${baseurl}/purchase_return`, addToken);
  } catch (error) {
    throw error;
  }
}

export async function fetchSaleData() {
  try {
    return await axios.get(`${baseurl}/manage_invoice/totalSale`, addToken);
  } catch (error) {
    throw error;
  }
}

export async function fetchSaleReturnData() {
  try {
    return await axios.get(`${baseurl}/sale_return`, addToken);
  } catch (error) {
    throw error;
  }
}

export async function fetchTodaySaleData() {
  try {
    return await axios.get(`${baseurl}/manage_invoice/todaySale`, addToken);
  } catch (error) {
    throw error;
  }
}

export async function fetchTodayPurchase() {
  try {
    return await axios.get(`${baseurl}/purchase/todayPurchase`, addToken);
  } catch (error) {
    throw error;
  }
}

// return
export async function fetchInvoiceData() {
  try {
    return await axios.get(`${baseurl}/manage_invoice`, addToken);
  } catch (error) {
    throw error;
  }
}

export async function postSaleReturnData(modifiedFormData) {
  try {
    return await axios.post("http://localhost:8080/sale_return",modifiedFormData, addToken);
  } catch (error) {
    throw error;
  }
}

// supplier 
export async function postSupplierData(formData) {
  try {
    return await axios.post(`${baseurl}/supplier`, formData, addToken2)
  } catch (error) {
    throw error;
  }
}

export async function putSupplierData(id, formData) {
  try {
    return await axios.put(`${baseurl}/supplier/${id}`, formData, addToken2)
  } catch (error) {
    throw error;
  }
}

export async function fetchSupplierLedgerData() {
  try {
    return await axios.get(`${baseurl}/supplier_ledger`, addToken);
  } catch (error) {
    throw error;
  }
}


export async function putSupplierLedgerData(id, editedRowData) {
  try {
    return await axios.put(`${baseurl}/supplier_ledger/${id}`,
      editedRowData,
      addToken
    );
  } catch (error) {
    throw error;
  }
}

export async function deleteSupplierLedgerData(id) {
  try {
    return await axios.delete(`${baseurl}/supplier_ledger/${id}`, addToken);
  } catch (error) {
    throw error;
  }
}

// pos
export async function fetchPosConfigured() {
  try {
    return await axios.get(`${baseurl}/pos`, addToken);
  } catch (error) {
    throw error;
  }
}

export async function postPosConfigureData(posId,posValue) {
  try {
    return await axios.post(`${baseurl}/pos/set_value`,  { productId: posId, value: posValue }, addToken)
  } catch (error) {
    throw error;
  }
}


export async function putPosConfigureData(id, newValue) {
  try {
    return await axios.put(`${baseurl}/pos/${id}`,
      { newValue: newValue },
      addToken
    );
  } catch (error) {
    throw error;
  }
}

export async function deletePosConfigureData(id) {
  try {
    return await axios.delete(`${baseurl}/pos/${id}`, addToken);
  } catch (error) {
    throw error;
  }
}

// purchase section
export async function fetchPurchaseBillingData() {
  try {
    return await axios.get(`${baseurl}/purchase/purchaseBilling`, addToken);
  } catch (error) {
    throw error;
  }
}