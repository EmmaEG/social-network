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
  public followed;
  public following;
  public followUserOver;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private followService: FollowService

  ) {
    this.title = 'Perfil';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.followed = false;
    this.following = false;
  }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void { // obtenemos los paramatros de la url
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.getUser(id);
      this.getCounters(id);
    });
  }

  getUser(id): void {
    this.userService.getUser(id).subscribe(
      response => {
        if (response.user) {
          this.user = response.user;
          if (response.following && response.following._id) {
            this.following = true;
          }
          if (response.followed && response.followed._id) {
            this.followed = true;
          }
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

  getCounters(id): void {
    this.userService.getCounters(id).subscribe(
      response => {
        this.stats = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  followUser(followed): void { // id, userid del user identificado y el usuario que voy a seguir
    let follow = new Follow('', this.identity._id, followed);

    this.followService.addFollow(this.token, follow).subscribe(
      response => {
        this.following = true;
      },
      error => {
        console.log(error);
      }
    );
  }

  UnFollowUser(followed): void {
    this.followService.deleteFollow(this.token, followed).subscribe(
      response => {
        this.following = false;
      },
      error => {
        console.log(error);
      }
    );
  }

  mouseEnter(user_id): void {
    this.followUserOver = user_id;
  }

  mouseLeave(): void {
    this.followUserOver = 0;
  }


}
