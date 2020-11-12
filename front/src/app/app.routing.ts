import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'profile', component: EditUserComponent},
    {path: 'people', component: UsersComponent},
    {path: 'people/:page', component: UsersComponent},
    {path: 'timeline', component: TimelineComponent},
    {path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);