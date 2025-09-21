import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRideComponent } from './components/add-ride/add-ride.component';
import { AvailableRidesComponent } from './components/available-rides/available-rides.component';

const routes: Routes = [
  { path: '', redirectTo: '/available-rides', pathMatch: 'full' },
  { path: 'add-ride', component: AddRideComponent },
  { path: 'available-rides', component: AvailableRidesComponent },
  { path: '**', redirectTo: '/available-rides' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }