import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public submitted = false;
  public title: string;
  public user: User;


  constructor( // configuramos las propiedades del router para tenerlas definidas en la clas
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.buildForm();
    this.title = 'Registrate';
  }

  ngOnInit(): void {
  }

  get f() { return this.registerForm.controls; }

  register(event: Event): void {
    event.preventDefault();
    if (this.registerForm.valid) {
      const value = this.registerForm.value;
      this.user = new User(value._id, value.name, value.surname, value.nick, value.email, value.password, value.role, value.image);
      this.userService.register(this.user).subscribe(
        response => {
          if (response.user && response.user._id) {
            console.log(response.user);
          }
        },
        error => {
          console.log(error);
        }
      );
      /*
      .then(() => {
        this.router.navigate(['/auth/login']);
      });*/
    }
  }

  private buildForm(): void {
    this.registerForm = this.formBuilder.group({
      _id: [''],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      nick: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['ROLE_USER'],
      image: ['']
    });
  }

}

