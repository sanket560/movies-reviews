import React, { useEffect, useState } from 'react'
import ReactStars from 'react-stars'
import { useParams } from 'react-router-dom'
import { db } from '../Firebase/Firebase'
import { doc , getDoc } from 'firebase/firestore';
import { TailSpin } from 'react-loader-spinner'
import Reviews from './Reviews';

const Detail = () => {
    const [loading , setLoading] = useState(false)
    const {id} = useParams()
    const [data, setData] = useState({
        title: "",
        year: "",
        image: "",
        description: "",
        rating: 0,
        rated: 0
      });
      useEffect(() => {
        async function getData() {
          setLoading(true);
          const _doc = doc(db, "movies", id);
          const _data = await getDoc(_doc);
          setData(_data.data());
          setLoading(false);
        }
        getData();
      },[])
  return (
      <div className='mt-36 p-4 flex flex-col md:flex-row  md:w-[800px] mx-auto'>
        { loading ? <div className='w-20 mx-auto'><TailSpin color='white' /></div> :<>
           <img className='w-2/5 md:h-96 md:sticky md:top-20' src={data.image} alt="" />
                <div className='md:ml-4 mt-2 md:mt-0 capitalize'>
                    <p className='text-2xl font-bold'>{data.title} <span className='text-sm'>({data.year})</span></p>
                        <ReactStars 
                         size={20}
                         half={true}
                         value={data.rating/data.userRated}
                         edit={false}
                    />
                    <p className='mt-2 md:mt-0'>{data.description}</p>
                    <Reviews id={id} prevRating={data.rating} userRated={data.rated} />
                </div>
            </>
        }
       </div>
  )
}

export default Detail
