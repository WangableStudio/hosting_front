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

export default function FilterSearch() {
    const [open, setOpen] = React.useState(false); // Состояние для открытия/закрытия модального окна
    const [filters, setFilters] = React.useState({}); // Состояние для всех фильтров (категории и атрибуты)

    const categories = ["Категория 1", "Категория 2", "Категория 3", "Категория 4"];
    const attributes = ["Атрибут 1", "Атрибут 2", "Атрибут 3", "Атрибут 4"];

    const handleClickOpen = () => {
        setOpen(true); // Открыть модальное окно
    };

    const handleClose = () => {
        setOpen(false); // Закрыть модальное окно
    };

    const handleFilterChange = (event) => {
        const { name, checked } = event.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: checked,
        }));
    };

    const handleSaveFilters = () => {
        console.log('Выбранные фильтры:', filters); // Здесь можно обработать сохранение фильтров
        handleClose(); // Закрыть окно после сохранения
    };

    const Android12Switch = styled(Switch)(({ theme }) => ({
        padding: 8,
        '& .MuiSwitch-track': {
            borderRadius: 22 / 2,
            '&::before, &::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 16,
            },
            '&::before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    theme.palette.getContrastText(theme.palette.primary.main),
                )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
                left: 12,
            },
            '&::after': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    theme.palette.getContrastText(theme.palette.primary.main),
                )}" d="M19,13H5V11H19V13Z" /></svg>')`,
                right: 12,
            },
        },
        '& .MuiSwitch-thumb': {
            boxShadow: 'none',
            width: 16,
            height: 16,
            margin: 2,
        },
    }));

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
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>

            <Dialog open={open} onClose={handleClose} sx={{
                width:'100%'
            }}>
                <DialogTitle>Фильтры</DialogTitle>
                <DialogContent sx={{
                    padding: '10px',
                }}>
                    <Box>
                        <h3>Категории</h3>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {categories.map((category, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                    <span >{category}</span>
                                    <FormControlLabel
                                        sx={{ margin: '0px' }}
                                        control={<Android12Switch defaultChecked />}
                                        label={""}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    <Divider sx={{ margin: '10px 0' }} />

                    <Box>
                        <h3>Атрибуты</h3>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {attributes.map((attribute, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                    {/* Текст фильтра (категория) перед Switch */}
                                    <span style={{ marginRight: '10px' }}>{attribute}</span>
                                    <FormControlLabel
                                    sx={{ margin: '0px' }}
                                        control={<Android12Switch defaultChecked />}
                                        label={""}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Отменить
                    </Button>
                    <Button onClick={handleSaveFilters} color="primary">
                        Применить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
