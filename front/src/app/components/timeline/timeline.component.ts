import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService]
})
export class TimelineComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private publicationService: PublicationService
  ) {
    this.title = 'Publicaciones';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.page = 1;
  }
  public title: string;
  public identity;
  public token;
  public url: string;
  public status: string;
  public page;
  public total;
  public pages;
  public itemsPerPage;
  public publications: Publication[];
  public noMore = false;

  ngOnInit(): void {
    this.getPublications(this.page);
  }

  getPublications(page, adding = false): void {
    this.publicationService.getPublications(this.token, page).subscribe(
      response => {
        if (response.publications) {
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.items_per_page;

          // paginamos de manera infinita
          if (!adding) { // si adding es false
            this.publications = response.publications; // array de publicaciones
          } else {
            const arrayA = this.publications;
            const arrayB = response.publications;
            this.publications = arrayA.concat(arrayB); // agrego las pub al array A
            $('html, body').animate({ scrollTop: $('body').prop('scrollHeight') }, 800);
          }

          if (page > this.pages) {
            // this.router.navigate(['/home']);
          }
        } else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
      }
    );
  }

  viewMore(): void {
    if (this.publications.length === this.total) {
      this.noMore = true;
    } else {
      this.page += 1;
    }
    this.getPublications(this.page, true); // el true es para el adding
  }

  refresh(event): void {
    $('html, body').animate({ scrollTop: $('body').prop('scrollTop') }, 800);
    setTimeout(() => {
      this.getPublications(1); // pagina 1
    }, 1000);
  }

}
