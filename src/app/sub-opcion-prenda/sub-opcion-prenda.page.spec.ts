import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubOpcionPrendaPage } from './sub-opcion-prenda.page';

describe('SubOpcionPrendaPage', () => {
  let component: SubOpcionPrendaPage;
  let fixture: ComponentFixture<SubOpcionPrendaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubOpcionPrendaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubOpcionPrendaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
