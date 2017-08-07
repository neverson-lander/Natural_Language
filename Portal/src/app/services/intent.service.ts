import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ClassifyService } from './classify.service';

@Injectable()
export class IntentService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });
  

  constructor(private http: Http, private classifyServie: ClassifyService) {}

  getIntents(): Observable<any> {
    return this.http.get('/api/intents').map(res => res.json());
  }

  getIntentByClassify(idClassify): Observable<any> {
    return this.http.get(`/api/intents/classify/${idClassify}`).map(res => res.json());
  }

  countIntents(): Observable<any> {
    return this.http.get('/api/intents/count').map(res => res.json());
  }

  addIntent(intent): Observable<any> {
    return this.http.post('/api/intent', JSON.stringify(intent), this.options);
  }

  getIntent(intent): Observable<any> {
    return this.http.get(`/api/intent/${intent._id}`).map(res => res.json());
  }

  editIntent(intent): Observable<any> {
    return this.http.put(`/api/intent/${intent._id}`, JSON.stringify(intent), this.options);
  }

  deleteIntent(intent): Observable<any> {
    return this.http.delete(`/api/intent/${intent._id}`, this.options);
  }

}
