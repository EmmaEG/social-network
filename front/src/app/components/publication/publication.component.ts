import { Component, OnInit, EventEmitter, ViewChild, Output, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Publication } from '../../models/publication';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';


@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css'],
  providers: [UserService, PublicationService, UploadService]
})
export class PublicationComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private publicationService: PublicationService,
    private uploadService: UploadService
  ) {
    this.buildForm();
    this.title = 'Publicar';
    this.identity = this.userService.getIdentity(); // usuario logueado
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
  }

  get f() { return this.publicationForm.controls; }
  public publicationForm: FormGroup;
  public url: string;
  public status: string;
  public title: string;
  public publication: Publication;
  public identity;
  public token;
  public filesToUpload: Array<File>; // propiedad que llenammos con el evento fileChangeEvent

  @Output() sended = new EventEmitter();

  @ViewChild('fileInput')
  inptFile: ElementRef;

  ngOnInit(): void {
  }

  postPublication(event: Event): void {
    event.preventDefault();
    if (this.publicationForm.valid) {
      const value = this.publicationForm.value;
      this.publication = new Publication(value._id, value.text, value.file, value.created_at, this.identity._id);
      this.publicationService.addPublication(this.token, this.publication).subscribe( // me subs al servicio y capturo el result de la api
        response => {
          if (response.publication) {
            // subir archivo

          if (this.filesToUpload && this.filesToUpload.length) {
          this.uploadService.makeFileRequest(this.url + 'upload-image-pub/' + response.publication._id, [], this.filesToUpload, this.token, 'image')
                              .then((result: any) => {
                                this.publication.file = result.image;
                                this.status = 'success';
                                this.publicationForm.reset();
                                this.inptFile.nativeElement.value = '';
                              });
          } else {
            this.status = 'success';
            this.publicationForm.reset();
          }
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
      text: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]]
    });
  }

  fileChangeEvent(fileInput: any): void {
    this.filesToUpload = (fileInput.target.files as Array<File>);
  }

  sendPublication(event): void {
    this.sended.emit({ send: 'true' });
  }

}
