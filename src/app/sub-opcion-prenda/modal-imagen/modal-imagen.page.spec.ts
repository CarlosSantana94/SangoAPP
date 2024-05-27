import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalImagenPage } from './modal-imagen.page';

describe('ModalImagenPage', () => {
  let component: ModalImagenPage;
  let fixture: ComponentFixture<ModalImagenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalImagenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalImagenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
