import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddressTitlePage } from './address-title.page';

describe('AddressTitlePage', () => {
  let component: AddressTitlePage;
  let fixture: ComponentFixture<AddressTitlePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressTitlePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddressTitlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
