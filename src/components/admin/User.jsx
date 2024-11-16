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
    { id: 'email', label: 'Почта', minWidth: 170 },
    { id: 'status', label: 'Роль', minWidth: 170 },
    { id: 'lastentry', label: 'Последний вход', minWidth: 170 },
    { id: 'actions', label: 'Действия', minWidth: 100, align: 'right' },
];

const Users = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${host}/api/v1/user/users`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
            setUsers(response.data)
        }).catch(error => {
            console.log(error);
        })
    }, [])

    return (
        <>
            <AdminNavbar />
            <div className="container">
                <div className="title" ><span>История транзакций</span></div>
                <StickyHeadTable
                    rows={users}
                    columns={columns}
                />
            </div>
        </>
    )
}

export default Users
