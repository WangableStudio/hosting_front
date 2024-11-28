import React, { useContext, useEffect, useState } from 'react'
import './admin.css'
import { host, token } from '../host';
import axios from 'axios'
import StickyHeadTable from '../table/UniversalTable';
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Paper, Select, TextField } from '@mui/material';
import { toast } from 'react-hot-toast';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LoadingIndicator from '../LoadingIndicator';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { UserContext } from '../context/UserContext';

const columns = [
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'type', label: 'Тип', minWidth: 100 },
  { id: 'city', label: 'Город', minWidth: 50 },
  { id: 'units', label: 'Номер тр. единицы', minWidth: 200 },
  { id: 'supplier', label: 'Поставщик', minWidth: 200 },
  { id: 'doc', label: 'Сопр. Документы', minWidth: 50 },
  { id: 'organization', label: 'Организация', minWidth: 150 },
  { id: 'responsible', label: 'Ответственные', minWidth: 150 },
  { id: 'categoryId', label: 'Транспортная единица', minWidth: 200 },
  { id: 'attributeId', label: 'Тип товара', minWidth: 150 },
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

const Acts = () => {
  const user = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [acts, setActs] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    axios.get(user.user.status === 'AUDITOR' ? `${host}/api/v1/media/user` : `${host}/api/v1/media/`, {
      headers: user.user.status === 'AUDITOR' ? { Authorization: `Bearer ${token}` } : {}
    })
      .then((response) => {
        setActs(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при запросе:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location.pathname]);

  return (
    <LoadingIndicator loading={loading}>
      <div className="container">
        <Box sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'left',
          gap: '20px',
          marginTop: '20px',
          marginBottom: '20px',
        }}>
          {user.user.status !== 'AUDITOR' &&
            <h1 onClick={() => navigate('/users')} style={{
              fontSize: '24px',
              cursor: 'pointer',
              fontWeight: '400',
              borderBottom: location.pathname === '/users' ? '2px solid' : 'none',
            }}>Пользователи</h1>
          }
          <h1 onClick={() => navigate('/acts')} style={{
            fontSize: '24px',
            cursor: 'pointer',
            fontWeight: '400',
            borderBottom: location.pathname === '/acts' ? '2px solid' : 'none',
          }}>Акты</h1>
        </Box>
        <Box className="title__btn" sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginTop: '20px',
          marginBottom: '20px',
        }}>
          <div className="title" ><span>Акты</span></div>
        </Box>
        <StickyHeadTable
          rows={acts}
          columns={columns}
        />
      </div>
    </LoadingIndicator>
  )
}

export default Acts
