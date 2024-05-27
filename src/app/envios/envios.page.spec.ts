import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnviosPage } from './envios.page';

describe('EnviosPage', () => {
  let component: EnviosPage;
  let fixture: ComponentFixture<EnviosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnviosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnviosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
