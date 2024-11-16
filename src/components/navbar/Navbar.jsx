import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useEffect } from 'react';
import { Container } from '@mui/system';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const user = useContext(UserContext);

    const routes = {
        Фото: '/',
        Видео: '/video',
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open);
    };

    const handleMenuClick = (newTitle) => {
        setTitle(newTitle);
        setOpen(false);
        navigate(routes[newTitle]);
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    const menuList = (
        <Box
            sx={{ width: '360px' }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                <ListItem button onClick={() => handleMenuClick('Фото')}>
                    <ListItemText primary="Фото контент" />
                </ListItem>
                <ListItem button onClick={() => handleMenuClick('Видео')}>
                    <ListItemText primary="Видео контент" />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar sx={{ background: '#FFF' }} position="static">
                <Box sx={{ width: '100%' }}>
                    <Toolbar sx={{
                        flexWrap: 'wrap', justifyContent: 'space-between', '@media (max-width: 550px)': {
                            justifyContent: 'center'
                        }
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px',
                        '@media (max-width: 550px)': {
                            justifyContent: 'space-between',
                            width:'100%'
                        }
                    }}>
                            <img src="data:image/png;base64,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" alt="" />

                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={toggleDrawer(true)}
                                sx={{ color: "#343434" }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                        <Box>
                            {user.isAdmin && (
                                <Button onClick={() => navigate('/users')} color="inherit" sx={{ color: "#343434" }}>
                                    Админ
                                </Button>
                            )}
                            {user.isAuthenticated ? (
                                <>
                                    <Button color="inherit" sx={{ color: "#343434" }}>
                                        {user.user.name}
                                    </Button>
                                    <IconButton
                                        size="large"
                                        edge="start"
                                        color="inherit"
                                        aria-label="menu"
                                        onClick={() => handleLogout()}
                                        sx={{ color: "#343434", ml: 0 }}
                                    >
                                        <LogoutIcon />
                                    </IconButton>
                                </>
                            ) : (
                                <Button onClick={() => navigate('/login')} color="inherit" sx={{ color: "#343434" }}>
                                    Login
                                </Button>
                            )}
                        </Box>
                    </Toolbar>
                </Box>
            </AppBar>
            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer(false)}
            >
                {menuList}
            </Drawer>
        </Box >
    );
}