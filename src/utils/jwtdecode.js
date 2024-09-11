import { jwtDecode } from 'jwt-decode';

export const decodeToken = () => {

  const userData = JSON.parse(localStorage.getItem('user_data'));
  
  if (userData && userData.token) {
    try {

      const decodedToken = jwtDecode(userData.token);
      return decodedToken;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  } else {
    console.log("Token not found in localStorage");
    return null;
  }
};
