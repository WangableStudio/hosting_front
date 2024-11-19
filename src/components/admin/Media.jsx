import React, { useEffect, useState } from 'react'
import './admin.css'
import UniversalTable from '../table/UniversalTable'
import { host, token } from '../host';
import axios from 'axios'
import StickyHeadTable from '../table/UniversalTable';
import AdminNavbar from './navbar/AdminNavbar';
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Paper, Select, TextField } from '@mui/material';
import { toast } from 'react-hot-toast';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';
import LoadingIndicator from '../LoadingIndicator';

const columns = [
    { id: 'id', label: 'ID', minWidth: 100 },
    { id: 'type', label: 'Тип', minWidth: 100, align: 'left' },
    { id: 'categoryId', label: 'Категория', minWidth: 100, align: 'left' },
    { id: 'attributeId', label: 'Аттребут', minWidth: 100, align: 'left' },
    { id: 'city', label: 'Город', minWidth: 100, align: 'left' },
    { id: 'actions', label: 'Действия', minWidth: 100, align: 'right' },
];

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

const Media = () => {
    const location = useLocation();
    const [attributes, setAttributes] = useState([])
    const [categories, setCategories] = useState([])
    const [videos, setVideos] = useState([])
    const [openModal, setOpenModal] = useState(false);
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
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${host}/api/v1/attribute`).then((response) => {
            setAttributes(response.data)
        }).catch(error => {
            console.log(error);
        })

        axios.get(`${host}/api/v1/category`).then((response) => {
            setCategories(response.data)
        }).catch(error => {
            console.log(error);
        })
    }, [])

    useEffect(() => {
        setLoading(true)
        setFormat(location.pathname === '/vd' ? 'video' : 'photo')
        axios.get(`${host}/api/v1/media/${location.pathname === '/vd' ? 'video' : 'photo'}`)
            .then((response) => {
                setVideos(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при запросе:", error);
            }).finally(() => {
                setLoading(false);
            })
    }, [location.pathname]);

    const handleAdd = () => {
        setOpenModal(true);
    }
    const handleSave = () => {
        const formData = new FormData();

        formData.append('type', type);
        formData.append('city', city);
        formData.append('units', units);
        formData.append('supplier', supplier);
        formData.append('doc', doc);
        formData.append('format', format);
        formData.append('comment', comment);
        formData.append('responsible', responsible);
        formData.append('categoryId', categoryId);
        formData.append('attributeId', attributeId);

        if (file) {
            format === 'video' ? formData.append('video', file) : formData.append('photo', file)
        }
        if (preview) {
            formData.append('preview', preview);
        }
        axios.post(`${host}/api/v1/media/create`, formData, {
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
            toast.success('Успешно добавлено');
            window.location.reload();
        }).catch(error => {
            toast.error('Ошибка добавления');
        })
    }

    return (
        <LoadingIndicator loading={loading}>
            <AdminNavbar />
            <div className="container">
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    marginTop: '20px',
                    marginBottom: '20px',
                }}>
                    <div className="title" ><span>{location.pathname === '/vd' ? 'Видео' : 'Фото'}</span></div>
                    <Button onClick={handleAdd} variant="contained" color="secondary">
                        Добавить нововое {location.pathname === '/vd' ? 'видео' : 'фото'}
                    </Button>
                </Box>
                <StickyHeadTable
                    rows={videos}
                    columns={columns}
                />
            </div>

            <Modal sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflowY: 'auto',
                paddingBottom: '50px'
            }} open={openModal} onClose={() => setOpenModal(false)}>
                <Paper sx={{ padding: 2, margin: 'auto', maxWidth: 400, marginTop: '10%' }}>
                    <h2 style={{ marginBottom: '15px' }}>Добавить</h2>
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
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Формат</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={format}
                            label="Формат"
                            onChange={(e) => setFormat(e.target.value)}
                            sx={{ marginBottom: 2 }}
                        >
                            <MenuItem value={'video'}>Видео</MenuItem>
                            <MenuItem value={'photo'}>Фото</MenuItem>
                        </Select>
                    </FormControl>
                    {format == 'video' ? (
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
                    )}
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

export default Media