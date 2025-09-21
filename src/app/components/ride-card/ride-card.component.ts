import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Ride } from '../../interfaces/ride';

@Component({
  selector: 'app-ride-card',
  templateUrl: './ride-card.component.html',
  styleUrls: ['./ride-card.component.css']
})
export class RideCardComponent {
  @Input() ride!: Ride;
  @Input() showBookButton = true;
  @Output() bookRide = new EventEmitter<string>();

  onBookRide(): void {
    this.bookRide.emit(this.ride.id);
  }
}