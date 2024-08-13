import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('user_login');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
};

export default useAuth;
