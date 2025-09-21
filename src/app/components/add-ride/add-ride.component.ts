import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RideService } from '../../services/ride.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-add-ride',
  templateUrl: './add-ride.component.html',
  styleUrls: ['./add-ride.component.css']
})
export class AddRideComponent implements OnInit {
  rideForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private rideService: RideService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.rideForm = this.fb.group({
      employeeId: ['', [Validators.required]],
      vehicleType: ['', [Validators.required]],
      vehicleNo: ['', [Validators.required]],
      vacantSeats: ['', [Validators.required, Validators.min(1)]],
      time: ['', [Validators.required]],
      pickupPoint: ['', [Validators.required]],
      destination: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  isFieldInvalid(fieldName: string): boolean {
    const field = this.rideForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.rideForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const success = this.rideService.addRide(this.rideForm.value);
      
      if (success) {
        this.notificationService.showSuccess('Ride added successfully!');
        this.rideForm.reset();
        setTimeout(() => {
          this.router.navigate(['/available-rides']);
        }, 1000);
      } else {
        this.notificationService.showError('You already have a ride for today!');
      }
      
      this.isSubmitting = false;
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.rideForm.controls).forEach(key => {
      const control = this.rideForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}