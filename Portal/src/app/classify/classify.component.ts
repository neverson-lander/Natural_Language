import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { ClassifyService } from '../services/classify.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-classifies',
  templateUrl: './classify.component.html',
  styleUrls: ['./classify.component.scss']
})
export class ClassifyComponent implements OnInit {
  [x: string]: any;

  classify = {};
  classifies = [];
  desIntents: any = {};
  //desIntents = [];
  isLoading:boolean = true;
  isEditing:boolean = false;
  isTraining:boolean = false;
  dtNow: Date = new Date();
  modalClassify = {};
  train = [];
  token: String = "";
  
  addClassifyForm: FormGroup;
  classifyName = new FormControl('', Validators.required);
  desClassify = new FormControl('', Validators.required);
  dtInsert = new FormControl('', Validators.nullValidator);
  dtUpdate = new FormControl('', Validators.nullValidator);
  idUser = new FormControl('', Validators.nullValidator);

  getIntentForm: FormGroup;
  desSentence = new FormControl('', Validators.required);
  classifyToken = new FormControl('', Validators.nullValidator)

  teste = {};
  teste1 = "";
  
  
  constructor(private classifyService: ClassifyService,
              private formBuilder: FormBuilder,
              private http: Http,
              public toast: ToastComponent,
              public auth: AuthService,
              private router: Router) {
                console.log(this.dtNow);
               }

  ngOnInit() {
    this.getClassifyByUser();
    this.addClassifyForm = this.formBuilder.group({
      classifyName: this.classifyName,
      desClassify: this.desClassify,
      dtInsert: this.dtInsert,
      dtUpdate: this.dtUpdate,
      idUser: this.idUser
    });

    this.getIntentForm = this.formBuilder.group({
      desSentence: this.desSentence,
      classifyToken: this.classifyToken
    })
  }

  getClassifyByUser() {
    this.classifyService.getClassifyByUser(this.auth.currentUser._id).subscribe(
      data => this.classifies = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getClassifies() {
    this.classifyService.getClassifies().subscribe(
      data => this.classifies = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addClassify() {
    this.addClassifyForm.value.dtInsert = this.dtNow;
    this.addClassifyForm.value.idUser = this.auth.currentUser._id;
    this.classifyService.addClassify(this.addClassifyForm.value).subscribe(
      res => {
        const newclassify = res.json();
        this.classifies.push(newclassify);
        this.addClassifyForm.reset();
        this.toast.setMessage('item adicionado com sucesso.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(classify) {
    this.isEditing = true;
    this.classify = classify;
  }

  cancelEditing() {
    this.isEditing = false;
    this.classify = {};
    this.toast.setMessage('edição cancelada.', 'warning');
    // reload the classifies to reset the editing
    this.getClassifyByUser();
  }

  editClassify(classify) {
    classify.dtUpdate = new Date();
    this.addClassifyForm.value.idUser = this.auth.currentUser._id;
    this.classifyService.editClassify(classify).subscribe(
      res => {
        this.isEditing = false;
        this.classify = classify;
        this.toast.setMessage('item editado com sucesso.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteClassify(classify) {
    if (window.confirm('Você tem certeza que deseja excluir o item?')) {
      this.classifyService.deleteClassify(classify).subscribe(
        res => {
          const pos = this.classifies.map(elem => elem._id).indexOf(classify._id);
          this.classifies.splice(pos, 1);
          this.toast.setMessage('item excluido com sucesso.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  goToIntents(classify){
    this.classifyService.setCurrentClassify(classify);
    this.router.navigate(['/intents'])
  }

  enableModal(classify){
    this.modalClassify = {classifyName : classify.classifyName,
                          classifyToken : classify.classifyToken};
  }

  enableModalTrained(classify){
    this.getIntentForm.reset();
    this.desIntents = [];
    this.token = classify.classifyToken;
    this.modalClassify = {classifyName : classify.classifyName,
                          classifyToken : classify.classifyToken};
  }

  enterSubmit(event) {
    if(event.keyCode == 13){
      console.log(event, event.keyCode, event.keyIdentifier);
      console.log(this.addClassifyForm.value);
      return false;
    }
   
  } 

  getTrainByToken(classifyToken){
    console.log(classifyToken);   
    this.isTraining = true; 
    this.classifyService.getTrainByToken(classifyToken).subscribe(
      data => this.train = data,
      error => console.log(error),
      () => this.isTraining = false
    );
  }

  getIntent(){
    this.getIntentForm.value.classifyToken = this.token;
    this.classifyService.getClassifyBySentence(this.getIntentForm.value).subscribe(
      res => {
        this.desIntents = res;
        console.log(this.desIntents);
      },
      error => console.log(error)
    );
  }

}
