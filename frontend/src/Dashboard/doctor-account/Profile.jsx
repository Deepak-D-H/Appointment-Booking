import { useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai'
import uploadImageCloudinary from './../../utils/uploadCloudinary'
import { BASE_URL } from "./../../config"
import { toast } from 'react-toastify'

const Profile = ({ doctorData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bio: '',
    gender: '',
    specialization: '',
    ticketPrice: 0,
    qualifications: [
      // { startingDate: '', endingDate: '', degree: '', university: '' }
    ],
    experiences: [
      // { startingDate: '', endingDate: '', position: '', hospital: '' }
    ],
    timeSlots: [
      // { day: '', startingTime: '', endingTime: '' }
    ],
    about: '',
    photo: null

  })

  useEffect(() => {
    setFormData({
      name: doctorData?.name,
      email: doctorData?.email,
      
      phone: doctorData?.phone,
      bio: doctorData?.bio,
      gender: doctorData?.gender,
      specialization: doctorData?.specialization,
      ticketPrice: doctorData?.ticketPrice,
      qualifications:doctorData?.qualifications,
      experiences:doctorData?.experiences,
      timeSlots:doctorData?.timeSlots,
      about:doctorData?.about,
      photo:doctorData?.photo

    })

  }, [doctorData])




  const handleInputChanges = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })

  }
  const handleFileInputChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    try {
      const data = await uploadImageCloudinary(file)
      const photoUrl = data?.secure_url || data?.url
      if (photoUrl) {
        setFormData({ ...formData, photo: photoUrl })
        toast.success('Photo uploaded successfully')
      }
    } catch {
      toast.error('Failed to upload photo')
    }
  }

  const handleReusableInputChangeFunc = (key, index, event) => {
    const { name, value } = event.target
    setFormData(prevFormData => {
      const updateItems = [...prevFormData[key]]

      updateItems[index][name] = value
      return {
        ...prevFormData,
        [key]: updateItems,
      }
    })

  }

  //reusable function for delteing item
  const deleteItem = (key, index) => {
    setFormData(prevFormData => ({ ...prevFormData, [key]: prevFormData[key].filter((_, i) => i !== index) }))
  }



  const updateProfileHandler = async (event) => {
    event.preventDefault()
    try {
      const authToken = localStorage.getItem('token')
      const res = await fetch(`${BASE_URL}/api/v1/doctors/${doctorData._id}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      })
      const result = await res.json()
      if (!res.ok) {
        throw Error(result.message)
      }
      toast.success(result.message)

    } catch (err) {
      toast.error(err.message)

    }
  }

  //reusable fuction for adding item
  const addItem = (key, item) => {
    setFormData(prevFormData => ({ ...prevFormData, [key]: [...prevFormData[key], item] }))
  }

  const addQualification = (event) => {
    event.preventDefault()
    addItem('qualifications',
      { startingDate: '', endingDate: '', degree: 'PHD', university: 'AIIMS Mandya' }
    )
  }

  const handleQualificationChange = (event, index) => {
    handleReusableInputChangeFunc("qualifications", index, event)
  }
  const deleteQualification = (e, index) => {
    e.preventDefault()
    deleteItem("qualifications", index)
  }



  const addExperience = (event) => {
    event.preventDefault()
    addItem('experiences',
      { startingDate: '', endingDate: '', position: 'Senior Surgon', hospital: 'Mandya' }
    )
  }

  const handleExperienceChange = (event, index) => {
    handleReusableInputChangeFunc("experiences", index, event)
  }
  const deleteExperience = (e, index) => {
    e.preventDefault()
    deleteItem("experiences", index)
  }

  const addTimeSlot = (event) => {
    event.preventDefault()
    addItem('timeSlots',
      { day: 'Sunday', startingTime: '10:30', endingTime: '04:30' }
    )
  }

  const handleTimeSlotChange = (event, index) => {
    handleReusableInputChangeFunc("timeSlots", index, event)
  }
  const deleteTimeSlot = (e, index) => {
    e.preventDefault()
    deleteItem("timeSlots", index)
  }
  return (
    <div>
      <h2 className='text-black font-bold text-[24px] leading-9 mb-10'>Profile Information</h2>
      <form action="">
        <div className='mb-5'>
          <p className='form__label'> Name*
          </p>
          <input type="text" name='name' value={formData.name} onChange={handleInputChanges} placeholder='Full Name' className='form__input' />

        </div>

        <div className='mb-5'>
          <p className='form__label'> Email*
          </p>
          <input type="text" name='email' value={formData.email} onChange={handleInputChanges} placeholder='Email' className='form__input'
            readOnly
            aria-readonly
            disabled={true}

          />

        </div>

        <div className='mb-5'>
          <p className='form__label'> Phone*
          </p>
          <input type="number" name='phone' value={formData.phone} onChange={handleInputChanges} placeholder='phone number' className='form__input'
          />

        </div>
        <div className='mb-5'>
          <p className='form__label'> Bio*
          </p>
          <input type="text" name='bio' value={formData.bio} onChange={handleInputChanges} placeholder='Bio' className='form__input'
            maxLength={100}
          />
        </div>
        <div className='mb-5'>
          <div className='grid grid-cols-3 gap-5 mb-[30px] '>
            <div>
              <p className='form__label'> Gender*</p>
              <select name="gender" value={formData.gender} onChange={handleInputChanges} className='form__input py-3.5'>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <p className='form__label'>Specialization*</p>
              <select name="specialization" value={formData.specialization} onChange={handleInputChanges} className='form__input py-3.5'>
                <option value="">Select</option>
                <option value="surgon">Surgon</option>
                <option value="neurologist">Neurologist</option>
                <option value="dermatologist">Dermatologist</option>
              </select>
            </div>

            <div>
              <p className='form__label'>Ticket Price*</p>
              <input
                type="number"
                placeholder='1000'
                name='ticketPrice'
                value={formData.ticketPrice}
                className='form__input'
                onChange={handleInputChanges}
              />
            </div>

          </div>
        </div>

        <div className='mb-5'>
          <p className='form__label'>Qualifications*</p>
          {formData.qualifications?.map((item, index) => (
            <div key={index}>
              <div>
                <div className='grid grid-cols-2 gap-5'>
                  <div>
                    <p className='form__label'>Starting Date*</p>
                    <input
                      type="date"
                      name='startingDate'
                      value={item.startingDate}
                      className='form__input'
                      onChange={e => handleQualificationChange(e, index)}
                    />
                  </div>
                  <div>
                    <p className='form__label'>Ending Date*</p>
                    <input
                      type="date"
                      name='endingDate'
                      value={item.endingDate}
                      className='form__input'
                      onChange={e => handleQualificationChange(e, index)}
                    />
                  </div>

                </div>



                <div className='grid grid-cols-2 gap-5 mt-5'>
                  <div>
                    <p className='form__label'>Degree</p>
                    <input
                      type="text"
                      name='degree'
                      value={item.degree}
                      className='form__input'
                      onChange={e => handleQualificationChange(e, index)}
                    />
                  </div>
                  <div>
                    <p className='form__label'>University</p>
                    <input
                      type="text"
                      name='university'
                      value={item.university}
                      className='form__input'
                      onChange={e => handleQualificationChange(e, index)}
                    />
                  </div>

                </div>
                <button
                  onClick={(e) => deleteQualification(e, index)}
                  className='bg-red-600 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer'><AiOutlineDelete /></button>
              </div>

            </div>
          ))}
          <button onClick={addQualification} className='bg-[#000000] py-2 px-5 rounded text-white h-fit cursor-pointer'>Add Qualification</button>
        </div>



        <div className='mb-5'>
          <p className='form__label'>Experiences*</p>
          {formData.experiences?.map((item, index) => (
            <div key={index}>
              <div>
                <div className='grid grid-cols-2 gap-5'>
                  <div>
                    <p className='form__label'>Starting Date*</p>
                    <input
                      type="date"
                      name='startingDate'
                      value={item.startingDate}
                      className='form__input'
                      onChange={e => handleExperienceChange(e, index)}
                    />
                  </div>
                  <div>
                    <p className='form__label'>Ending Date*</p>
                    <input
                      type="date"
                      name='endingDate'
                      value={item.endingDate}
                      className='form__input'
                      onChange={e => handleExperienceChange(e, index)}
                    />
                  </div>

                </div>



                <div className='grid grid-cols-2 gap-5 mt-5'>
                  <div>
                    <p className='form__label'>Position*</p>
                    <input
                      type="text"
                      name='position'
                      value={item.position}
                      className='form__input'
                      onChange={e => handleExperienceChange(e, index)}
                    />
                  </div>
                  <div>
                    <p className='form__label'>Hospital*</p>
                    <input
                      type="text"
                      name='hospital'
                      value={item.hospital}
                      className='form__input'
                      onChange={e => handleExperienceChange(e, index)}
                    />
                  </div>

                </div>
                <button
                  onClick={(e) => deleteExperience(e, index)}

                  className='bg-red-600 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer'><AiOutlineDelete /></button>
              </div>

            </div>
          ))}
          <button
            onClick={addExperience}
            className='bg-[#000000] py-2 px-5 rounded text-white h-fit cursor-pointer'>Add Experiences</button>
        </div>

        <div className='mb-5'>
          <p className='form__label'>Time Slots*</p>
          {formData.timeSlots?.map((item, index) => (
            <div key={index}>
              <div>
                <div className='grid grid-cols-2 md:grid-cols-4 mb-[30px] gap-5'>
                  <div>
                    <p className='form__label'>Starting Date*</p>
                    <select
                      name="day"
                      value={item.day}
                      className='form__input py-3.5'
                      onChange={e => handleTimeSlotChange(e, index)}
                    >
                      <option value="">Select</option>
                      <option value="sunday">Sunday</option>
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                      <option value="saturday">Saturday</option>
                    </select>
                  </div>
                  <div>
                    <p className='form__label'>Starting time*</p>
                    <input
                      type="time"
                      name='startingTime'
                      value={item.startingTime}
                      className='form__input'
                      onChange={e => handleTimeSlotChange(e, index)}
                    />
                  </div>
                  <div>
                    <p className='form__label'>Ending time*</p>
                    <input
                      type="time"
                      name='endingTime'
                      value={item.endingTime}
                      className='form__input'
                      onChange={e => handleTimeSlotChange(e, index)}
                    />
                  </div>
                  <div className='flex items-center'>
                    <button
                      onClick={(e) => deleteTimeSlot(e, index)}

                      className='bg-red-600 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer'><AiOutlineDelete /></button>
                  </div>
                </div>
              </div>

            </div>
          ))}
          <button
            onClick={addTimeSlot}
            className='bg-[#000000] py-2 px-5 rounded text-white h-fit cursor-pointer'>Add TimeSlot</button>
        </div>
        <div className="mb-5">
          <p className='form__lagel'>About*</p>
          <textarea
            name="about"
            rows={5}
            value={formData.about}
            placeholder='Write about you'
            onChange={handleInputChanges}
            className='form__input'
          >

          </textarea>
        </div>

        <div className='mb-5 flex items-center gap-3'>
          {formData.photo && <figure className='w-[60px] h-[60px] rounded-full border-2 border-solid border-blue-400 flex items-center justify-center'>
            <img className='w-full h-full rounded-full ' src={formData.photo} alt="" />
          </figure>}
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
            >Upload photo
            </label>
          </div>
        </div>
        <div className='mt-7'>
          <button type='submit' onClick={updateProfileHandler} className='bg-blue-500 text-white text-lg rounded-xl py-2 px-4 w-full btn'>Update Profile</button>
        </div>

      </form>
    </div>
  );
}

export default Profile;
