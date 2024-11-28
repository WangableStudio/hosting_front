import React, { useContext, useEffect, useState } from 'react'
import './style/how.css'
import how1 from '../images/how1.avif'
import how2 from '../images/how2.avif'
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

const HowToCreate = () => {
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
  return (
    <div className='how'>
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
      <div className="how__blocks">
        <div className="how__block">
          <div className="how__title">
            <span>1. Для создания акта Вам необходимо нажать на кнопку <span className='underline'>"Создать документ"</span></span>
          </div>
          <img src={how1} alt="" />
        </div>
        <div className="how__block">
          <div className="how__title">
            <span>2. Откроется страница создания акта, где необходимо заполнить данные. </span>
          </div>
          <img src={how2} alt="" />
        </div>
        <div className="how__block">
          <div className="how__title">
            <span>3.</span>
          </div>
          <div className="how__desc">
            <span><p>Город</p> - город в котором производится приемка или ревизия товара.</span>
            <span><p>Тип Акта</p>- Брак, Недопоставка, Пересорт, или обычный. </span>
            <span><p>Организация</p> - Организация в которой производится актированиею</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowToCreate
