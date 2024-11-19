import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminNavbar = () => {
    return (
        <div className="header_nav container">
            <div className="nav_bar">
                <NavLink to="/users">
                    <p className="nav_cont">Пользователи</p>
                </NavLink>
                <NavLink to="/category">
                    <p className="nav_cont">Категории</p>
                </NavLink>
                <NavLink to="/attribute">
                    <p className="nav_cont">Аттребуты</p>
                </NavLink>
                <NavLink to="/vd">
                    <p className="nav_cont">Видео</p>
                </NavLink>
                <NavLink to="/ph">
                    <p className="nav_cont">Фото</p>
                </NavLink>
            </div>
        </div>
    )
}

export default AdminNavbar
