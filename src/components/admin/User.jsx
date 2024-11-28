import React, { useContext, useEffect, useState } from 'react'
import './admin.css'
import { host, token } from '../host';
import axios from 'axios'
import StickyHeadTable from '../table/UniversalTable';
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Paper, Select, TextField } from '@mui/material';
import { toast } from 'react-hot-toast';
import LoadingIndicator from '../LoadingIndicator';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';



const Users = () => {
    const navigate = useNavigate()
    const user = useContext(UserContext);
    const location = useLocation();
    const [users, setUsers] = useState([])
    const [openModal, setOpenModal] = useState(false);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(true);
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState('')
    const columns = [
        { id: 'name', label: 'Имя', minWidth: 100 },
        { id: 'email', label: 'Почта', minWidth: 170 },
        { id: 'status', label: 'Роль', minWidth: 170 },
        { id: 'lastentry', label: 'Последний вход', minWidth: 170 },
        user.user.status == 'ADMINAUDITOR' ? {} : { id: 'actions', label: 'Действия', minWidth: 100, align: 'right' }
    ];
    useEffect(() => {
        setLoading(true);
        axios.get(`${host}/api/v1/user/users`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
            setUsers(response.data)
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setLoading(false);
        })
    }, [])

    const handleAdd = () => {
        setOpenModal(true);
    }
    const handleSave = () => {
        setLoading(true);
        const data = {
            name,
            email,
            password,
            status
        }
        axios.post(`${host}/api/v1/user/reg`, data).then((response) => {
            toast.success('Успешно добавлено');
            window.location.reload();
        }).catch(error => {
            toast.error('Ошибка добавления');
        })
    }

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    return (
        <LoadingIndicator loading={loading}>
            <div className="container">
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'left',
                    gap: '20px',
                    marginTop: '20px',
                    marginBottom: '20px',
                }}>
                    <h1 onClick={() => navigate('/users')} style={{
                        fontSize: '24px',
                        cursor: 'pointer',
                        fontWeight: '400',
                        borderBottom: location.pathname === '/users' ? '2px solid' : 'none',
                    }}>Пользователи</h1>
                    <h1 onClick={() => navigate('/acts')} style={{
                        fontSize: '24px',
                        cursor: 'pointer',
                        fontWeight: '400',
                        borderBottom: location.pathname === '/acts' ? '2px solid' : 'none',
                    }}>Акты</h1>
                </Box>
                <Box className="title__btn" sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    marginTop: '20px',
                    marginBottom: '20px',
                }}>
                    <div className="title" ><span>Пользователи</span></div>
                    <button style={{
                        maxWidth: '300px',
                        width: '100%'
                    }} className='btn' onClick={handleAdd}>
                        Добавить нового пользователя
                    </button>
                </Box>
                <StickyHeadTable
                    rows={users}
                    columns={columns}
                />
            </div>

            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Paper sx={{ padding: 2, margin: 'auto', maxWidth: 400, marginTop: '10%' }}>
                    <h2 style={{ marginBottom: '15px' }}>Изменить</h2>
                    <TextField
                        fullWidth
                        label="Имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Почта"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Роль</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={status}
                            label="Роль"
                            onChange={handleStatusChange}
                            sx={{ marginBottom: 2 }}
                        >
                            {user.user.status === 'ADMIN' && 
                            <>
                                <MenuItem value={'ADMIN'}>АДМИН</MenuItem>
                                <MenuItem value={'ADMINAUDITOR'}>ГЛАВНЫЙ РЕВИЗОР</MenuItem>
                            </>
                            }
                            <MenuItem value={'AUDITOR'}>РЕВИЗОР</MenuItem>
                            <MenuItem value={'GUEST'}>ГОСТЬ</MenuItem>
                        </Select>
                    </FormControl>
                    <Button onClick={handleSave} variant="contained" color="primary" sx={{ mr: 1 }}>
                        Сохранить
                    </Button>
                    <Button onClick={() => setOpenModal(false)} variant="outlined">
                        Отменить
                    </Button>
                </Paper>
            </Modal>
        </LoadingIndicator>
    )
}

export default Users
