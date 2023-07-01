import React, { useEffect, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner';
import ReactStars from 'react-stars';
import { getDocs } from 'firebase/firestore';
import { moviesRef } from '../Firebase/Firebase';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
const Cards = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 }); // Set your mobile breakpoint here
  const starSize = isMobile ? 18 : 20;

  const [data, setData] = useState([]);
  const[loading , setLoading] = useState(false)

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const _data = await getDocs(moviesRef);
      _data.forEach((doc) => {
        setData((prv) => [...prv, {...(doc.data()), id: doc.id}])
      })
      setLoading(false);
    }
    getData();
  },[])
  return (
    <div className=' flex flex-wrap md:gap-10 gap-3 p-3 mt-20 mx-2 md:mx-10'>
    {loading ? 
      <div className='w-full flex justify-center items-center h-screen'><ThreeDots height={40} color='white'/> </div>:
      data.map((element, index) => {
        return (
          <Link to={`/detail/${element.id}`}>
            <div
              key={index}
              className='card capitalize w-[150px] h-[300px] md:w-[320px] md:h-[420px] font-semibold shadow-lg p-2 hover:-translate-y-1 cursor-pointer rounded-xl transition-all duration-500'
            >
              <img
                className='h-48 md:h-80 pb-3 w-full rounded-xl'
                src={element.image}
                alt='img'
              />
              <p className='text-sm my-1'>Title: {element.title}</p>
              <p className='flex items-center my-1 md:gap-2 gap-1 text-sm'>
                Rating:
                <ReactStars
                  size={starSize}
                  half={true}
                  value={element.rating/element.rated}
                  edit={false}
                />
              </p>
              <p>Year: {element.year}</p>
            </div>
          </Link>
        );
      })
    }
    </div>
  );
}

export default Cards
