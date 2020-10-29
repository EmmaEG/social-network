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
  public subtitle: string;
  public user: User;
  public status: string;


  constructor( // configuramos las propiedades del router para tenerlas definidas en la clas
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.buildForm();
    this.title = 'Regístrate';
    this.subtitle = 'Únete a la comunidad de lectores';
  }

  ngOnInit(): void {
  }

  get f() { return this.registerForm.controls; }

  register(event: Event): void {
    event.preventDefault();
    if (this.registerForm.valid) {
      const value = this.registerForm.value;
      this.user = new User(value._id, value.name, value.surname, value.nick, value.email, value.password, value.role, value.image);
      this.userService.register(this.user).subscribe( // me subscribo al servicio y capturo el result de la api
        response => {
          if (response.user && response.user._id) {
              this.router.navigate(['/login']);
              this.registerForm.reset();
            } else {
              this.status = 'error';
            }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  private buildForm(): void {
    this.registerForm = this.formBuilder.group({
      _id: [''],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      nick: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('(^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,30}$)')]],
      role: ['ROLE_USER'],
      image: ['']
    });
  }


}

