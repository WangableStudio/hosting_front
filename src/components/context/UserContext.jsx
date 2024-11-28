import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { host, token } from '../host';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ isAdmin: false, isAuditor: false, isAuthenticated: false, user: null });

    useEffect(() => {
        const checkUserRole = async () => {
            if (!token) return;
            axios.post(`${host}/api/v1/user/auth`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(response => {
                if (response.data.status == 'ADMIN') {
                    setUser({ isAdmin: true, isAuthenticated: true, user: response.data });
                } else if(response.data.status === 'ADMINAUDITOR'){
                    setUser({ isAdmin: false, isAuditor: true, isAuthenticated: true, user: response.data });
                } else {
                    setUser({ isAdmin: false, isAuthenticated: true, user: response.data });
                }
            }).catch(err => {
                setUser({ isAdmin: false, isAuthenticated: false });
            })
        };

        checkUserRole();
    }, []);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};
