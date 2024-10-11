import {Component, OnInit} from '@angular/core';
import {RESTService} from "../rest.service";

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

  isEditing = false;

  originalData = {
    nombre: this.nombre,
    email: this.email,
    tel: this.tel
  };

  constructor(private rest: RESTService) {
  }

  ngOnInit() {
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    // Save the updated values to the backend
    console.log('Saving changes:', {
      nombre: this.nombre,
      email: this.email,
      tel: this.tel
    });
    this.originalData = {nombre: this.nombre, email: this.email, tel: this.tel};
    this.isEditing = false;

    this.rest.getUsuario(localStorage.getItem('uid')).subscribe(u => {
      localStorage.setItem("puedePagarCC", u.puedePagarConCC);
      let usuario = {
        id: localStorage.getItem('uid'),
        nombre: this.nombre,
        email: this.email,
        img: localStorage.getItem('photoUrl'),
        puedePagarConCC: false,
        tel: this.tel
      };


      usuario.puedePagarConCC = u.puedePagarConCC;

      this.rest.postUsuario(usuario).subscribe(data => {
        this.setUserInfo(this.email, this.nombre, localStorage.getItem('photoUrl'), localStorage.getItem('uid'), this.tel);
      });
    });

  }

  private setUserInfo(email: string, displayName: string, photoUrl: string, uid: string, tel) {
    localStorage.setItem('email', email);
    localStorage.setItem('display', displayName);
    localStorage.setItem('photoUrl', photoUrl);
    localStorage.setItem('uid', uid);
    localStorage.setItem('tel', tel)
  }

  cancelChanges() {
    // Revert to original data if editing is canceled
    this.nombre = this.originalData.nombre;
    this.email = this.originalData.email;
    this.tel = this.originalData.tel;
    this.isEditing = false;
  }

  editPhoto() {
    // Implement photo update functionality
    console.log('Edit photo clicked');
  }

}
