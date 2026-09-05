import React, { useState } from 'react';
import defaultDoctorImg from '../../assets/images/doctor-img02.png';
import starIcon from '../../assets/images/Star.png';
import DoctorAbout from './DoctorAbout';
import Feedback from './Feedback';
import SidePanel from './SidePanel';
import { BASE_URL } from '../../config';
import useFetchData from '../../hooks/useFetchData';
import Loader from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';
import { useParams } from 'react-router-dom';

const DoctorDetails = () => {
  const [tab, setTab] = useState('about');
  const { id } = useParams();

  const { data: doctor, loading, error } = useFetchData(`${BASE_URL}/api/v1/doctors/${id}`);

  const {
    name,
    qualifications,
    experiences,
    timeSlots,
    reviews,
    bio,
    about,
    averageRating,
    totalRating,
    specialization,
    ticketPrice,
    photo,
  } = doctor || {};

  return (
    <section>
      <div className='max-w-[1170px] px-5 mx-auto'>
        {loading && <Loader />}
        {error && <Error errMessage={error} />}

        {!loading && !error && doctor && (
          <div className='grid md:grid-cols-3 gap-[50px]'>
            <div className='md:col-span-2'>
              <div className='flex items-center gap-5'>
                <figure className='max-w-[200px] max-h-[200px] rounded-lg overflow-hidden'>
                  <img className='w-full h-full object-cover' src={photo || defaultDoctorImg} alt={name || 'Doctor'} />
                </figure>
                <div>
                  <span className='bg-[#CCF0F3] text-blue-600 py-1 px-6 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded'>
                    {specialization || 'General Specialist'}
                  </span>
                  <h3 className='text-black text-[22px] leading-9 mt-3 font-bold'>{name}</h3>
                  <div className='flex items-center gap-1.5'>
                    <span className='flex items-center gap-1.5 text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-semibold text-black'>
                      <img src={starIcon} alt='Star' /> {averageRating || 0}
                    </span>
                    <span className='text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-normal text-gray-500'>
                      ({totalRating || 0})
                    </span>
                  </div>
                  <p className='text__para text-[14px] leading-6 md:text-[15px] lg:max-w-[390px]'>
                    {bio}
                  </p>
                </div>
              </div>

              <div className='mt-[50px] border-b border-solid border-[#0066ff34]'>
                <button
                  onClick={() => setTab('about')}
                  className={`${
                    tab === 'about' ? 'border-b-2 border-solid border-blue-500 text-blue-600' : 'text-black'
                  } py-2 px-5 mr-5 text-[16px] leading-7 font-semibold cursor-pointer`}
                >
                  About
                </button>
                <button
                  onClick={() => setTab('feedback')}
                  className={`${
                    tab === 'feedback' ? 'border-b-2 border-solid border-blue-500 text-blue-600' : 'text-black'
                  } py-2 px-5 mr-5 text-[16px] leading-7 font-semibold cursor-pointer`}
                >
                  Feedback
                </button>
              </div>

              <div className='mt-[50px]'>
                {tab === 'about' && (
                  <DoctorAbout
                    name={name}
                    about={about}
                    qualifications={qualifications}
                    experiences={experiences}
                  />
                )}
                {tab === 'feedback' && (
                  <Feedback reviews={reviews || []} totalRating={totalRating || 0} />
                )}
              </div>
            </div>

            <div>
              <SidePanel doctorId={doctor._id} ticketPrice={ticketPrice} timeSlots={timeSlots} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorDetails;
