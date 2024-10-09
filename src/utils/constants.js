export const baseurl = 'http://143.110.251.102:8080'
export const apiUrl = {
    updateEmployee:'/employee/'
}

function getToken() {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    let token = userData?.token;
    if (!token) {
      token = "hgsdajsdakdskasdalkdjaldalajkds";
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

export const headers = {
  'Authorization': `Bearer ${getToken()}`,  // Authorization header
  'Content-Type': 'application/json',  // Content-Type header
}