import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { IntentService } from '../services/intent.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { ClassifyService } from './../services/classify.service';

@Component({
  selector: 'app-intents',
  templateUrl: './intent.component.html',
  styleUrls: ['./intent.component.scss']
})
export class IntentsComponent implements OnInit {

  intent = {};
  intents = [];
  train = [];
  isLoading = true;
  isTraining = false;
  isEditing = false;
  dtNow: Date = new Date();

  addIntentForm: FormGroup;
  intentName = new FormControl('', Validators.required);
  idClassify = new FormControl('', Validators.nullValidator);
  dtInsert = new FormControl('', Validators.nullValidator);
  dtUpdate = new FormControl('', Validators.nullValidator);
  idUser = new FormControl('', Validators.nullValidator);
  
  constructor(private intentservice: IntentService,
              private formBuilder: FormBuilder,
              private http: Http,
              public toast: ToastComponent,
              public auth: AuthService,
              private classifyService: ClassifyService) {
                console.log(this.dtNow);
               }

  ngOnInit() {
    this.getIntentByClassify();
    this.addIntentForm = this.formBuilder.group({
      intentName: this.intentName,
      idClassify: this.idClassify,
      dtInsert: this.dtInsert,
      dtUpdate: this.dtUpdate,
      idUser: this.idUser
    });
  }

  getIntents() {
    this.intentservice.getIntents().subscribe(
      data => this.intents = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getIntentByClassify() {
    console.log(this.classifyService.currentClassify._id);
    this.intentservice.getIntentByClassify(this.classifyService.currentClassify._id).subscribe(
      data => this.intents = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addIntent() {
    this.addIntentForm.value.dtInsert = this.dtNow;
    this.addIntentForm.value.idUser = this.auth.currentUser._id;
    this.addIntentForm.value.idClassify = this.classifyService.currentClassify._id;
    this.intentservice.addIntent(this.addIntentForm.value).subscribe(
      res => {
        const newintent = res.json();
        this.intents.push(newintent);
        this.addIntentForm.reset();
        this.toast.setMessage('item adicionado com sucesso.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(intent) {
    this.isEditing = true;
    this.intent = intent;
  }

  cancelEditing() {
    this.isEditing = false;
    this.intent = {};
    this.toast.setMessage('edição cancelada.', 'warning');
    // reload the intents to reset the editing
    this.getIntentByClassify();
  }

  editIntent(intent) {
    intent.dtUpdate = new Date();
    this.addIntentForm.value.idUser = this.auth.currentUser._id;
    this.intentservice.editIntent(intent).subscribe(
      res => {
        this.isEditing = false;
        this.intent = intent;
        this.toast.setMessage('item editado com sucesso.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteIntent(intent) {
    if (window.confirm('Você tem certeza que deseja excluir o item?')) {
      this.intentservice.deleteIntent(intent).subscribe(
        res => {
          const pos = this.intents.map(elem => elem._id).indexOf(intent._id);
          this.intents.splice(pos, 1);
          this.toast.setMessage('item excluido com sucesso.', 'success');
        },
        error => console.log(error)
      );
    }
  }
}
