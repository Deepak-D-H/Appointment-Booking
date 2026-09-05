import React from 'react';
import userImg from "../../assets/images/doctor-img01.png"
import { useContext, useState } from 'react';
import { authContext } from "./../../context/AuthContext"
import MyBookings from './MyBookings';
import Profile from './Profile';
import useGetProfile from '../../hooks/useFetchData';
import { BASE_URL } from '../../config';
import Loading from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';

const MyAccount = () => {


  const { dispatch } = useContext(authContext)
  const [tab, setTab] = useState("bookings")

  const {data:userData,loading,error} = useGetProfile(`${BASE_URL}/api/v1/users/profile/me`);

  //useGetProfile(`${BASE_URL}/users/profile/me`)

  // console.log(userData,"userdata")


  const handleLogout = () => {
    dispatch({ type: "LOGOUT" })
  }

  const handleDeleteAccount = async () => {
    const confirm = window.confirm('Are you sure you want to delete your account? This action cannot be undone.')
    if (!confirm) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${BASE_URL}/api/v1/users/${userData._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Failed to delete account')

      // on success, logout and redirect
      dispatch({ type: 'LOGOUT' })
      window.location.href = '/'
    } catch (err) {
      console.error('Delete account failed', err)
      alert(err.message || 'Failed to delete account')
    }
  }

  return (
    <section>
      <div className='max-w-[1170px] px-5 mx-auto'>

        {loading &&!error &&<Loading/>}

        {error &&!loading && <Error errMessage={error}/>}




        {!loading && !error && (<div className='grid md:grid-cols-3 gap-10'>
          <div className='pb-[50px] px-[30px] rounded-md'>
            <div className='flex items-center justify-center'>
              <figure className='w-[100px] h-[100px] rounded-full border-2 border-solid border-blue-400 overflow-hidden'>
                <img src={userData.photo || userImg} alt={userData.name || 'User'} className='w-full h-full rounded-full object-cover' />
              </figure>
            </div>
            <div className='text-center mt-4'>
              <h3 className='text-[18px] leading-[30px] text-gray-950 font-bold' >
                {userData.name}
              </h3>
              <p className='text-gray-950 text-[15px] leading-15 font-medium'>
                {userData.email}
              </p>
              <p className='text-gray-950 text-[15px] leading-15 font-medium'>
                Blood Type:<span className='ml-2 text-[18px] text-black font-semibold leading-8'>{userData.bloodType || 'N/A'}</span>
              </p>
            </div>
            <div className='mt-[50px] md:mt-[100px]'>
              <button onClick={handleLogout} className='w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white cursor-pointer'>Logout</button>


              <button onClick={handleDeleteAccount} className='w-full mt-4 bg-red-600 p-3 text-[16px] leading-7 rounded-md text-white cursor-pointer '>Delete account</button>

            </div>

          </div>

          <div className='md:col-span-2 md:px-[30px]'>
            <div >
              <button
                onClick={() => setTab("bookings")}
                className={`${tab === "bookings" && "bg-blue-400 text-white font-normal"} py-2 mr-5 px-5 rounded-md text-black font-semibold text-[16px] leading-7 border border-solid border-blue-400 cursor-pointer`}> My Bookings
              </button>


              <button
                onClick={() => setTab("settings")}
                className={`${tab === "settings" && "bg-blue-400 text-white font-normal"}  py-2 px-5 rounded-md text-black font-semibold text-[16px] leading-7 border border-solid border-blue-300 cursor-pointer`}>
                Profile Settings
              </button>
            </div>
            {
              tab === 'bookings' && <MyBookings />
            }
            {
              tab === 'settings' && <Profile user={userData} />
            }

          </div>


        </div>)}

        

      </div>
    </section>

  );
}

export default MyAccount;
