import React from 'react';
import DoctorCard from './DoctorCard';
import { BASE_URL } from '../../config';
import useFetchData from '../../hooks/useFetchData';
import Loader from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';

const DoctorList = () => {
  const { data: doctors, loading, error } = useFetchData(`${BASE_URL}/api/v1/doctors`);

  return (
    <>
      {loading && <Loader />}
      {error && <Error errMessage={error} />}

      {!loading && !error && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]'>
          {(doctors && Array.isArray(doctors) ? doctors : []).map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      )}

      {!loading && !error && (!doctors || doctors.length === 0) && (
        <div className='text-center py-10'>
          <p className='text-gray-500 text-[18px]'>No doctors found at the moment.</p>
        </div>
      )}
    </>
  );
};

export default DoctorList;
