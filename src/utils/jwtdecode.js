import { jwtDecode } from 'jwt-decode';

export const decodeToken = () => {



  const userData = JSON.parse(localStorage.getItem('user_data'));
  // const userData = localStorage.getItem('user_data');

  if (userData && userData.token) {
    try {
      const decodedToken = jwtDecode(userData.token);
      // console.log("Decoded token :::::::::", decodedToken);
      return decodedToken;
    } catch (error) {
      // window.location.replace("/login")
      console.error("Error decoding token:", error);
      return null;
    }
  } else {
    // window.location.replace("/login")
    return null;
  }
};
