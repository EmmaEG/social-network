import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UserService]
})
export class HomeComponent implements OnInit {
    public title: string;
    public identity;

  constructor(
    private userService: UserService,
  ) {
    this.title = 'La mejor comunidad de lectores <br> en español';
  }

  ngOnInit(): void {
    this.identity = this.userService.getIdentity();

  }

  ngDoCheck() {
    this.identity = this.userService.getIdentity();
  }

}
