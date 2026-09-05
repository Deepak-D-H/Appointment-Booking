import useFetchData from "../../hooks/useFetchData"
import {BASE_URL} from "../../config"
import DoctorCard from "./../../components/Doctors/DoctorCard"
import Loading from "../../components/Loader/Loading"
import Error from "../../components/Error/Error"

const MyBookings = () => {
  const { data: appointments, loading, error } = useFetchData(
    `${BASE_URL}/api/v1/users/appointments/my-appointments`
  );







  return (
    <div>
      {loading && !error && <Loading/> }

      {error && !loading && < Error errMessage={error}/>}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {(
          // Deduplicate doctors by _id in case the user booked the same doctor multiple times
          (appointments || []).filter((d, i, arr) => arr.findIndex(t => t._id === d._id) === i)
          .map((doctor) => (
            <DoctorCard doctor={doctor} key={doctor._id + "-doctor"} />
          ))
        )}
        </div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <h2 className="mt-5 text-center leading-7 text-[20px] font-semibold text-blue-400">You did not book any doctor yet!</h2>
      )}
      
    </div>
  );
}

export default MyBookings;
