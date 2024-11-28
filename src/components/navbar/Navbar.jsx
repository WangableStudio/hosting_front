import React from 'react'
import logo1 from '../../images/doveku_logo.avif'
import logo2 from '../../images/12m_logo.avif'
import './navbar.css'
import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { FaRegUserCircle } from "react-icons/fa";
import { GrFormSearch } from "react-icons/gr";
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import { useFilters } from '../context/FilterContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { filters, updateFilters } = useFilters();
    const [searchQuery, setSearchQuery] = useState('');
    const user = useContext(UserContext);
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    const handleSaveFilters = () => {
        updateFilters({ searchQuery });
    };
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value); // Обновляем поисковый запрос
    };
    return (
        <header>
            <nav className='navbar'>
                <div onClick={() => navigate('/')} className="navbar__logo">
                    <img src={logo1} alt="" />
                    <img src={logo2} alt="" />
                    <p>РЕЕСТР И АРХИВ АКТОВ</p>
                </div>
                <div className="navbar__user">
                    {/* {user.isAdmin && (
                        <Button onClick={() => navigate('/users')} color="inherit" sx={{ color: "#343434" }}>
                            <p>
                                Админ
                            </p>
                        </Button>
                    )} */}
                    {user.isAuthenticated ? (
                        <>
                            <Box sx={{ color: "#343434",
                                display: 'flex',
                                alignItems: 'end',
                                gap:'1px',
                                justifyContent: 'center',
                                flexDirection: 'column',
                            }}>
                                <p style={{
                                    cursor: 'pointer'
                                }} onClick={() => handleLogout()}>LOGOUT</p>
                                <span onClick={() => {user.user.status == 'ADMIN' ? navigate('/users') : user.user.status === 'ADMINAUDITOR' ? navigate('/users') : navigate('/')}} style={{
                                    fontSize:'13px',
                                    color: '#EEF1E5',
                                    textAlign:'right',
                                    textTransform: 'none',
                                    cursor:'pointer',
                                }}>{user.user.status == 'ADMIN' ? 'Администратор' : user.user.status == 'AUDITOR' ? 'Ревизор' : user.user.status == 'ADMINAUDITOR' ? 'Главный ревизор' : 'Пользователь'}</span>
                            </Box>
                            <FaRegUserCircle />
                            {/* <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={() => handleLogout()}
                                sx={{ color: "#343434", ml: 0 }}
                            >
                                <LogoutIcon />
                            </IconButton> */}
                        </>
                    ) : (
                        <>
                            <Button onClick={() => navigate('/login')} color="inherit" sx={{ color: "#343434" }}>
                                <p>
                                    Login
                                </p>
                            </Button>
                            <FaRegUserCircle />
                        </>
                    )}
                </div>
            </nav>
            <nav className='navbar bottom'>
                <button onClick={() => { navigate('/act/create') }} className='btn'>Создать документа</button>
                <div className="search">
                    <input value={searchQuery} onChange={handleSearchChange} placeholder='Поиск по ключевым сл...' type="text" />
                    <div onClick={handleSaveFilters} className="search__button">
                        <GrFormSearch />
                    </div>
                </div>
                <button onClick={() => navigate('/howtocreate')} className='btn'>КАК ЗАГРУЖАТЬ АКТЫ</button>
            </nav>
        </header>
    )
}

export default Navbar
