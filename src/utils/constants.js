export const baseurl = 'http://localhost:8080'
export const apiUrl = {
    updateEmployee:'/employee/'
}

function getToken() {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    const token = userData?.token;
    if (!token) {
      throw new Error("No token found");
    }
    return token;
}

export const addToken = {
    headers: {
        'Authorization': `Bearer ${getToken()}`,  
        'Content-Type': 'application/json',  
      }
}

export const addToken2 = {
    headers: {
        'Authorization': `Bearer ${getToken()}`,  
        'Content-Type': 'multipart/form-data',  
      }
}