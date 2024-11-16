import { Box, margin } from '@mui/system'
import React, { useState } from 'react'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import axios from 'axios'
import { toast } from "react-hot-toast";
import host from '../host/index';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#FFF',
    boxShadow: 24,
    padding: '40px 30px',
    borderRadius: '10px'
};

const Login = () => {
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
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Вход в админ панель
                </Typography>
                <TextField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="outlined-basic"
                    label="Почта"
                    variant="outlined"
                    sx={{ marginTop: '10px', width: '100%' }}
                />
                <TextField
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="outlined-basic"
                    label="Пароль"
                    variant="outlined"
                    type="password"
                    sx={{ marginTop: '10px', width: '100%' }}
                />
                <Box sx={{ width: '100%', display: "flex", alignItems: 'center', justifyContent: 'right', gap: '20px', marginTop: '20px' }}>
                    <Button variant="outlined" onClick={() => handleClose()}>Отмена</Button>
                    <Button variant="contained" onClick={() => handleSubmit()}>Вход</Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default Login
