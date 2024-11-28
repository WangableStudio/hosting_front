import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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

export default function MultipleSelect({ data, onChange }) {
    const theme = useTheme();
    const [personName, setPersonName] = React.useState('');

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(value);
        if (onChange) {
            onChange(event); // Передаем событие в родительский компонент
        }
    };

    return (
        <FormControl sx={{ width: '100%' }}>
            <Select
                sx={{
                    backgroundColor:'#FFF',
                    height: '40px',
                }}
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={personName}
                onChange={handleChange}
                MenuProps={MenuProps}
            >
                {data.map((item) => (
                    <MenuItem
                        sx={{
                            width: '100%'
                        }}
                        key={item}
                        value={item}
                        style={getStyles(item, personName, theme)}
                    >
                        {item}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}