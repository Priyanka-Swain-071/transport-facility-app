export interface Ride {
  id: string;
  employeeId: string;
  vehicleType: 'Bike' | 'Car';
  vehicleNo: string;
  vacantSeats: number;
  originalSeats: number;
  time: string;
  pickupPoint: string;
  destination: string;
  bookedBy: string[];
  createdAt: Date;
}

export interface RideBooking {
  rideId: string;
  employeeId: string;
  bookedAt: Date;
}