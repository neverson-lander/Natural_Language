import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { IntentService } from './intent.service';

@Injectable()
export class SentenceService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });
  

  constructor(private http: Http, private intentServie: IntentService) {}

  getSenteces(): Observable<any> {
    return this.http.get('/api/sentences').map(res => res.json());
  }

  getSentenceByIntent(idIntent): Observable<any> {
    return this.http.get(`/api/sentences/intent/${idIntent}`).map(res => res.json());
  }

  countSentences(): Observable<any> {
    return this.http.get('/api/sentences/count').map(res => res.json());
  }

  addSentence(sentence): Observable<any> {
    return this.http.post('/api/sentence', JSON.stringify(sentence), this.options);
  }

  getSentence(sentence): Observable<any> {
    return this.http.get(`/api/sentence/${sentence._id}`).map(res => res.json());
  }

  editSentence(sentence): Observable<any> {
    return this.http.put(`/api/sentence/${sentence._id}`, JSON.stringify(sentence), this.options);
  }

  deleteSentence(sentence): Observable<any> {
    return this.http.delete(`/api/sentence/${sentence._id}`, this.options);
  }

}
