import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ZonaDeCoberturaPage } from './zona-de-cobertura.page';

describe('ZonaDeCoberturaPage', () => {
  let component: ZonaDeCoberturaPage;
  let fixture: ComponentFixture<ZonaDeCoberturaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonaDeCoberturaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ZonaDeCoberturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
