import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Publication } from '../../models/publication';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';


@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css'],
  providers: [UserService, PublicationService]
})
export class PublicationComponent implements OnInit {
  public publicationForm: FormGroup;
  public status: string;
  public title: string;
  public publication: Publication;
  public identity;
  public token;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private publicationService: PublicationService
  ) { 
    this.buildForm();
    this.title = 'Publicar';
    this.identity = this.userService.getIdentity(); //usuario logueado
    this.token = this.userService.getToken();
  }

  ngOnInit(): void {
  }
  
  get f() { return this.publicationForm.controls; }

  postPublication(event: Event): void {
    event.preventDefault();
    if (this.publicationForm.valid) {
      const value = this.publicationForm.value;
      this.publication = new Publication(value._id, value.text, value.file, value.created_at, this.identity._id);
      this.publicationService.addPublication(this.token, this.publication).subscribe( // me subscribo al servicio y capturo el result de la api
        response => {
            if (response.publication) {
                this.status = 'success';
                this.publicationForm.reset();
            } else {
              this.status = 'error';
            }
        },
        error => {
            this.status = 'error';
            console.log(error);
        });
}
  }
    
  private buildForm(): void {
    this.publicationForm = this.formBuilder.group({
      text: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

}
