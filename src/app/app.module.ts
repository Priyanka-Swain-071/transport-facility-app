import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddRideComponent } from './components/add-ride/add-ride.component';
import { AvailableRidesComponent } from './components/available-rides/available-rides.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RideCardComponent } from './components/ride-card/ride-card.component';

@NgModule({
  declarations: [
    AppComponent,
    AddRideComponent,
    AvailableRidesComponent,
    NavbarComponent,
    RideCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }