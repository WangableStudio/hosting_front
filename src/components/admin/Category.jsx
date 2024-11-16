import React, { useEffect, useState } from 'react'
import './admin.css'
import UniversalTable from '../table/UniversalTable'
import host from '../host';
import axios from 'axios'
import StickyHeadTable from '../table/UniversalTable';
import AdminNavbar from './navbar/AdminNavbar';

const columns = [
  { id: 'id', label: 'ID', minWidth: 170 },
  { id: 'name', label: 'Название', minWidth: 170 },
  { id: 'actions', label: 'Действия', minWidth: 100, align: 'right' },
];

const Category = () => {
  const [category, setCategory] = useState([])

  useEffect(() => {
    axios.get(`${host}/api/v1/category`).then((response) => {
      setCategory(response.data)
    }).catch(error => {
      console.log(error);
    })
  }, [])

  return (
    <>
      <AdminNavbar/>
      <div className="container">
        <div className="title" ><span>История транзакций</span></div>
        <StickyHeadTable
          rows={category}
          columns={columns}
        />
      </div>
    </>
  )
}

export default Category
