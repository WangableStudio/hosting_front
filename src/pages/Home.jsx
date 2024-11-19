// Home.js
import React, { useEffect, useState } from 'react';
import CustomCard from '../components/card/CustomCard';
import { Pagination } from '@mui/material';
import axios from 'axios';
import { host } from '../components/host';
import { useFilters } from '../components/context/FilterContext'; // Импортируем useFilters

const Home = () => {
    const { filters } = useFilters(); // Получаем фильтры из контекста
    const [data, setData] = useState([]);

    useEffect(() => {
        const { type, categories, attributes, searchQuery } = filters;

        const params = {
            type,
            categories: categories.join(','),
            attributes: attributes.join(','),
            search: searchQuery
        };

        axios.get(`${host}/api/v1/media/photo`, { params })
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при запросе:", error);
            });
    }, [filters]);

    return (
        <>
            <div className="cards">
                {data.map((item, index) => (
                    <CustomCard key={index} item={item} />
                ))}
            </div>
            {/* <div className="pagination">
                <Pagination count={10} />
            </div> */}
        </>
    );
};

export default Home;