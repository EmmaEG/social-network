import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowedComponent } from './components/followed/followed.component';

import { UserGuard } from './services/user.guard';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'profile', component: EditUserComponent, canActivate: [UserGuard]},
    {path: 'people', component: UsersComponent, canActivate: [UserGuard]},
    {path: 'people/:page', component: UsersComponent, canActivate: [UserGuard]},
    {path: 'timeline', component: TimelineComponent, canActivate: [UserGuard]},
    {path: 'user-profile/:id', component: ProfileComponent, canActivate: [UserGuard]},
    {path: 'following/:id/:page', component: FollowingComponent, canActivate: [UserGuard]},
    {path: 'followers/:id/:page', component: FollowedComponent, canActivate: [UserGuard]},
    {path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
