import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { User } from '../models/user';

@Injectable()
export class UserService {
    public url: string;
    public identity;
    public token;
    public stats;

    constructor(public http: HttpClient) {
        this.url = GLOBAL.url;
    }

    register(user: User): Observable<any> {
        const params = JSON.stringify(user);
        const header = new HttpHeaders().set('Content-Type', 'application/json');
        // Content-Type de tipo application/json

        return this.http.post(`${this.url}/register`, params, {headers: header});
    }

    signUp(user, gettoken = null): Observable<any> {
        if (gettoken !== null) {
            user.gettoken = gettoken;
        }
        const params = JSON.stringify(user);
        const header = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.post(`${this.url}/login`, params, {headers: header});
    }

    getIdentity() {
        const identity = JSON.parse(localStorage.getItem('identity')); // convierto identity a un Obj JS

        if (identity !== 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }

    getToken() {
        const token = localStorage.getItem('token');

        if (token !== 'undefined') {
            this.token = token;
        } else  {
            this.token = null;
        }
        return this.token;
    }

    // para almacenar en el localStorage y evitar peticiones todo el tiempo
    getStats() {
        const stats = JSON.parse(localStorage.getItem('stats'));

        if (stats !== 'undefined') {
            this.stats = stats;
        } else {
            this.stats = null;
        }

        return this.stats;
    }

    // el usrerId por defecto vendrá a null
    getCounters(userId = null) {
        const header = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken()); // obtengo el token del user identificado
        if (userId != null) {
            return this.http.get(`${this.url}counters/` + userId, {headers: header});
        } else {
            return this.http.get(`${this.url}counters`, {headers: header});
        }
    }

}

// los srvicios son una clase con métodos que interactúan con una servicio rest, peticiones ajax
// injecyable nos permote definir los servicios y luego inyectarlos en otra clase
// HttpHaders es para nviar cabeceras en cada una de las peticiones ajax
// obsrvable es para poder recoger las respuestas de la api

