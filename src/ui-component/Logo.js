// material-ui
import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import axios from "axios";

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://143.110.251.102:8080/setting");
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    

    fetchData();
  }, []);
   console.log ("logo", data)


  return (
    
     <>
      {data.map((item, index) => (
        <h1 key={index} className="">
            <img alt="logo" src={item.image} style={{width:'50px', height:"50px"}}/>
        </h1>
      ))}
    </>
    //  <h1>hello bhiya</h1>
    
  );
};

export default Logo;
