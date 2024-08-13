import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../../../../views/pages/authentication/auth-forms/actions'; // Adjust the path as necessary
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProfileSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Fetch user data from local storage and parse it safely
  let user = null;
  const userData = localStorage.getItem('user_data');
  if (userData) {
    try {
      user = JSON.parse(userData);
    } catch (e) {
      console.error("Error parsing user data from localStorage", e);
    }
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove('user_login');
    localStorage.removeItem('user_data');
    dispatch(logoutSuccess());
    navigate('/login');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
    handleClose();
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar style={{ width: 40, height: 40, padding: '5px' }} src={user?.image || ''} />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar style={{ width: 32, height: 32, marginRight: '5px' }} src={user?.image || ''} />
          <Box ml={2}>
            <Typography variant="body1">{user?.name || 'User'}</Typography>
            <Typography variant="body2" color="textSecondary">
              {user?.email || 'user@example.com'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {user?.role || 'Role'}
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleChangePassword}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Change Password
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileSection;
