import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sended',
  templateUrl: './sended.component.html',
  styleUrls: ['./sended.component.css']
})
export class SendedComponent implements OnInit {
  public title: string;

  constructor() {
    this.title = 'Mensajes enviados';
   }

  ngOnInit(): void {
  }

}
