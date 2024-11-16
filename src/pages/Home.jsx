import React from 'react'
import CustomCard from '../components/card/CustomCard'
import { Pagination } from '@mui/material'
const Home = () => {
  const data = [
    {
      id: 1,
      name: 'John'
    },
    {
      id: 2,
      name: 'Jane'
    },
    {
      id: 3,
      name: 'Jane'
    },
    {
      id: 4,
      name: 'Jane'
    },
    {
      id: 5,
      name: 'Jane'
    },
    {
      id: 6,
      name: 'Jane'
    },
    {
      id: 7,
      name: 'Jane'
    }
  ]
  return (
    <>
      <div className="cards">
        {data.map((item, index) => {
          return (
            <CustomCard key={index} item={item} />
          )
        })}
      </div>
      <div className="pagination">
        <Pagination count={10} />
      </div>
    </>
  )
}

export default Home
