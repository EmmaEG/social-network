import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  providers: [UserService, UploadService]
})
export class EditUserComponent implements OnInit {
  public editUserForm: FormGroup;
  public id: string;
  public title: string;
  public user: User;
  public identity;
  public token;
  public status;
  public url: string;



  constructor( // creamos propiedades e inyectamos servicios
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private uploadService: UploadService,
    private activatedRoute: ActivatedRoute // el ActivatedRoute es para capturar el id
  ) {
    this.buildForm();
    this.title = 'Editar mis datos';
    // user va tener el valor de identity (el usuario identificado), el valor lo tengo en localStorage, tengo el objeto completo
    this.user = this.userService.getIdentity();
    this.identity = this.user;
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.editUserForm.patchValue(this.user); // para rellenar el form con los datos que traiga
  }


  get f() { return this.editUserForm.controls; }

  editUser(event: Event): void {
    event.preventDefault();
    if (this.editUserForm.valid) {
      const value = this.editUserForm.value;
      this.user = new User(this.user._id, value.name, value.surname, value.nick, value.email, this.user.password, this.user.role, value.image);
      this.userService.updateUser(this.user).subscribe(
        response => {
          if (response.user) {
            localStorage.setItem('identity', JSON.stringify(this.user));
            this.identity = this.user;
            this.uploadService.makeFileRequest(`${this.url}upload-image-user/` + this.user._id, [], this.filesToUpload, this.token, 'image')
              .then((result: any) => {
                this.user.image = result.user.image;
                localStorage.setItem('identity', JSON.stringify(this.user));
              });
            this.status = 'success';
            this.editUserForm.reset();
          } else {
            this.status = 'error'; 
          }
        },
        error => {
          this.status = 'error500';
          console.log(error);
        }
      );
    }
  }

  private buildForm(): void {
    this.editUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      nick: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      image: ['']
    });
  }

  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
    // guardamos en esta propiedad el resultado de los ficheros que capturamos en el input
    //fileInput es el parametro que llega por el metodo, target tiene dentro los ficheros y files.
  }

}
