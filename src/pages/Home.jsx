// Home.js
import React, { useEffect, useState } from 'react';
import CustomCard from '../components/card/CustomCard';
import { Pagination } from '@mui/material';
import axios from 'axios';
import { host } from '../components/host';
import { useFilters } from '../components/context/FilterContext'
import LoadingIndicator from '../components/LoadingIndicator'; 

const Home = () => {
    const { filters } = useFilters();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const { type, categories, attributes, searchQuery } = filters;

        const params = {
            type,
            categories: categories.join(','),
            attributes: attributes.join(','),
            search: searchQuery
        };

        setLoading(true); // Устанавливаем состояние загрузки в true перед запросом

        axios.get(`${host}/api/v1/media/photo`, { params })
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при запросе:", error);
            })
            .finally(() => {
                setLoading(false); // Устанавливаем состояние загрузки в false после завершения запроса
            });
    }, [filters]);

    return (
        <LoadingIndicator loading={loading}>
            <div className="cards">
                {data.map((item, index) => (
                    <CustomCard key={index} item={item} />
                ))}
            </div>
            {/* <div className="pagination">
                <Pagination count={10} />
            </div> */}
        </LoadingIndicator>
    );
};

export default Home;