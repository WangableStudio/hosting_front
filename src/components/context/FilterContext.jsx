// FilterContext.js
import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const useFilters = () => {
    return useContext(FilterContext);
};

export const FilterProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        type: '',
        city: '',
        organizationalization: '',
        id: '',
        categories: '',
        attributes: ''
    });

    const updateFilters = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <FilterContext.Provider value={{ filters, updateFilters }}>
            {children}
        </FilterContext.Provider>
    );
};