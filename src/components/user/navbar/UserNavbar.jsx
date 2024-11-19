import React from 'react'
import { NavLink } from 'react-router-dom'

const UserNavbar = () => {
    return (
        <div className="header_nav container">
            <div className="nav_bar">
                <NavLink to="/user/vd">
                    <p className="nav_cont">Видео</p>
                </NavLink>
                <NavLink to="/user/ph">
                    <p className="nav_cont">Фото</p>
                </NavLink>
            </div>
        </div>
    )
}

export default UserNavbar
