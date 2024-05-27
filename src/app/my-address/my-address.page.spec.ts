import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyAddressPage } from './my-address.page';

describe('MyAddressPage', () => {
  let component: MyAddressPage;
  let fixture: ComponentFixture<MyAddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAddressPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
