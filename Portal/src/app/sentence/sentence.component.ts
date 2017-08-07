import { IntentService } from './../services/intent.service';
import { AuthService } from './../services/auth.service';
import { ToastComponent } from './../shared/toast/toast.component';
import { Http } from '@angular/http';
import { SentenceService } from './../services/sentence.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sentence',
  templateUrl: './sentence.component.html',
  styleUrls: ['./sentence.component.css']
})
export class SentenceComponent implements OnInit {
  sentence = {};
  sentences = [];
  isLoading = true;
  isEditing = false;
  dtNow: Date = new Date();
  @Input() intentId: string;

  addSentenceForm: FormGroup;
  desSentence = new FormControl('', Validators.required);
  idIntent = new FormControl('', Validators.nullValidator);
  dtInsert = new FormControl('', Validators.nullValidator);
  dtUpdate = new FormControl('', Validators.nullValidator);
  idUser = new FormControl('', Validators.nullValidator);
  
    constructor(private sentenceService: SentenceService,
              private formBuilder: FormBuilder,
              private http: Http,
              public toast: ToastComponent,
              public auth: AuthService,
              private intentService: IntentService) {
                console.log(this.dtNow);
               }

  ngOnInit() {
    this.getSentenceByIntent(this.intentId);
    this.addSentenceForm = this.formBuilder.group({
      desSentence: this.desSentence,
      idIntent: this.idIntent,
      dtInsert: this.dtInsert,
      dtUpdate: this.dtUpdate,
      idUser: this.idUser
    });
  }

  getSentences() {
    this.sentenceService.getSenteces().subscribe(
      data => this.sentences = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getSentenceByIntent(idIntent) {
    console.log(idIntent);
    this.sentenceService.getSentenceByIntent(idIntent).subscribe(
      data => this.sentences = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addSentence(idIntent) {
    this.addSentenceForm.value.dtInsert = this.dtNow;
    this.addSentenceForm.value.idUser = this.auth.currentUser._id;
    this.addSentenceForm.value.idIntent = idIntent;
    this.sentenceService.addSentence(this.addSentenceForm.value).subscribe(
      res => {
        const newSentence = res.json();
        this.sentences.push(newSentence);
        this.addSentenceForm.reset();
        this.toast.setMessage('item adicionado com sucesso.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(sentence) {
    this.isEditing = true;
    this.sentence = sentence;
  }

  cancelEditing() {
    this.isEditing = false;
    this.sentence = {};
    this.toast.setMessage('edição cancelada.', 'warning');
    // reload the sentences to reset the editing
    //this.getSentences();
  }

  editSentence(sentence) {
    sentence.dtUpdate = new Date();
    this.addSentenceForm.value.idUser = this.auth.currentUser._id;
    this.sentenceService.editSentence(sentence).subscribe(
      res => {
        this.isEditing = false;
        this.sentence = sentence;
        this.toast.setMessage('item editado com sucesso.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteSentence(sentence) {
    if (window.confirm('Você tem certeza que deseja excluir o item?')) {
      this.sentenceService.deleteSentence(sentence).subscribe(
        res => {
          const pos = this.sentences.map(elem => elem._id).indexOf(sentence._id);
          this.sentences.splice(pos, 1);
          this.toast.setMessage('item excluido com sucesso.', 'success');
        },
        error => console.log(error)
      );
    }
  }

}
