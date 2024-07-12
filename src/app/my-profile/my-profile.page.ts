import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {
  email = localStorage.getItem('email');
  nombre = localStorage.getItem('display');
  photoURL = localStorage.getItem('photoUrl');
  tel = '+52 00 0000 0000'

  constructor() { }

  ngOnInit() {
  }

}
