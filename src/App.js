import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import useToken from './Global/Hooks/useToken';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CakesPage from './Pages/Cakes/CakesPage';
import LoginPage from './Pages/Login/LoginPage';
import './App.css';

function App() {
  const { token, setToken } = useToken();

  const onLogOutClicked = (e) => {
    setToken(null);
  }

  if (!token) {
    return <LoginPage setToken={setToken} />
  }

  return (
    <div className="wrapper">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            {/* <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton> */}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Cakes
          </Typography>
            <Button color="inherit" onClick={onLogOutClicked}>Log out</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CakesPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
