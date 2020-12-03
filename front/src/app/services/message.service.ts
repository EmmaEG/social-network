import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Message } from '../models/message';

@Injectable()
export class MessageService {
    public url: string;

    constructor(private http: HttpClient) {
        this.url = GLOBAL.url;
    }

    addMessage(token, message): Observable<any> {
        const params = JSON.stringify(message); // convertimos el objeto JS a string
        const header = new HttpHeaders().set('Content-Type', 'application/json') // la forma en la que envío los datos
                                        .set('Authorization', token); // obtengo el token del user identificado

        return this.http.post(`${this.url}message`, params, { headers: header });
    }

    getMyMessages(token, page = 1): Observable<any> {
        const header = new HttpHeaders().set('Content-Type', 'application/json') // la forma en la que envío los datos
                                        .set('Authorization', token); // obtengo el token del user identificado

        return this.http.get(`${this.url}my-messages/` + page, { headers: header });
    }

    getEmitMessages(token, page = 1): Observable<any> {
        const header = new HttpHeaders().set('Content-Type', 'application/json') // la forma en la que envío los datos
                                        .set('Authorization', token); // obtengo el token del user identificado

        return this.http.get(`${this.url}messages/` + page, { headers: header });
    }

}
