import React, { useEffect, useState } from 'react'
import CustomCard from '../components/card/CustomCard'
import { Pagination } from '@mui/material'
import { host } from '../components/host'
import axios from 'axios'
import { useFilters } from '../components/context/FilterContext'

const Video = () => {
  const { filters } = useFilters(); // Получаем фильтры из контекста
  const [data, setData] = useState([]);

  useEffect(() => {
      const { type, categories, attributes } = filters;

      console.log(filters);
      const params = {
          type,
          categories: categories.join(','),
          attributes: attributes.join(',')
      };

      axios.get(`${host}/api/v1/media/video`, { params })
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
        {data.map((item, index) => {
          return (
            <CustomCard key={index} item={item} />
          )
        })}
      </div>
      {/* <div className="pagination">
        <Pagination count={10} />
      </div> */}
    </>
  )
}

export default Video
