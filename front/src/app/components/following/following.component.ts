import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css'],
  providers: [UserService, FollowService]
})
export class FollowingComponent implements OnInit {

  public title: string;
  public url: string;
  public identity;
  public token;
  public page;
  public nextPage;
  public prePage;
  public total;
  public pages;
  public users: User[];
  public follows;
  public following;
  public status: string;
  public userPageId;
  public user: User;
  public followUserOver;


  constructor( // inyectamos los servicios
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private followService: FollowService
  ) {
    this.title = 'Usuarios seguidos por';
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();

  }

  ngOnInit(): void {
    this.actualPage();
  }

  actualPage(): void {
    this.route.params.subscribe(params => {
      let user_id = params['id'];
      this.userPageId = user_id;

      let page = +params['page']; // con + lo convertimos a un entero
      this.page = page;

      if (!params['page']) {
        page = 1;
      }

      if (!page) {
        page = 1;
      } else {
        this.nextPage = page + 1;
        this.prePage = page - 1;

        if (this.prePage <= 0) {
          this.prePage = 1;
        }
      }
      // devolvemos el listado de usuarios
      this.getUser(user_id, page);
    });
  }

  getFollows(user_id, page): void {
    this.followService.getFollowing(this.token, user_id, page).subscribe(
      response => {
        if (!response.follows) {
          this.status = 'error';
        } else {
          console.log(response);
          this.total = response.total;
          this.following = response.follows;
          this.pages = response.pages;
          this.follows = response.users_following;

          if (page > this.pages) {
            this.router.navigate(['/people', 1]);
          }
        }
      },
      error => {
        console.log(error);
        this.status = 'error';
      }
    );
  }

  getUser(user_id, page): void {
    this.userService.getUser(user_id).subscribe(
      response => {
        if (response.user) {
          this.user = response.user;
          this.getFollows(user_id, page);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error => {
        console.log(error);
        this.status = 'error';
      }
    );
  }

  mouseEnter(user_id) {
    this.followUserOver = user_id;
  }

  mouseLeave(user_id) {
    this.followUserOver = 0;
  }

  followUser(followed): void {
    var follow = new Follow('', this.identity._id, followed);

    this.followService.addFollow(this.token, follow).subscribe(
      response => {
        if (!response.follow) {
          this.status = 'error';
        } else {
          this.status = 'success';
          this.follows.push(followed);
        }
      },
      error => {
        console.log(error);
        this.status = 'error';
      }
    );
  }

  unfollowUser(followed): void {
    this.followService.deleteFollow(this.token, followed).subscribe(
      response => {
        let search = this.follows.indexOf(followed);
        if (search !== -1) {
          this.follows.splice(search, 1);
        }
      },
      error => {
        console.log(error);
        this.status = 'error';
      }
    );
  }

}

