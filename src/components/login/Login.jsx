import { Box, margin } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import logo1 from '../../images/doveku_logo.avif'
import logo2 from '../../images/12m_logo.avif'
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import axios from 'axios'
import { toast } from "react-hot-toast";
import { host } from '../host/index';
import Navbar from '../navbar/Navbar';
import { UserContext } from '../context/UserContext';

const style = {
    bgcolor: 'rgba(211, 213, 204)',
    width: '100%',
    boxShadow: 24,
    borderRadius: '10px',
    flexDirection: 'column',
};

const Login = () => {
    const { isAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        navigate('/')
    };
    const handleSubmit = () => {
        const data = {
            email: email,
            password: password
        }
        toast.promise(
            axios.post(`${host}/api/v1/user/log`, data),
            {
                loading: 'Logging in...',
                success: <b>Successfully logged in!</b>,
                error: <b>Неверный почта или пароль!</b>
            }
        )
            .then((response) => {
                localStorage.setItem('token', response.data.token);
                setTimeout(() => {
                    window.location.href = '/'
                }, 1000)
            }).catch(error => {

            })
    }
    return (
        <>
            <Box className="navbar" sx={style}>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <img style={{
                        maxWidth: '100px',
                    }} src={logo1} alt="" />
                    <img style={{
                        maxWidth: '100px',
                    }} src={logo2} alt="" />
                </Box>
                <Typography sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: "#EEF1E5"
                }} id="modal-modal-title" variant="h6" component="h2">
                    РЕЕСТР И АРХИВ АКТОВ
                </Typography>
                <Box sx={{
                    width: "100%",
                    maxWidth: '340px',
                    display: 'flex',
                    alignItems: 'start',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}>
                    <label style={{
                        fontSize: '12px', color: "#EEF1E5",
                        marginBottom: '5px'
                    }} htmlFor="">Почта</label>
                    <input style={{
                        width: '100%',
                        height: '40px',
                        outline: 'none',
                        borderRadius: '5px',
                        paddingLeft: "10px",
                        border: '1px solid rgba(174,99,63)',
                        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
                        marginBottom: '10px',
                    }} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Box>
                <Box sx={{
                    width: "100%",
                    maxWidth: '340px',
                    display: 'flex',
                    alignItems: 'start',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}>
                    <label style={{
                        fontSize: '12px', color: "#EEF1E5",
                        marginBottom: '5px'
                    }} htmlFor="">Пароль</label>
                    <input style={{
                        width: '100%',
                        height: '40px',
                        outline: 'none',
                        borderRadius: '5px',
                        paddingLeft: "10px",
                        border: '1px solid rgba(174,99,63)',
                        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.6)'
                    }} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Box>
                <Box sx={{ width: '30%', maxWidth: '340px', display: "flex", alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                    <Button style={{
                        background: '#AF2C30',
                        width: "50%"
                    }} variant="contained" onClick={() => handleSubmit()}>Вход</Button>
                </Box>
            </Box>
        </>
    )
}

export default Login