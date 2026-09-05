import mongoose from "mongoose";
import Booking from "./BookingSchema.js";

// Alias model: ensure any code referencing the old model name "Appointment"
// resolves to the existing Booking schema/collection. This is safe and reversible.
const Appointment = mongoose.model("Appointment", Booking.schema, "bookings");

export default Appointment;
