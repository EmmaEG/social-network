import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable()
export class PublicationService {
    public url: string;

    constructor(public http: HttpClient) {
        this.url = GLOBAL.url;
    }

    addPublication(token, publication): Observable<any> { // que recibimos? el token y a publicacion
        const params = JSON.stringify(publication); // convertimos el objeto JS a string
        const header = new HttpHeaders().set('Content-Type', 'application/json') // la forma en la que envío los datos
                                        .set('Authorization', token); // obtengo el token del user identificado

        return this.http.post(`${this.url}publication`, params, { headers: header });
    }

    getPublications(token, page = 1): Observable<any> {
        const header = new HttpHeaders().set('Content-Type', 'application/json') // la forma en la que envío los datos
                                        .set('Authorization', token); // obtengo el token del user identificado

        return this.http.get(`${this.url}publications/` + page, { headers: header });
    }

    getPublicationsUser(token, user_id, page = 1): Observable<any> {
        const header = new HttpHeaders().set('Content-Type', 'application/json') // la forma en la que envío los datos
                                        .set('Authorization', token); // obtengo el token del user identificado

        return this.http.get(`${this.url}publications-user/` + user_id + `/` + page, { headers: header });
    }

    deletePublication(token, id): Observable<any> {
        const header = new HttpHeaders().set('Content-Type', 'application/json') // la forma en la que envío los datos
                                        .set('Authorization', token); // obtengo el token del user identificado

        return this.http.delete(`${this.url}publication/` + id, { headers: header });
    }


}