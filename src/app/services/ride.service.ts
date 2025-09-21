import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Ride, RideBooking } from '../interfaces/ride';

@Injectable({
  providedIn: 'root'
})
export class RideService {
  private ridesSubject = new BehaviorSubject<Ride[]>([]);
  public rides$ = this.ridesSubject.asObservable();

  private bookingsSubject = new BehaviorSubject<RideBooking[]>([]);
  public bookings$ = this.bookingsSubject.asObservable();

  constructor() {
    // Load data from localStorage on service initialization
    this.loadRidesFromStorage();
    this.loadBookingsFromStorage();
  }

  addRide(ride: Omit<Ride, 'id' | 'bookedBy' | 'createdAt' | 'originalSeats'>): boolean {
    const currentRides = this.ridesSubject.value;
    
    // Check if employee already has a ride
    const existingRide = currentRides.find(r => r.employeeId === ride.employeeId);
    if (existingRide) {
      return false; // Employee already has a ride
    }

    const newRide: Ride = {
      ...ride,
      id: this.generateId(),
      bookedBy: [],
      originalSeats: ride.vacantSeats,
      createdAt: new Date()
    };

    const updatedRides = [...currentRides, newRide];
    this.ridesSubject.next(updatedRides);
    this.saveRidesToStorage(updatedRides);
    return true;
  }

  getRides(): Observable<Ride[]> {
    return this.rides$;
  }

  getAvailableRides(currentTime: string, vehicleTypeFilter?: string): Ride[] {
    const currentRides = this.ridesSubject.value;
    const currentMinutes = this.timeToMinutes(currentTime);
    
    return currentRides.filter(ride => {
      const rideMinutes = this.timeToMinutes(ride.time);
      const timeDiff = Math.abs(currentMinutes - rideMinutes);
      const withinTimeBuffer = timeDiff <= 60; // 60 minutes buffer
      const hasVacantSeats = ride.vacantSeats > 0;
      const matchesVehicleType = !vehicleTypeFilter || ride.vehicleType === vehicleTypeFilter;
      
      return withinTimeBuffer && hasVacantSeats && matchesVehicleType;
    });
  }

  bookRide(rideId: string, employeeId: string): { success: boolean; message: string } {
    const currentRides = this.ridesSubject.value;
    const currentBookings = this.bookingsSubject.value;
    
    const rideIndex = currentRides.findIndex(r => r.id === rideId);
    if (rideIndex === -1) {
      return { success: false, message: 'Ride not found' };
    }

    const ride = currentRides[rideIndex];
    
    // Check if employee is the ride creator
    if (ride.employeeId === employeeId) {
      return { success: false, message: 'Cannot book your own ride' };
    }

    // Check if employee already booked this ride
    if (ride.bookedBy.includes(employeeId)) {
      return { success: false, message: 'Already booked this ride' };
    }

    // Check if employee has already booked any ride today
    const hasExistingBooking = currentBookings.some(booking => 
      booking.employeeId === employeeId && 
      this.isSameDay(booking.bookedAt, new Date())
    );
    
    if (hasExistingBooking) {
      return { success: false, message: 'You can only book one ride per day' };
    }

    // Check vacant seats
    if (ride.vacantSeats <= 0) {
      return { success: false, message: 'No vacant seats available' };
    }

    // Book the ride
    const updatedRide = {
      ...ride,
      vacantSeats: ride.vacantSeats - 1,
      bookedBy: [...ride.bookedBy, employeeId]
    };

    const updatedRides = [...currentRides];
    updatedRides[rideIndex] = updatedRide;
    
    const newBooking: RideBooking = {
      rideId: rideId,
      employeeId: employeeId,
      bookedAt: new Date()
    };
    
    const updatedBookings = [...currentBookings, newBooking];
    
    this.ridesSubject.next(updatedRides);
    this.bookingsSubject.next(updatedBookings);
    
    this.saveRidesToStorage(updatedRides);
    this.saveBookingsToStorage(updatedBookings);
    
    return { success: true, message: 'Ride booked successfully' };
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  private saveRidesToStorage(rides: Ride[]): void {
    localStorage.setItem('transport_rides', JSON.stringify(rides));
  }

  private loadRidesFromStorage(): void {
    const stored = localStorage.getItem('transport_rides');
    if (stored) {
      const rides = JSON.parse(stored).map((ride: any) => ({
        ...ride,
        createdAt: new Date(ride.createdAt)
      }));
      this.ridesSubject.next(rides);
    }
  }

  private saveBookingsToStorage(bookings: RideBooking[]): void {
    localStorage.setItem('transport_bookings', JSON.stringify(bookings));
  }

  private loadBookingsFromStorage(): void {
    const stored = localStorage.getItem('transport_bookings');
    if (stored) {
      const bookings = JSON.parse(stored).map((booking: any) => ({
        ...booking,
        bookedAt: new Date(booking.bookedAt)
      }));
      this.bookingsSubject.next(bookings);
    }
  }
}