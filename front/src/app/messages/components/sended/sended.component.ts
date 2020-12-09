import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';
import { Follow } from '../../../models/follow';
import { FollowService } from '../../../services/follow.service';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';
import { MessagesModule } from '../../messages.module';


@Component({
  selector: 'app-sended',
  templateUrl: './sended.component.html',
  styleUrls: ['./sended.component.css'],
  providers: [FollowService, MessageService]
})
export class SendedComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public url;
  public status: string;
  public follows;
  public messages: Message[];
  public page;
  public pages;
  public total;
  public nextPage;
  public prePage;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private followService: FollowService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {
    this.title = 'Mensajes enviados';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
   }

  ngOnInit(): void {
    this.actualPage();
  }

  actualPage(): void {
    this.route.params.subscribe(params => {

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
      // devolvemos el listado de mensajes
      this.getMessages(this.token, this.page);
    });
  }

  getMessages(token, page): void {
    this.messageService.getEmitMessages(token, page).subscribe(
      response => {
        if (response.messages) {
          this.messages = response.messages;          
          this.total = response.total;
          this.pages = response.pages;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
