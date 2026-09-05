import React, { useEffect, useState } from 'react';
import DoctorCard from './../../components/Doctors/DoctorCard';
import Testimonial from '../../components/Testimonial/Testimonial';
import { BASE_URL } from '../../config';
import useFetchData from '../../hooks/useFetchData';
import Loader from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';

const Doctors = () => {
  const [query, setQuery] = useState('');
  const [debounceQuery, setDebounceQuery] = useState('');

  const handleSearch = () => {
    setDebounceQuery(query.trim());
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceQuery(query.trim());
    }, 500);
    return () => clearTimeout(timeout);
  }, [query]);

  const { data: doctors, loading, error } = useFetchData(
    `${BASE_URL}/api/v1/doctors?query=${debounceQuery}`
  );

  return (
    <>
      <section className='bg-white py-8'>
        <div className='container text-center'>
          <h2 className='heading'>Find a Doctor</h2>
          <div className='max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between overflow-hidden'>
            <input
              type='search'
              className='py-4 pl-4 pr-2 bg-transparent focus:outline-none w-full placeholder:text-gray-600'
              placeholder='Search doctor by name or specialization...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              className='btn mt-0 rounded-none px-6 py-4 cursor-pointer hover:bg-blue-600'
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <section className='py-8'>
        <div className='container'>
          {loading && <Loader />}
          {error && <Error errMessage={error} />}

          {!loading && !error && (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
              {(doctors && Array.isArray(doctors) ? doctors : []).map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}

          {!loading && !error && (!doctors || doctors.length === 0) && (
            <div className='text-center py-16'>
              <h3 className='text-xl text-gray-600 font-medium'>No doctors found matching your criteria.</h3>
              <p className='text-gray-400 mt-2'>Try searching with different keywords or clear your search.</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className='container'>
          <div className='xl:w-[470px] mx-auto text-center'>
            <h2 className='heading'>What our patients say</h2>
            <p className='text__para'>
              World-class care for everyone. Our health system offers unmatched, expert health care.
            </p>
          </div>
          <Testimonial />
        </div>
      </section>
    </>
  );
};

export default Doctors;
