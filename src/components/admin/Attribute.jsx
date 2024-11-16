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
];

const Attribute = () => {
  const [attribute, setAttribute] = useState([])

  useEffect(() => {
    axios.get(`${host}/api/v1/attribute`).then((response) => {
      setAttribute(response.data)
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
          rows={attribute}
          columns={columns}
        />
      </div>
    </>
  )
}

export default Attribute
