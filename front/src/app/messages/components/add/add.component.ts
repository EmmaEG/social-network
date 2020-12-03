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
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [FollowService, MessageService]
})
export class AddComponent implements OnInit {
  public messageForm: FormGroup;
  public title: string;
  public message: Message;
  public identity;
  public token;
  public url;
  public status: string;
  public follows;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private followService: FollowService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
  ) {
    this.title = 'Enviar mensajes';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.buildForm(); // me lo llevo a la última línea para que identity tenga algo
   }

  ngOnInit(): void {
  }

  private buildForm(): void {
    this.messageForm = this.formBuilder.group({
      _id: [''],
      text: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      viewed: [''],
      created_at: [''],
      emmiter: [this.identity._id],
      receiver: ['']
    });
  }

}
