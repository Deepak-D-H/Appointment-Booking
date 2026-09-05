import { useState } from 'react';
import signupImg from '../assets/images/signup.gif';
import { Link, useNavigate } from 'react-router-dom';
import uploadImageCloudinary from '../utils/uploadCloudinary';
import { BASE_URL } from '../config'
import { toast } from "react-toastify";
import HashLoader from 'react-spinners/HashLoader';

const Signup = () => {
  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photo: '',
    // photo:selectedFile,
    gender: '',
    role: 'patient'
  })
  const navigate = useNavigate()


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }


  // const handleFileInputChange = async (event) => {
  //   const file = event.target.files[0]
  //   if (!file) return

  //   const data = await uploadImageCloudinary(file)

  //   setPreviewURL(data.secure_url)
  //   setFormData(prev => ({
  //     ...prev,
  //     photo: data.secure_url,   // ✅ single source of truth
  //   }))
  // }




  const handleFileInputChange = async(event)=>{
    const file = event.target.files[0];
    if (!file) return

    try {
      const data = await uploadImageCloudinary(file)

      // Cloudinary generally returns `secure_url`; fall back to `url` if needed
      const imageUrl = data?.secure_url || data?.url

      if (!imageUrl) {
        toast.error('Image upload failed: no URL returned')
        return
      }

      setFormData((prev) => ({ ...prev, photo: imageUrl }));
    } catch {
      toast.error('Image upload failed. Check network or Cloudinary settings.');
    }
  };
  const submitHandler = async (event) => {
    // console.log(formData)
    event.preventDefault();
    setLoading(true)
    try {

      const res = await fetch(`${BASE_URL}/api/v1/auth/register`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const { message } = await res.json()

      if (!res.ok) {
        throw new Error(message)
      }
      setLoading(false)
      toast.success(message)

      navigate("/login")
    } catch (err) {
      toast.error(err.message)
      setLoading(false)

    }
  }



  return (
    <section className='px-5 xl:px-0'>
      <div className='max-w-[1170px] mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2'>
          {/* img box */}
          <div className='hidden lg:block bg-blue-400 rounded-l-lg'>
            <figure className='rounded-l-lg'>
              <img src={signupImg} className='w-full rounded-lg' />
            </figure>
          </div>
          {/* form box */}
          <div className='rounded-l-lg lg:pl-16 py-10'>
            <h3 className='text-gray-900 text-[22px] leading-9 font-bold mb-10'>Create an <span className='text-blue-400'>Account</span></h3>

            <form onSubmit={submitHandler}>
              <div className='mb-5'>
                <input
                  type="text"
                  placeholder='Full Name'
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className='w-full pr-4  py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-gray-900 text-[16px] leading-7 text-black placeholder:text-gray-900 rounded-md cursor-pointer' />
              </div>
              <div className='mb-5'>
                <input
                  type="email"
                  placeholder='Email'
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className='w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-gray-900 text-[16px] leading-7 text-black placeholder:text-gray-900 rounded-md cursor-pointer' />
              </div>
              <div className='mb-5'>
                <input
                  type="password"
                  placeholder='password'
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className='w-full  py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-gray-900 text-[16px] leading-7 text-black placeholder:text-gray-900 rounded-md cursor-pointer' />
              </div>
              <div className='mb-5 flex items-center justify-between'>
                <label className='text-gray-700 font-bold text-[16px] leading-7'>
                  Are you:
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className='text-gray-700 font-bold text-[16px] leading-7 px-4 py-3 focus:outline-none '>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </label>

                <label className='text-gray-700 font-boldtext-[16px] leading-7'>
                  Gender:
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className='text-gray-700 font-bold text-[16px] leading-7 px-4 py-3 focus:outline-none '>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>
              <div className='mb-5 flex items-center gap-3'>
                {formData.photo && (
                  <figure className="w-[60px] h-[60px] rounded-full border-2 border-blue-400">
                    <img src={formData.photo} className="w-full rounded-full" />
                  </figure>
                )}

                {/* {selectedFile && <figure className='w-[60px] h-[60px] rounded-full border-2 border-solid border-blue-400 flex items-center justify-center'>
                  <img className='w-full rounded-full' src={previewURL} alt="" />
                </figure>} */}
                <div className='relative w-[130px] h-[50px]'>
                  <input
                    type="file"
                    name='photo'
                    onChange={handleFileInputChange}
                    id='customFile'
                    accept='.jpg,.png'
                    className='absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer'
                  />
                  <label
                    htmlFor="customFile"
                    className='absolute top-0 left-0 w-full h-full flex items-center px-3 py-1.5 text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-gray-700 font-semibold rounded-lg truncate cursor-pointer'
                  >
                    {formData.photo ? 'Change photo' : 'Upload photo'}
                  </label>
                </div>
              </div>
              <div className='mt-5'>
                <button disabled={loading && true} type='submit' className='w-full bg-blue-500 text-[18px] leading-[30px] rounded-lg px-4 py-3 cursor-pointer'>{loading ? <HashLoader size={35} color="#ffffff" /> : 'Sign Up'}</button>
              </div>
              <p className='mt-5 text-gray-700 text-center'>
                Already have an account?<Link to='/login' className='text-blue-300 font-semibold ml-2'>Login</Link>

              </p>


            </form>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Signup;
