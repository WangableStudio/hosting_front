import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Box } from '@mui/system';
import { Checkbox, FormControl, FormGroup, FormLabel, Radio, RadioGroup } from '@mui/material';
import axios from 'axios';
import { host } from '../host';
import { useFilters } from '../context/FilterContext';

export default function FilterSearch() {
    const [open, setOpen] = React.useState(false);
    const { filters, updateFilters } = useFilters(); // Получаем и обновляем фильтры
    const [tempFilters, setTempFilters] = React.useState({
        type: filters.type,
        categories: [...filters.categories],
        attributes: [...filters.attributes],
    });
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleFilterChange = (event) => {
        const { name, value, checked } = event.target;

        if (name === 'type') {
            setTempFilters({ ...tempFilters, type: value }); // Обновляем только тип
        } else if (name === 'category') {
            setTempFilters({
                ...tempFilters,
                categories: checked
                    ? [...tempFilters.categories, value]
                    : tempFilters.categories.filter(item => item !== value)
            });
        } else if (name === 'attribute') {
            setTempFilters({
                ...tempFilters,
                attributes: checked
                    ? [...tempFilters.attributes, value]
                    : tempFilters.attributes.filter(item => item !== value)
            });
        }
    };

    const [categories, setCategories] = React.useState([]);
    const [attributes, setAttributes] = React.useState([]);

    const handleClickOpen = () => {
        setOpen(true); // Открыть модальное окно
    };

    const handleClose = () => {
        setOpen(false); // Закрыть модальное окно
    };

    React.useEffect(() => {
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
        updateFilters({ ...tempFilters, searchQuery });
        handleClose();
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value); // Обновляем поисковый запрос
    };

    return (
        <>
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', maxWidth: 400, width: '90%' }}
            >
                <IconButton sx={{ p: '10px' }} aria-label="menu" onClick={handleClickOpen}>
                    <FilterListIcon />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Поиск по ключевым словам"
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchQuery} // Устанавливаем значение поля поиска
                    onChange={handleSearchChange} // Обрабатываем изменение текста
                />
                <IconButton onClick={handleSaveFilters} type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>

            <Dialog open={open} onClose={handleClose} sx={{
                width: '35%',
                margin: '0 auto',
            }}>
                <DialogTitle>Фильтры</DialogTitle>
                <DialogContent sx={{
                    padding: '0px 24px',
                    display: 'flex',
                    justifyContent: 'start',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    gap: '10px'
                }}>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Тип</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            value={tempFilters.type}
                            onChange={handleFilterChange}
                            name="type"
                        >
                            <FormControlLabel value="Брак" control={<Radio />} label="Брак" />
                            <FormControlLabel value="Недопостановка" control={<Radio />} label="Недопостановка" />
                            <FormControlLabel value="Пересорт" control={<Radio />} label="Пересорт" />
                            <FormControlLabel value="Обычный" control={<Radio />} label="Обычный" />
                        </RadioGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Категории</FormLabel>
                        <FormGroup>
                            {categories.map(category => (
                                <FormControlLabel
                                    key={category.id}
                                    control={<Checkbox checked={tempFilters.categories.includes(category.id)} />}
                                    label={category.name}
                                    value={category.id}
                                    name="category"
                                    onChange={handleFilterChange}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Аттребуты</FormLabel>
                        <FormGroup>
                            {attributes.map(attribute => (
                                <FormControlLabel
                                    key={attribute.id}
                                    control={<Checkbox checked={tempFilters.attributes.includes(attribute.id)} />}
                                    label={attribute.name}
                                    value={attribute.id}
                                    name="attribute"
                                    onChange={handleFilterChange}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Button onClick={handleSaveFilters}>Применить</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}