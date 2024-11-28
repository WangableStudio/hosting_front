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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { host, token } from '../host';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { Card, FormControl, InputLabel, Select, Typography } from '@mui/material';
import styled from '@emotion/styled';
import LoadingIndicator from '../LoadingIndicator';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const organ = [
    'ТОО Довеку',
    'ТОО Азия Стиль',
    'ТОО 12 Месяцев Астана',
    'ТОО 12 Месяцев Алмата',
    'ТОО 12 Месяцев Павлодар',
    'ТОО 12 Месяцев Костанай',
    'ТОО 12 Месяцев Восток',
    'ТОО Азия Декор',
    'ТОО Азия Креатив',
  ];

export default function StickyHeadTable({ rows, columns }) {
    const location = useLocation();
    const [page, setPage] = useState(0);
    const [attributes, setAttributes] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [editName, setEditName] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [type, setType] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [attributeId, setAttributeId] = useState('')
    const [city, setCity] = useState('')
    const [units, setUnits] = useState('')
    const [supplier, setSupplier] = useState('')
    const [doc, setDoc] = useState('')
    const [format, setFormat] = useState('video')
    const [comment, setComment] = useState('')
    const [responsible, setResponsible] = useState('')
    const [file, setFile] = useState(null);
    const [organization, setOrganization] = useState('')
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`${host}/api/v1/category`)
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        axios.get(`${host}/api/v1/attribute`).then((response) => {
            setAttributes(response.data)
        }).catch(error => {
            console.log(error);
        })
    }, []);

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
        setType(selectedRow.type)
        setEditName(selectedRow.name);
        setEditStatus(selectedRow.status);
        setEditCategory(selectedRow.categoryId)
        setCategoryId(selectedRow.categoryId)
        setAttributeId(selectedRow.attributeId)
        setCity(selectedRow.city)
        setUnits(selectedRow.units)
        setSupplier(selectedRow.supplier)
        setDoc(selectedRow.doc)
        setFormat(selectedRow.format)
        setComment(selectedRow.comment)
        setResponsible(selectedRow.responsible)
        setOrganization(selectedRow.organization)
        setOpenModal(true);
        handleMenuClose();
    };

    const handleDeleteClick = async () => {
        try {
            setLoading(true)
            const apiEndpoint = location.pathname === '/users'
                ? `${host}/api/v1/user/${selectedRow.id}/user`
                : location.pathname === '/category'
                    ? `${host}/api/v1/category/${selectedRow.id}/category`
                    : location.pathname === '/acts' ? `${host}/api/v1/media/${selectedRow.id}/media` : location.pathname === '/user/ph' || location.pathname === '/user/vd' ? `${host}/api/v1/media/${selectedRow.id}/media` : `${host}/api/v1/attribute/${selectedRow.id}/attribute`;

            await axios.delete(apiEndpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
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
            setLoading(true)
            const apiEndpoint = location.pathname === '/users'
                ? `${host}/api/v1/user/${selectedRow.id}/user`
                : location.pathname === '/category'
                    ? `${host}/api/v1/category/${selectedRow.id}/category`
                    : location.pathname === '/acts'
                        ? `${host}/api/v1/media/${selectedRow.id}/media`
                        : location.pathname === '/user/vd' || location.pathname === '/user/ph' ? `${host}/api/v1/media/${selectedRow.id}/media` : `${host}/api/v1/attribute/${selectedRow.id}/attribute`;

            let payload;
            let headers = {
                Authorization: `Bearer ${token}`,
            };

            if (location.pathname === '/acts' || location.pathname === '/user/vd' || location.pathname === '/user/ph') {
                const formData = new FormData();
                formData.append('type', type);
                formData.append('city', city);
                formData.append('units', units);
                formData.append('supplier', supplier);
                formData.append('doc', doc);
                formData.append('comment', comment);
                formData.append('responsible', responsible);
                formData.append('categoryId', categoryId);
                formData.append('attributeId', attributeId);

                if (file) {
                    format === 'video' ? formData.append('video', file) : formData.append('photo', file);
                }

                payload = formData;
                headers['Content-Type'] = 'multipart/form-data';
            } else {
                payload = location.pathname === '/users'
                    ? { name: editName, status: editStatus }
                    : location.pathname === '/category'
                        ? { name: editName }
                        : { name: editName, categoryId: editCategory };
            }

            await axios.put(apiEndpoint, payload, {
                headers,
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
        <LoadingIndicator loading={loading}>
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
                                            if (column.id === 'categoryId') {
                                                const category = categories.find(cat => cat.id === row.categoryId);
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {category ? category.name : '-'}
                                                    </TableCell>
                                                );
                                            }
                                            if (column.id === 'attributeId') {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {row.attribute.name}
                                                    </TableCell>
                                                )
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

                <Modal sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflowY: 'auto',
                    paddingBottom: '50px'
                }} open={openModal} onClose={() => setOpenModal(false)}>
                    <Paper sx={{ padding: 2, margin: 'auto', maxWidth: 400, marginTop: '10%' }}>
                        <h2 style={{ marginBottom: '15px' }}>Изменить</h2>
                        {location.pathname === '/users' &&
                            <>
                                <TextField
                                    fullWidth
                                    label="Имя"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    sx={{ marginBottom: 2 }}
                                />
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Роль</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={editStatus}
                                        label="Роль"
                                        onChange={(e) => setEditStatus(e.target.value)}
                                        sx={{ marginBottom: 2 }}
                                    >
                                        <MenuItem value={'ADMIN'}>АДМИН</MenuItem>
                                        <MenuItem value={'ADMINAUDITOR'}>ГЛАВНЫЙ РЕВИЗОР</MenuItem>
                                        <MenuItem value={'AUDITOR'}>РЕВИЗОР</MenuItem>
                                        <MenuItem value={'GUEST'}>ГОСТЬ</MenuItem>
                                    </Select>
                                </FormControl>
                            </>
                        }
                        {location.pathname === '/category' &&
                            <TextField
                                fullWidth
                                label="Название"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                        }
                        {
                            location.pathname === '/attribute' &&
                            <>
                                <TextField
                                    fullWidth
                                    label="Название"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    sx={{ marginBottom: 2 }}
                                />
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Роль</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={editCategory}
                                        label="Роль"
                                        onChange={(e) => setEditCategory(e.target.value)}
                                        sx={{ marginBottom: 2 }}
                                    >
                                        {categories.map(category => (
                                            <MenuItem value={`${category.id}`}>{category.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        }
                        {
                            (location.pathname === '/acts') &&
                            <>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Тип завяки</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={type}
                                        label="Тип завяки"
                                        onChange={(e) => setType(e.target.value)}
                                        sx={{ marginBottom: 2 }}
                                    >
                                        <MenuItem value={'Брак'}>Брак</MenuItem>
                                        <MenuItem value={'Недопоставка'}>Недопоставка</MenuItem>
                                        <MenuItem value={'Пересорт'}>Пересорт</MenuItem>
                                        <MenuItem value={'Обычный'}>Обычный</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Категория</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={categoryId}
                                        label="Категория"
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        sx={{ marginBottom: 2 }}
                                    >
                                        {categories.map(category => (
                                            <MenuItem value={category.id}>{category.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Аттребуты</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={attributeId}
                                        label="Аттребуты"
                                        onChange={(e) => setAttributeId(e.target.value)}
                                        sx={{ marginBottom: 2 }}
                                    >
                                        {attributes.map(category => (
                                            <MenuItem value={category.id}>{category.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ width: '100%' }}>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        name='organization'
                                        value={organization}
                                        sx={{ marginBottom: 2 }}
                                        onChange={(e) => setOrganization(e.target.value)}
                                    >
                                        {organ.map((item) => (
                                            <MenuItem
                                                sx={{
                                                    width: '100%'
                                                }}
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Город</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={city}
                                        label="Город"
                                        onChange={(e) => setCity(e.target.value)}
                                        sx={{ marginBottom: 2 }}
                                    >
                                        <MenuItem value={'Актобе'}>Актобе</MenuItem>
                                        <MenuItem value={'Алмата'}>Алмата</MenuItem>
                                        <MenuItem value={'Астана'}>Астана</MenuItem>
                                        <MenuItem value={'Караганда'}>Караганда</MenuItem>
                                        <MenuItem value={'Костанай'}>Костанай</MenuItem>
                                        <MenuItem value={'Павлодар'}>Павлодар</MenuItem>
                                        <MenuItem value={'Семей'}>Семей</MenuItem>
                                        <MenuItem value={'Усть-Каменогорск'}>Усть-Каменогорск</MenuItem>
                                        <MenuItem value={'Шымкент'}>Шымкент</MenuItem>
                                        <MenuItem value={'Экибастуз'}>Экибастуз</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    label="Номер тр. Единицы"
                                    value={units}
                                    onChange={(e) => setUnits(e.target.value)}
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Поставщик"
                                    value={supplier}
                                    onChange={(e) => setSupplier(e.target.value)}
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Сопр. Документы"
                                    value={doc}
                                    onChange={(e) => setDoc(e.target.value)}
                                    sx={{ marginBottom: 2 }}
                                />
                                {/* {format == 'video' ? (
                                    haveImage ? (
                                        <video
                                            style={{ width: '100%', paddingBottom: '2rem' }}
                                            controls
                                            poster={host + preview}
                                        >
                                            <source
                                                src={host + file}
                                                type="video/mp4"
                                            />
                                        </video>
                                    ) : (
                                        <>
                                            <Button
                                                component="label"
                                                role={undefined}
                                                sx={{ marginBottom: 2, width: '100%' }}
                                                variant="contained"
                                                tabIndex={-1}
                                                startIcon={<CloudUploadIcon />}
                                            >
                                                Загрузить видео
                                                <VisuallyHiddenInput
                                                    type="file"
                                                    onChange={(e) => setFile(e.target.files[0])}
                                                    multiple
                                                />
                                            </Button>
                                            <Button
                                                component="label"
                                                role={undefined}
                                                sx={{ marginBottom: 2, width: '100%' }}
                                                variant="contained"
                                                color="warning"
                                                tabIndex={-1}
                                                startIcon={<CloudUploadIcon />}
                                            >
                                                Загрузить обложку
                                                <VisuallyHiddenInput
                                                    type="file"
                                                    onChange={(e) => setPreview(e.target.files[0])}
                                                    multiple
                                                />
                                            </Button>
                                        </>
                                    )
                                ) : (
                                    haveImage ? (
                                        <img style={{ width: '100%', paddingBottom: '2rem' }} src={host + file} alt="" />
                                    ) : (
                                        <Button
                                            component="label"
                                            role={undefined}
                                            sx={{ marginBottom: 2, width: '100%' }}
                                            variant="contained"
                                            tabIndex={-1}
                                            startIcon={<CloudUploadIcon />}
                                        >
                                            Загрузить фото
                                            <VisuallyHiddenInput
                                                type="file"
                                                onChange={(e) => setFile(e.target.files[0])}
                                                multiple
                                            />
                                        </Button>
                                    )
                                )} */}
                                <TextField
                                    fullWidth
                                    label="Комментарий"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Ответственный"
                                    value={responsible}
                                    onChange={(e) => setResponsible(e.target.value)}
                                    sx={{ marginBottom: 2 }}
                                />
                            </>
                        }
                        <Button onClick={handleSave} variant="contained" color="primary" sx={{ mr: 1 }}>
                            Сохранить
                        </Button>
                        <Button onClick={() => setOpenModal(false)} variant="outlined">
                            Отменить
                        </Button>
                    </Paper>
                </Modal>
            </Paper>
        </LoadingIndicator>
    );
}
