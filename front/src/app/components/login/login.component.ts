import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    providers: [UserService]
})
export class LoginComponent implements OnInit {
    public loginForm: FormGroup;
    public submitted = false;
    public title: string;
    public subtitle: string;
    public user: User;
    public status: string;
    public identity; // objeto del usuario identificado
    public token;


    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService
    ) {
        this.buildForm();
        this.title = 'Inicia sesión';
        this.subtitle = 'Entra a la comunidad de lectores';

    }

    ngOnInit(): void {
    }

    get f() { return this.loginForm.controls; }

    login(event: Event): void {
        event.preventDefault();
        if (this.loginForm.valid) {
            const value = this.loginForm.value;
            this.user = new User(value._id, value.name, value.surname, value.nick, value.email, value.password, value.role, value.image);
            this.userService.signUp(this.user).subscribe( // me subscribo al servicio y capturo el result de la api
                response => {
                    this.identity = response.user;

                    if (!this.identity || !this.identity._id) {
                        this.status = 'error';
                    } else {
                        this.router.navigate(['/']);
                        // mantener datos del usuario en el localStorage
                        // localStorage no puede guardar objetos de JS entonces JSON.stringify
                        localStorage.setItem('identity', JSON.stringify(this.identity));

                        // conseguimos el token del usuario
                        this.getToken();
                        this.loginForm.reset();
                    }
                },
                error => {
                    this.status = 'error';
                    console.log(error);
                });
        }
    }

    private buildForm() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{6,30}$/)]]
        });
    }

    getToken() {
        const value = this.loginForm.value;
        this.user = new User(value._id, value.name, value.surname, value.nick, value.email, value.password, value.role, value.image);
        this.userService.signUp(this.user, 'true').subscribe( // me subscribo al servicio y capturo el result de la api
            response => {
                this.token = response.token;
                if (this.token <= 0) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    // mantener el token del usuario en localStorage
                    localStorage.setItem('token', this.token);
                    // conseguimos los contadores del usuario (los follows en usarios y publicaciones)
                    this.getCounters();
                }
            },
            error => {
                this.status = 'error';
                console.log(error);
            });

    }

    getCounters() {
        this.userService.getCounters().subscribe(
            response => {
                localStorage.setItem('stats', JSON.stringify(response));
            },
            error => {
                console.log(error);
            }
        )
    }
}
