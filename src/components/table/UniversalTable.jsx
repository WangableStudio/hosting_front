import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import host from '../host';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { FormControl, InputLabel, Select } from '@mui/material';

export default function StickyHeadTable({ rows, columns }) {
    const location = useLocation();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [editName, setEditName] = useState('');
    const [editStatus, setEditStatus] = useState('');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleMenuClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        setEditName(selectedRow.name);
        setEditStatus(selectedRow.status);
        setOpenModal(true);
        handleMenuClose();
    };

    const handleStatusChange = (event) => {
        setEditStatus(event.target.value);
    };

    const handleDeleteClick = async () => {
        try {
            const apiEndpoint = location.pathname === '/users'
                ? `${host}/api/v1/user/${selectedRow.id}/user`
                : `${host}/api/v1/category/${selectedRow.id}/category`;

            await axios.delete(apiEndpoint, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            toast.success('Успешно удалено');
            window.location.reload();
        } catch (error) {
            toast.error('Ошибка удаления');
        }
        handleMenuClose();
    };

    const handleSave = async () => {
        try {
            const apiEndpoint = location.pathname === '/users'
                ? `${host}/api/v1/user/${selectedRow.id}/user`
                : `${host}/api/v1/category/${selectedRow.id}/category`;

            const payload = location.pathname === '/users'
                ? { name: editName, status: editStatus }
                : { name: editName };

            await axios.put(apiEndpoint, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            toast.success('Успешно изменено');
            window.location.reload();
        } catch (error) {
            toast.error('Ошибка сохранения');
        }
        setOpenModal(false);
    };


    const formatDate = (isoDate) => {
        if (!isoDate) return '-';
        const date = new Date(isoDate);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
                .getHours()
                .toString()
                .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        return formattedDate;
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                    {columns.map((column) => {
                                        if (column.id === 'actions') {
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    <IconButton
                                                        onClick={(event) => handleMenuClick(event, row)}
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                    <Menu
                                                        anchorEl={anchorEl}
                                                        open={Boolean(anchorEl)}
                                                        onClose={handleMenuClose}
                                                    >
                                                        <MenuItem onClick={handleEditClick}>Изменить</MenuItem>
                                                        <MenuItem onClick={handleDeleteClick}>Удалить</MenuItem>
                                                    </Menu>
                                                </TableCell>
                                            );
                                        }
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.id === 'lastentry'
                                                    ? formatDate(value) // Форматируем дату
                                                    : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Paper sx={{ padding: 2, margin: 'auto', maxWidth: 400, marginTop: '10%' }}>
                    <h2 style={{ marginBottom: '15px' }}>Изменить</h2>
                    <TextField
                        fullWidth
                        label="Название"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    {location.pathname == '/users' && (
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={editStatus}
                                label="Age"
                                onChange={handleStatusChange}
                                sx={{ marginBottom: 2 }}
                            >
                                <MenuItem value={'ADMIN'}>АДМИН</MenuItem>
                                <MenuItem value={'AUDITOR'}>АУДИТОР</MenuItem>
                                <MenuItem value={'GUEST'}>ГОСТЬ</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                    <Button onClick={handleSave} variant="contained" color="primary" sx={{ mr: 1 }}>
                        Сохранить
                    </Button>
                    <Button onClick={() => setOpenModal(false)} variant="outlined">
                        Отменить
                    </Button>
                </Paper>
            </Modal>
        </Paper>
    );
}
