import React, { useContext, useEffect, useState } from 'react'
import { Button } from '@mui/material';
import ReactStars from 'react-stars';
import { reviewsRef,db } from '../Firebase/Firebase';
import swal from 'sweetalert';
import { TailSpin, ThreeDots } from 'react-loader-spinner';
import { addDoc, doc ,updateDoc , query , where, getDocs } from 'firebase/firestore';
import { Appstate } from '../App';
import { useNavigate } from 'react-router-dom'

const Reviews = ({id , prevRating , userRated}) => {
  const useAppstate = useContext(Appstate)
  const navigate = useNavigate();

  const [rating , setRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [reviewsLoading , setReviewsLoading] = useState(false)
  const [form , setForm] = useState("")
  const [data , setData] = useState([])
  const [newAdded, setNewAdded] = useState(0);

    const sendReview = async () => {
        setLoading(true);
        try {
            if(useAppstate.login) {
            await addDoc(reviewsRef, {
                movieid: id,
                name: useAppstate.userName,
                rating: rating,
                thought: form,
                timestamp: new Date().getTime()
            })

            const ref = doc(db, "movies", id);
            await updateDoc(ref, {
                rating: prevRating + rating,
                rated: userRated + 1
            })

            setRating(0);
            setForm("");
            setNewAdded(newAdded + 1);
            swal({
                title: "Review Sent",
                icon: "success",
                buttons: false,
                timer: 3000
              })
            } else {
                navigate('/login')
            }
        } catch (error) {
            swal({
                title: error.message,
                icon: "error",
                buttons: false,
                timer: 3000
              })
        }
        setLoading(false);
    }

    useEffect(() => {
        async function getData() {
            setReviewsLoading(true);
            setData([]);
            let quer = query(reviewsRef, where('movieid', '==', id))
            const querySnapshot = await getDocs(quer);

            querySnapshot.forEach((doc) => {
                setData((prev) => [...prev, doc.data()])
            })

            setReviewsLoading(false);
        }
        getData();
    },[newAdded])

  return (
    <div className='mt-2 border-t-2 border-gray-600 w-full capitalize'>
    <ReactStars
      size={30}
      half={true}
      value={rating}
      onChange={(rate)=>setRating(rate)}
    />
      <input 
      className='py-2 rounded px-2 w-full mb-3 bg-[#15161a] outline-none'
      type='text'
      placeholder='Share your thought'
      value={form}
      onChange={(e)=>setForm(e.target.value)}
       />
       <Button onClick={sendReview} variant="contained" color="success" fullWidth>
          {loading ? <TailSpin height={30} color='white' /> : 'Share'}
       </Button>

       {
        reviewsLoading ? <div className='flex justify-center mt-8'><ThreeDots height={10} color='white'/></div>  
        : <div>
            {
              data.map((e,i) => {
                return (
                  <div key={i} className='bg-[#15161a] my-4 p-2 rounded'>
                    <div className='flex items-center'>
                      <p className='text-blue-400 mr-2'>{e.name}</p>
                      <p className='text-sm'>
                        ({new Date(e.timestamp).toLocaleString()})
                      </p>
                    </div>
                    <ReactStars
                      size={20}
                      half={true}
                      value={e.rating}
                      edit={false}
                    />
                    <p>{e.thought}</p>
                  </div>
                );
              })
            }
          </div>
       }
    </div>
  );
}

export default Reviews
