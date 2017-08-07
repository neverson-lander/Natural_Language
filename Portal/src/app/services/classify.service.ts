import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ClassifyService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });
  currentClassify = { _id: '', classifyToken: '' };
  classifyIn: boolean = false;

  constructor(private http: Http) { }

  getClassifies(): Observable<any> {
    return this.http.get('/api/classifies').map(res => res.json());
  }

  getClassifyByUser(idUser): Observable<any> {
    return this.http.get(`/api/classifies/user/${idUser}`).map(res => res.json());
  }

  countClassifies(): Observable<any> {
    return this.http.get('/api/classifies/count').map(res => res.json());
  }

  addClassify(classify): Observable<any> {
    return this.http.post('/api/classify', JSON.stringify(classify), this.options);
  }

  getClassify(classify): Observable<any> {
    return this.http.get(`/api/classify/${classify._id}`).map(res => res.json());
  }

  editClassify(classify): Observable<any> {
    return this.http.put(`/api/classify/${classify._id}`, JSON.stringify(classify), this.options);
  }

  deleteClassify(classify): Observable<any> {
    return this.http.delete(`/api/classify/${classify._id}`, this.options);
  }

  setCurrentClassify(classify){
    this.currentClassify._id = classify._id;
    this.currentClassify.classifyToken = classify.classifyToken;
    this.classifyIn = true;
  }

  getTrainByToken(classifyToken): Observable<any> {
    return this.http.get(`/api/classifies/train/${classifyToken}`).map(res => res.json());
  }

  getClassifyBySentence(classify): Observable<any> {
    return this.http.post('/api/classify/classify', JSON.stringify(classify), this.options).map(res => res.json());
  } 

}
