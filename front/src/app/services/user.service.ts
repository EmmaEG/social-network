import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { User } from '../models/user';

@Injectable()
export class UserService {
    public url: string;

    constructor(public http: HttpClient) {
        this.url = GLOBAL.url;
    }

    register(user: User): Observable<any> {
        const params = JSON.stringify(user);
        const header = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.post(`${this.url}/register`, params, {headers: header});
    }

}

// los srvicios son una clase con métodos que interactúan con una servicio rest, peticiones ajax
// injecyable nos permote definir los servicios y luego inyectarlos en otra clase
// HttpHaders es para nviar cabeceras en cada una de las peticiones ajax
// obsrvable es para poder recoger las respuestas de la api

