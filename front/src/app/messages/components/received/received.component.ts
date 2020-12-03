import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.css']
})
export class ReceivedComponent implements OnInit {
  public title: string;

  constructor() {
    this.title = 'Mensajes recibidos';
   }

  ngOnInit(): void {
  }

}
