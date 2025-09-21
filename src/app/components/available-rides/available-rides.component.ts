import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RideService } from '../../services/ride.service';
import { NotificationService } from '../../services/notification.service';
import { Ride } from '../../interfaces/ride';

@Component({
  selector: 'app-available-rides',
  templateUrl: './available-rides.component.html',
  styleUrls: ['./available-rides.component.css']
})
export class AvailableRidesComponent implements OnInit, OnDestroy {
  availableRides: Ride[] = [];
  currentTime: string = '';
  vehicleTypeFilter: string = '';
  employeeId: string = '';
  private ridesSubscription: Subscription = new Subscription();

  constructor(
    private rideService: RideService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.setCurrentTime();
    this.loadAvailableRides();
    
    // Subscribe to rides changes
    this.ridesSubscription = this.rideService.getRides().subscribe(() => {
      this.updateAvailableRides();
    });
  }

  ngOnDestroy(): void {
    this.ridesSubscription.unsubscribe();
  }

  private setCurrentTime(): void {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}`;
  }

  private loadAvailableRides(): void {
    this.updateAvailableRides();
  }

  updateAvailableRides(): void {
    this.availableRides = this.rideService.getAvailableRides(
      this.currentTime, 
      this.vehicleTypeFilter || undefined
    );
  }

  onBookRide(rideId: string): void {
    if (!this.employeeId.trim()) {
      this.notificationService.showError('Please enter your Employee ID first!');
      return;
    }

    const result = this.rideService.bookRide(rideId, this.employeeId.trim());
    
    if (result.success) {
      this.notificationService.showSuccess(result.message);
      this.updateAvailableRides();
    } else {
      this.notificationService.showError(result.message);
    }
  }
}