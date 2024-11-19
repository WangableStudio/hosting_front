import React, { useEffect, useState } from 'react'
import './admin.css'
import axios from 'axios'
import StickyHeadTable from '../table/UniversalTable';
import AdminNavbar from './navbar/AdminNavbar';
import { toast } from 'react-hot-toast';
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Paper, Select, TextField } from '@mui/material';
import { host, token } from '../host';
import LoadingIndicator from '../LoadingIndicator';

const columns = [
  { id: 'id', label: 'ID', minWidth: 170 },
  { id: 'name', label: 'Название', minWidth: 170 },
  { id: 'actions', label: 'Действия', minWidth: 100, align: 'right' },
];

const Category = () => {
  const [categories, setCategories] = useState([])
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${host}/api/v1/category`).then((response) => {
      setCategories(response.data)
    }).catch(error => {
      console.log(error);
    }).finally(() => {
      setLoading(false);
    })
  }, [])

  const handleAdd = () => {
    setOpenModal(true);
  }
  const handleSave = () => {
    const data = {
      name,
    }
    axios.post(`${host}/api/v1/category/create`, data, {
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
          <div className="title" ><span>Категории</span></div>
          <Button onClick={handleAdd} variant="contained" color="secondary">
            Добавить нововую категорию
          </Button>
        </Box>
        <StickyHeadTable
          rows={categories}
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

export default Category
