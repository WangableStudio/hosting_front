import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/navbar/Navbar'
import './style/home.css'
import { TextField } from '@mui/material'
import { useFilters } from '../components/context/FilterContext'
import LoadingIndicator from '../components/LoadingIndicator';
import axios from 'axios'
import { host } from '../components/host'
import Card from '../components/card/Card'
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Carousel, { Modal, ModalGateway } from 'react-images'
import { UserContext } from '../components/context/UserContext'
import { useNavigate } from 'react-router-dom'

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

const Product = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const { filters, updateFilters } = useFilters();
    const [tempFilters, setTempFilters] = useState({
        type: filters.type,
        organizationalization: filters.organizationalization,
        city: filters.city,
        id: filters.id,
        categories: filters.categories,
        attributes: filters.attributes,
    });
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [type, setType] = useState('')
    const [organizationalization, setOrganizationalization] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [attributeId, setAttributeId] = useState('')
    const [city, setCity] = useState('')
    const [number, setNumber] = useState('')
    const [sortOrder, setSortOrder] = useState('newest'); // Добавляем состояние для сортировки
    const theme = useTheme();
    const [id, setId] = useState(null);

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

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    const openLightbox = (index) => {
        setCurrentImage(index);
        setModalIsOpen(true);
    };

    const closeLightbox = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        if(!localStorage.getItem('token')){
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

    useEffect(() => {
        axios.get(`${host}/api/v1/media/${id}/id`)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при запросе:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id])

    const handleSaveFilters = () => {
        updateFilters({ ...tempFilters });
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        if (name === 'type') {
            setTempFilters({ ...tempFilters, type: value });
        } else if (name === 'organizationalization') {
            setTempFilters({ ...tempFilters, organizationalization: value });
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

    const formatImagesForCarousel = (images) => {
        return images.map(image => ({
            src: host + image.path,
            caption: `Image ${image.id}`
        }));
    };

    const handleDownload = async () => {
        try {
            const fileUrl = host + data.act;

            const response = await fetch(fileUrl);
            const blob = await response.blob();

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = data.act.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Ошибка при скачивании файла:', error);
        }
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
                                    name='organizationalization'
                                    value={tempFilters.organizationalization}
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
                <div className="content">
                    <div className="content__title">
                        <p>№ {id}</p>
                    </div>
                    <div className="act">
                        <p><span className="label">Дата формирования:</span> {formatDate(data.createdAt)}</p>
                        <p><span className="label">Город:</span> {data.city}</p>
                        <p><span className="label">Организация:</span> ТОО 12 Месяцев-Астана</p>
                        <p><span className="label">Тип акта:</span> {data.type}</p>
                        <p><span className="label">Транспортная единица:</span> {data.category?.name || 'Не указано'}</p>
                        <p><span className="label">Тип товара:</span> {data.attribute?.name || 'Не указано'}</p>
                        <p><span className="label">Номер тр. единицы:</span> {data.units}</p>
                        <p><span className="label">Поставщик:</span> {data.supplier}</p>
                        <p><span className="label">№ Акта:</span> {data.id}</p>
                        <p><span className="label">Комментарий:</span> {data.comment}</p>
                        <p><span className="label">Ответственные:</span> {data.responsible}</p>
                        <button
                            onClick={handleDownload}
                            style={{
                                marginTop: '20px'
                            }} className='btn'>Скачать акт</button>
                    </div>
                    <div className="content__images">
                        {data.images?.map((image, index) => (
                            <img
                                key={index}
                                src={host + image.path}
                                alt={`Image ${index}`}
                                onClick={() => openLightbox(index)}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                        {data.videos?.map((video, index) => {
                            return (
                                <video
                                    key={index}
                                    src={host + video.path}
                                    controls
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '500px'
                                    }}
                                />
                            )
                        })}
                    </div>
                    <ModalGateway>
                        {modalIsOpen ? (
                            <Modal onClose={closeLightbox}>
                                <Carousel
                                    currentIndex={currentImage}
                                    views={formatImagesForCarousel(data.images || [])}
                                />
                            </Modal>
                        ) : null}
                    </ModalGateway>
                </div>
            </div>
        </LoadingIndicator>
    )
}

export default Product;