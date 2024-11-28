import React, { useContext, useEffect, useRef, useState } from 'react'
import Navbar from '../components/navbar/Navbar'
import './style/home.css'
import { TextField } from '@mui/material'
import { useFilters } from '../components/context/FilterContext'
import LoadingIndicator from '../components/LoadingIndicator';
import axios from 'axios'
import { host, token } from '../components/host'
import Card from '../components/card/Card'
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../components/context/UserContext'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 208,
        },
    },
};

function getStyles(name, personName, theme) {
    return {
        fontWeight: personName === name
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

const getQueryParam = (param) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
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

const Act = () => {
    const { isAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const { filters, updateFilters } = useFilters();
    const [tempFilters, setTempFilters] = useState({
        type: filters.type,
        organization: filters.organization,
        city: filters.city,
        id: filters.id,
        categories: filters.categories,
        attributes: filters.attributes,
    });
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [type, setType] = useState('')
    const [organization, setOrganization] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [attributeId, setAttributeId] = useState('')
    const [city, setCity] = useState('')
    const [units, setUnits] = useState('')
    const [supplier, setSupplier] = useState('')
    const [doc, setDoc] = useState('')
    const [comment, setComment] = useState('')
    const [responsible, setResponsible] = useState('')
    const theme = useTheme();
    const [id, setId] = useState(null);
    const [errors, setErrors] = useState({});
    const [actFile, setActFile] = useState(null);
    const [photoFiles, setPhotoFiles] = useState([]);
    const [videoFiles, setVideoFiles] = useState([]);

    const handleActUpload = (e) => {
        setActFile(e.target.files[0]);
    };

    const handlePhotoUpload = (e) => {
        setPhotoFiles([...photoFiles, ...e.target.files]);
    };

    const handleVideoUpload = (e) => {
        setVideoFiles([...videoFiles, ...e.target.files]);
    };

    const handleActButton = () => {
        actInputRef.current.click();
    };

    const handlePhotoButton = () => {
        photoInputRef.current.click();
    };

    const handleVideoButton = () => {
        videoInputRef.current.click();
    };

    const actInputRef = useRef(null);
    const photoInputRef = useRef(null);
    const videoInputRef = useRef(null);

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
    ]

    const types = [
        'Брак',
        'Недопоставка',
        'Пересорт',
        'Обычный'
    ]

    const citys = [
        'Актобе',
        'Алмата',
        'Астана',
        'Караганда',
        'Костанай',
        'Павлодар',
        'Семей',
        'Усть-Каменогорск',
        'Шымкент',
        'Экибастуз'
    ]

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login')
        }
        const idFromUrl = getQueryParam('id');
        if (idFromUrl) {
            setId(idFromUrl);
        }
        axios.get(`${host}/api/v1/category`)
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        axios.get(`${host}/api/v1/attribute`)
            .then((response) => {
                setAttributes(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleSaveFilters = () => {
        updateFilters({ ...tempFilters });
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        if (name === 'type') {
            setTempFilters({ ...tempFilters, type: value });
        } else if (name === 'organization') {
            setTempFilters({ ...tempFilters, organization: value });
        } else if (name === 'city') {
            setTempFilters({ ...tempFilters, city: value });
        } else if (name === 'number') {
            setTempFilters({ ...tempFilters, id: value });
        } else if (name === 'category') {
            setTempFilters({
                ...tempFilters, categories: value
            });
        } else if (name === 'attribute') {
            setTempFilters({
                ...tempFilters, attributes: value
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!type) newErrors.type = 'Тип акта обязателен';
        if (!organization) newErrors.organization = 'Организация обязательна';
        if (!city) newErrors.city = 'Город обязателен';
        if (!categoryId) newErrors.categoryId = 'Транспортная единица обязательна';
        if (!attributeId) newErrors.attributeId = 'Тип товара обязателен';
        if (!units) newErrors.units = 'Номер тр. единицы обязателен';
        if (!supplier) newErrors.supplier = 'Поставщик обязателен';
        if (!doc) newErrors.doc = 'Сопр. Документы обязательны';
        if (!responsible) newErrors.responsible = 'Ответственные обязательны';
        if (!actFile) newErrors.actFile = 'Акт обязателен';
        if (photoFiles.length === 0) newErrors.photoFiles = 'Фото обязательны';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('act', actFile);
        formData.append('type', type)
        formData.append('organization', organization)
        formData.append('city', city)
        formData.append('categoryId', categoryId)
        formData.append('attributeId', attributeId)
        formData.append('units', units)
        formData.append('supplier', supplier)
        formData.append('doc', doc)
        formData.append('comment', comment)
        formData.append('responsible', responsible)

        axios.post(`${host}/api/v1/media/create`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
            .then((actResponse) => {
                console.log(actResponse);
                photoFiles.forEach((file) => {
                    const formData = new FormData();
                    formData.append('path', file);
                    formData.append('mediaId', actResponse.data.id)
                    axios.post(`${host}/api/v1/photo/create`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`
                        },
                    });
                });

                // Upload videos
                videoFiles.forEach((file) => {
                    const formData = new FormData();
                    formData.append('path', file);
                    formData.append('mediaId', actResponse.data.id)
                    axios.post(`${host}/api/v1/video/create`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`
                        },
                    });
                });

                toast.success("Акт создан успешно!");
                navigate(`/act?id=${actResponse.data.id}`);
            })
            .catch((error) => {
                console.error("Error creating act:", error);
                toast.error(error.response.data.message);
            }).finally(() => {
                setLoading(false);
            })
    };

    return (
        <LoadingIndicator loading={loading}>
            <div className="home">
                <div className="sitebar">
                    <div className="sitebar__title">
                        <p>ПОИСК ПО ФИЛЬТРУ</p>
                    </div>
                    <div className="sitebar__filter">
                        <div className="sitebar__filter-inp">
                            <label>Тип акта</label>
                            <FormControl sx={{ width: '100%' }}>
                                <Select
                                    sx={{
                                        backgroundColor: '#FFF',
                                        height: '40px',
                                    }}
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    name='type'
                                    value={tempFilters.type}
                                    onChange={handleFilterChange}
                                    MenuProps={MenuProps}
                                >
                                    {types.map((item) => (
                                        <MenuItem
                                            sx={{
                                                width: '100%'
                                            }}
                                            key={item}
                                            value={item}
                                            style={getStyles(item, item, theme)}
                                        >
                                            {item}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="sitebar__filter-inp">
                            <label>Организация</label>
                            <FormControl sx={{ width: '100%' }}>
                                <Select
                                    sx={{
                                        backgroundColor: '#FFF',
                                        height: '40px',
                                    }}
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    name='organization'
                                    value={tempFilters.organization}
                                    onChange={handleFilterChange}
                                    MenuProps={MenuProps}
                                >
                                    {organ.map((item) => (
                                        <MenuItem
                                            sx={{
                                                width: '100%'
                                            }}
                                            key={item}
                                            value={item}
                                            style={getStyles(item, item, theme)}
                                        >
                                            {item}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="sitebar__filter-inp">
                            <label>Город</label>
                            <FormControl sx={{ width: '100%' }}>
                                <Select
                                    sx={{
                                        backgroundColor: '#FFF',
                                        height: '40px',
                                    }}
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    name="city"
                                    value={tempFilters.city}
                                    onChange={handleFilterChange}
                                    MenuProps={MenuProps}
                                >                  {citys.map((item) => (
                                    <MenuItem
                                        sx={{
                                            width: '100%'
                                        }}
                                        key={item}
                                        value={item}
                                        style={getStyles(item, item, theme)}
                                    >
                                        {item}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="sitebar__filter-inp">
                            <label>Транспортная единица</label>
                            <FormControl sx={{ width: '100%' }}>
                                <Select
                                    sx={{
                                        backgroundColor: '#FFF',
                                        height: '40px',
                                    }}
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    name="category"
                                    value={tempFilters.categories}
                                    onChange={handleFilterChange}
                                    MenuProps={MenuProps}
                                >
                                    {categories.map((item) => (
                                        <MenuItem
                                            sx={{
                                                width: '100%'
                                            }}
                                            key={item}
                                            value={item.id}
                                            style={getStyles(item, item.name, theme)}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="sitebar__filter-inp">
                            <label>Тип товара:</label>
                            <FormControl sx={{ width: '100%' }}>
                                <Select
                                    sx={{
                                        backgroundColor: '#FFF',
                                        height: '40px',
                                    }}
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    value={tempFilters.attributes}
                                    name="attribute"
                                    onChange={handleFilterChange}
                                    MenuProps={MenuProps}
                                >
                                    {attributes.map((item) => (
                                        <MenuItem
                                            sx={{
                                                width: '100%'
                                            }}
                                            key={item}
                                            value={item.id}
                                            style={getStyles(item, item.name, theme)}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="sitebar__filter-inp">
                            <label>Номер Акта</label>
                            <TextField
                                type='number'
                                onChange={handleFilterChange}
                                name='number'
                                sx={{
                                    width: "100%",
                                    height: '40px',
                                    background: '#FFF',
                                    '& .MuiInputBase-root': {
                                        height: '100%',
                                    },
                                }} id="outlined-basic" variant="outlined" />
                        </div>

                        <button onClick={handleSaveFilters} style={{
                            width: '100%'
                        }} className='btn'>НАЙТИ</button>
                    </div>
                </div>
                <div style={{
                    padding: '50px'
                }} className="content">
                    <div style={{
                        justifyContent: 'center'
                    }} className="content__title">
                        <p>СОЗДАНИЕ НОВОГО АКТА</p>
                    </div>
                    <div className="sitebar__filter">
                        <div className="sitebar__filter-inp">
                            <label>Тип акта *</label>
                            <FormControl sx={{ width: '100%' }}>
                                <Select
                                    sx={{
                                        backgroundColor: '#FFF',
                                        height: '40px',
                                    }}
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    name='type'
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    MenuProps={MenuProps}
                                >
                                    {types.map((item) => (
                                        <MenuItem
                                            sx={{
                                                width: '100%'
                                            }}
                                            key={item}
                                            value={item}
                                            style={getStyles(item, item, theme)}
                                        >
                                            {item}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.type && <p style={{ color: 'red' }}>{errors.type}</p>}
                            </FormControl>
                        </div>
                        <div className="sitebar__filter-inp">
                            <label>Организация *</label>
                            <FormControl sx={{ width: '100%' }}>
                                <Select
                                    sx={{
                                        backgroundColor: '#FFF',
                                        height: '40px',
                                    }}
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    name='organization'
                                    value={organization}
                                    onChange={(e) => setOrganization(e.target.value)}
                                    MenuProps={MenuProps}
                                >
                                    {organ.map((item) => (
                                        <MenuItem
                                            sx={{
                                                width: '100%'
                                            }}
                                            key={item}
                                            value={item}
                                            style={getStyles(item, item, theme)}
                                        >
                                            {item}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.organization && <p style={{ color: 'red' }}>{errors.organization}</p>}
                            </FormControl>
                        </div>
                        <div className="sitebar__filter-inp">
                            <label>Город *</label>
                            <FormControl sx={{ width: '100%' }}>
                                <Select
                                    sx={{
                                        backgroundColor: '#FFF',
                                        height: '40px',
                                    }}
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    name="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    MenuProps={MenuProps}
                                >                  {citys.map((item) => (
                                    <MenuItem
                                        sx={{
                                            width: '100%'
                                        }}
                                        key={item}
                                        value={item}
                                        style={getStyles(item, item, theme)}
                                    >
                                        {item}
                                    </MenuItem>
                                ))}
                                </Select>
                                {errors.city && <p style={{ color: 'red' }}>{errors.city}</p>}
                            </FormControl>
                        </div>
                        <div className="sitebar__filter-inp">
                            <label>Транспортная единица *</label>
                            <FormControl sx={{ width: '100%' }}>
                                <Select
                                    sx={{
                                        backgroundColor: '#FFF',
                                        height: '40px',
                                    }}
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    name="category"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    MenuProps={MenuProps}
                                >
                                    {categories.map((item) => (
                                        <MenuItem
                                            sx={{
                                                width: '100%'
                                            }}
                                            key={item}
                                            value={item.id}
                                            style={getStyles(item, item.name, theme)}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.categoryId && <p style={{ color: 'red' }}>{errors.categoryId}</p>}
                            </FormControl>
                        </div>
                        <div className="sitebar__filter-inp">
                            <label>Тип товара *</label>
                            <FormControl sx={{ width: '100%' }}>
                                <Select
                                    sx={{
                                        backgroundColor: '#FFF',
                                        height: '40px',
                                    }}
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    value={attributeId}
                                    name="attribute"
                                    onChange={(e) => setAttributeId(e.target.value)}
                                    MenuProps={MenuProps}
                                >
                                    {attributes.map((item) => (
                                        <MenuItem
                                            sx={{
                                                width: '100%'
                                            }}
                                            key={item}
                                            value={item.id}
                                            style={getStyles(item, item.name, theme)}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.attributeId && <p style={{ color: 'red' }}>{errors.attributeId}</p>}
                            </FormControl>
                        </div>
                        <div className="sitebar__filter-inp">
                            <label>Номер тр. единицы *</label>
                            <TextField
                                type='number'
                                value={units}
                                onChange={(e) => setUnits(e.target.value)}
                                name='units'
                                sx={{
                                    width: "100%",
                                    height: '40px',
                                    background: '#FFF',
                                    '& .MuiInputBase-root': {
                                        height: '100%',
                                    },
                                }} id="outlined-basic" variant="outlined" placeholder='Номер вагона или контейнера. Либо гос. номер авто' />
                            {errors.units && <p style={{ color: 'red' }}>{errors.units}</p>}
                        </div>
                        <div className="sitebar__filter-inp">
                            <label>Поставщик *</label>
                            <TextField
                                type='text'
                                value={supplier}
                                onChange={(e) => setSupplier(e.target.value)}
                                sx={{
                                    width: "100%",
                                    height: '40px',
                                    background: '#FFF',
                                    '& .MuiInputBase-root': {
                                        height: '100%',
                                    },
                                }} id="outlined-basic" variant="outlined" placeholder='Наименование поставщика' />
                            {errors.supplier && <p style={{ color: 'red' }}>{errors.supplier}</p>}
                        </div>
                        <div className="sitebar__filter-inp">
                            <label>Сопр. Документы *</label>
                            <TextField
                                type='text'
                                value={doc}
                                onChange={(e) => setDoc(e.target.value)}
                                sx={{
                                    width: "100%",
                                    height: '40px',
                                    background: '#FFF',
                                    '& .MuiInputBase-root': {
                                        height: '100%',
                                    },
                                }} id="outlined-basic" variant="outlined" placeholder='Инвойсы, акты, накладные и пр.' />
                            {errors.doc && <p style={{ color: 'red' }}>{errors.doc}</p>}
                        </div>
                        <div className="sitebar__filter-inp">
                            <label>Комментарий</label>
                            <TextField
                                type='text'
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                sx={{
                                    width: "100%",
                                    height: '40px',
                                    background: '#FFF',
                                    '& .MuiInputBase-root': {
                                        height: '100%',
                                    },
                                }} id="outlined-basic" variant="outlined" />
                        </div>
                        <div className="sitebar__filter-inp">
                            <label>Ответственные *</label>
                            <TextField
                                type='text'
                                value={responsible}
                                onChange={(e) => setResponsible(e.target.value)}
                                sx={{
                                    width: "100%",
                                    height: '40px',
                                    background: '#FFF',
                                    '& .MuiInputBase-root': {
                                        height: '100%',
                                    },
                                }} id="outlined-basic" variant="outlined" placeholder='Фамилия ответсвенного' />
                            {errors.responsible && <p style={{ color: 'red' }}>{errors.responsible}</p>}
                        </div>
                        <div className="sitebar__filter-btn">
                            <button onClick={handleActButton} style={{
                                width: '100%',
                                background: errors.actFile && 'red'
                            }} className='btn'>Загрузить акт</button>
                            <button onClick={handlePhotoButton} style={{
                                width: '100%',
                                background: errors.photoFiles && 'red'
                            }} className='btn'>Загрузить фото</button>
                            <button onClick={handleVideoButton} style={{
                                width: '100%',
                            }} className='btn'>Загрузить видео</button>
                            <input
                                type="file"
                                ref={actInputRef}
                                style={{ display: 'none' }}
                                accept="image/*,application/pdf"
                                onChange={handleActUpload}
                            />
                            <input
                                type="file"
                                ref={photoInputRef}
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handlePhotoUpload}
                                multiple
                            />
                            <input
                                type="file"
                                ref={videoInputRef}
                                accept="video/*"
                                style={{ display: 'none' }}
                                onChange={handleVideoUpload}
                                multiple
                            />
                            {actFile && (
                                <p>Uploaded Act: {actFile.name}</p>
                            )}
                            {photoFiles.length > 0 && (
                                <div>
                                    <p>Uploaded Photos:</p>
                                    {photoFiles.map((file, index) => (
                                        <p key={index}>{file.name}</p>
                                    ))}
                                </div>
                            )}
                            {videoFiles.length > 0 && (
                                <div>
                                    <p>Uploaded Videos:</p>
                                    {videoFiles.map((file, index) => (
                                        <p key={index}>{file.name}</p>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button onClick={handleSubmit} style={{
                            width: '100%',
                            maxWidth: '300px'
                        }} className='btn'>СОЗДАТЬ АКТ</button>
                    </div>
                </div>
            </div>
        </LoadingIndicator>
    )
}

export default Act;