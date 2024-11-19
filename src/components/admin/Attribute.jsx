import React, { useEffect, useState } from 'react'
import './admin.css'
import UniversalTable from '../table/UniversalTable'
import { host, token } from '../host';
import axios from 'axios'
import StickyHeadTable from '../table/UniversalTable';
import AdminNavbar from './navbar/AdminNavbar';
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Paper, Select, TextField } from '@mui/material';
import { toast } from 'react-hot-toast';
import LoadingIndicator from '../LoadingIndicator';

const columns = [
  { id: 'id', label: 'ID', minWidth: 170 },
  { id: 'name', label: 'Название', minWidth: 170, align: 'left' },
  { id: 'categoryId', label: 'Категория', minWidth: 170, align: 'left' },
  { id: 'actions', label: 'Действия', minWidth: 100, align: 'right' },
];

const Attribute = () => {
  const [attributes, setAttributes] = useState([])
  const [category, setCategory] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${host}/api/v1/attribute`).then((response) => {
      setAttributes(response.data)
      axios.get(`${host}/api/v1/category`).then((response) => {
        setCategory(response.data)
      }).catch(error => {
        console.log(error);
      }).finally(() => {
        setLoading(false);
      })
    }).catch(error => {
      console.log(error);
    })

  }, [])

  const handleAdd = () => {
    setOpenModal(true);
  }
  const handleSave = () => {
    setLoading(true)
    const data = {
      name,
      categoryId
    }
    axios.post(`${host}/api/v1/attribute/create`, data, {
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
          <div className="title" ><span>Аттребуты</span></div>
          <Button onClick={handleAdd} variant="contained" color="secondary">
            Добавить нововый аттребут
          </Button>
        </Box>
        <StickyHeadTable
          rows={attributes}
          columns={columns}
        />
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Paper sx={{ padding: 2, margin: 'auto', maxWidth: 400, marginTop: '10%' }}>
          <h2 style={{ marginBottom: '15px' }}>Добавить</h2>
          <TextField
            fullWidth
            label="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
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
              {category.map(category => (
                <MenuItem value={category.id}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
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

export default Attribute
