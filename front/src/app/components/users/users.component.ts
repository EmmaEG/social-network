import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService]
})
export class UsersComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public page;
  public nextPage;
  public prePage;
  public total;
  public pages;
  public users: User[];
  public status: string;

  constructor( //inyectamos los servicios
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
  ) {
    this.title = 'Personas';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
   }

  ngOnInit(): void {
    console.log('cargado user component');
    this.actualPage();
  }

  actualPage() {
    this.route.params.subscribe(params => {
      let page = +params['page']; // con + lo convertimos a un entero
      this.page = page;

      if (!page) {
        page = 1;
      } else {
        this.nextPage = page + 1;
        this.prePage = page - 1;

        if (this.prePage <= 0) {
          this.prePage = 1;
        }
      }
      //devolvemos el listado de usuarios
      this.getUsers(page);
    });
  }

  getUsers(page) {
    this.userService.getUsers(page).subscribe(
      response => {
        if (!response.users) {
          this.status = 'error';
        } else {
          this.total = response.total;
          this.users = response.users;
          this.pages = response.pages;
          if (page > this.pages) {
            this.router.navigate(['/people',1]);
          }
        }
      },
      error => {
        console.log(error);
        this.status = 'error'
      }
    );
  }

}
