import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import uploadImageCloudinary from '../../utils/uploadCloudinary';
import { BASE_URL } from '../../config';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';

const Profile = ({ user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photo: null,
    gender: '',
    bloodType: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    setFormData((prev) => ({
      name: user?.name ?? prev.name ?? '',
      email: user?.email ?? prev.email ?? '',
      password: prev.password ?? '',
      photo: user?.photo ?? prev.photo ?? null,
      gender: user?.gender ?? prev.gender ?? '',
      bloodType: user?.bloodType ?? prev.bloodType ?? '',
    }));
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const data = await uploadImageCloudinary(file);
      const photoUrl = data?.secure_url || data?.url;
      if (photoUrl) {
        setSelectedFile(photoUrl);
        setFormData({ ...formData, photo: photoUrl });
        toast.success('Photo uploaded successfully');
      }
    } catch {
      toast.error('Failed to upload photo');
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const authToken = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/v1/users/${user._id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });
      const { message } = await res.json();

      if (!res.ok) {
        throw new Error(message);
      }
      setLoading(false);
      toast.success(message);
      navigate('/users/profile/me');
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className='mt-10'>
      <form onSubmit={submitHandler}>
        <div className='mb-5'>
          <input
            type='text'
            placeholder='Full Name'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            className='w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-gray-900 text-[16px] leading-7 text-black placeholder:text-gray-900 rounded-md cursor-pointer'
          />
        </div>
        <div className='mb-5'>
          <input
            type='email'
            placeholder='Email'
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            className='w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-gray-900 text-[16px] leading-7 text-black placeholder:text-gray-900 rounded-md cursor-pointer'
            readOnly
          />
        </div>
        <div className='mb-5'>
          <input
            type='password'
            placeholder='Password (leave blank to keep unchanged)'
            name='password'
            value={formData.password}
            onChange={handleInputChange}
            className='w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-gray-900 text-[16px] leading-7 text-black placeholder:text-gray-900 rounded-md cursor-pointer'
          />
        </div>
        <div className='mb-5'>
          <input
            type='text'
            placeholder='Blood Type'
            name='bloodType'
            value={formData.bloodType}
            onChange={handleInputChange}
            className='w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-gray-900 text-[16px] leading-7 text-black placeholder:text-gray-900 rounded-md cursor-pointer'
          />
        </div>
        <div className='mb-5 flex items-center justify-between'>
          <label className='text-gray-700 font-bold text-[16px] leading-7'>
            Gender:
            <select
              name='gender'
              value={formData.gender}
              onChange={handleInputChange}
              className='text-gray-700 font-bold text-[16px] leading-7 px-4 py-3 focus:outline-none '
            >
              <option value=''>Select</option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
              <option value='other'>Other</option>
            </select>
          </label>
        </div>
        <div className='mb-5 flex items-center gap-3'>
          {formData.photo && (
            <figure className='w-[60px] h-[60px] rounded-full border-2 border-solid border-blue-400 flex items-center justify-center overflow-hidden'>
              <img className='w-full h-full object-cover' src={formData.photo} alt='' />
            </figure>
          )}
          <div className='relative w-[130px] h-[50px]'>
            <input
              type='file'
              name='photo'
              onChange={handleFileInputChange}
              id='customFile'
              accept='.jpg,.png'
              className='absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer'
            />
            <label
              htmlFor='customFile'
              className='absolute top-0 left-0 w-full h-full flex items-center px-3 py-1.5 text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-gray-700 font-semibold rounded-lg truncate cursor-pointer'
            >
              {selectedFile ? 'Change photo' : 'Upload photo'}
            </label>
          </div>
        </div>
        <div className='mt-5'>
          <button
            disabled={loading}
            type='submit'
            className='w-full bg-blue-500 text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 cursor-pointer'
          >
            {loading ? <HashLoader size={25} color='#ffffff' /> : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
