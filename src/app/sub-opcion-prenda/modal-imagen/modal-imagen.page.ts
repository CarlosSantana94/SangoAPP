import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-modal-imagen',
    templateUrl: './modal-imagen.page.html',
    styleUrls: ['./modal-imagen.page.scss'],
})
export class ModalImagenPage implements OnInit {
    @Input() url: string;

    constructor(public modalController: ModalController,
                private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
    }

    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss({
            dismissed: true
        });
    }
    getSantizeUrl(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + url);
    }

}
