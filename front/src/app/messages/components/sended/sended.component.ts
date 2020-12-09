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
    this.getMessages();
  }

  getMessages(): void {
    this.messageService.getEmitMessages(this.token, 1).subscribe(
      response => {
        if (response.messages) {
          this.messages = response.messages;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
