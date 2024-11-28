import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import './style/home.css';
import { TextField } from '@mui/material';
import { useFilters } from '../components/context/FilterContext';
import LoadingIndicator from '../components/LoadingIndicator';
import axios from 'axios';
import { host } from '../components/host';
import Card from '../components/card/Card';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { UserContext } from '../components/context/UserContext';
import { useNavigate } from 'react-router-dom';

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

const Home = () => {
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  const { isAuthenticated } = useContext(UserContext);
  const { filters, updateFilters } = useFilters();
  const [tempFilters, setTempFilters] = useState({
    type: filters.type,
    organization: filters.organization,
    city: filters.city,
    id: filters.id,
    categories: filters.categories,
    attributes: filters.attributes,
  });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [type, setType] = useState('');
  const [organization, setOrganization] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [attributeId, setAttributeId] = useState('');
  const [city, setCity] = useState('');
  const [number, setNumber] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const theme = useTheme();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const types = [
    'Брак',
    'Недопоставка',
    'Пересорт',
    'Обычный'
  ];

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
  ];

  useEffect(() => {
    const { id, type, categories, organization, attributes, city, searchQuery } = filters;
    const params = {
      type,
      city,
      organization,
      id,
      categories,
      attributes,
      search: searchQuery,
    };
    axios.get(`${host}/api/v1/media/`, { params })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при запросе:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
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

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (isNaN(dateA) || isNaN(dateB)) {
      console.warn("Неверный формат даты:", a.createdAt, b.createdAt);
      return 0;
    }

    if (sortOrder === 'newest') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                >
                  {citys.map((item) => (
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
          <div className="content__filter">
            <p onClick={() => handleSortChange('newest')}>начала новые</p>
            <p onClick={() => handleSortChange('oldest')}>начала старые</p>
          </div>
          <div className="content__cards">
            {paginatedData.map((card, index) => (
              <Card key={index} item={card} />
            ))}
          </div>
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>{'<'}</button>
            {[...Array(Math.ceil(sortedData.length / itemsPerPage))].map((_, index) => (
              <button key={index} onClick={() => handlePageChange(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
                {index + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === Math.ceil(sortedData.length / itemsPerPage)}>{'>'}</button>
          </div>
        </div>
      </div>
    </LoadingIndicator>
  );
};

export default Home;