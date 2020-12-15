import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService]
})
export class SidebarComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public stats;
  public url;
  public status;

  constructor(
    private userService: UserService,
  ) { 
    this.title = 'Mis datos';
    this.identity = this.userService.getIdentity(); //usuario logueado
    this.token = this.userService.getToken();
    this.stats = this.userService.getStats();
    this.url = GLOBAL.url;
  }

  
  ngOnInit(): void {
  }

}
