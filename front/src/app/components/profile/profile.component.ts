import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService]
})
export class ProfileComponent implements OnInit {
  public title: string;
  public user: User; // cargaremos lo que nos develva el servicio (el Api)
  public status: string;
  public identity;
  public token;
  public stats;
  public url;
  public follow;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private FollowService: FollowService

  ) {
    this.title = 'Perfil';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
   }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage() { // obtenemos los paramatros de la url
    this.route.params.subscribe( params => {
      let id = params['id'];
      this.getUser(id);
      this.getCounters(id);
    });
  }

  getUser(id) {
    this.userService.getUser(id).subscribe(
      response => {
        if (response.user) {
          this.user = response.user;
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.error();
        this.router.navigate(['/user-profile', this.identity._id]);
      }      
    );
  }

  getCounters(id) {
    this.userService.getCounters(id).subscribe(
      response => {
        this.stats = response;
      },
      error => {
        console.log(error);
      }
    );
  }

}
