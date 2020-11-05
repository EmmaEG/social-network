import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Follow } from '../models/follow';

@Injectable()
export class FollowService {
    public url: string;

    constructor(public http: HttpClient) {
        this.url = GLOBAL.url;
    }

    addFollow(token, follow): Observable<any> {
        const params = JSON.stringify(follow);
        const header = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this.http.post(`${this.url}follow`, params, { headers: header });

    }

    deleteFollow(token, id): Observable<any> {
        const header = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this.http.delete(`${this.url}follow/`+id, { headers: header });

    } 
}