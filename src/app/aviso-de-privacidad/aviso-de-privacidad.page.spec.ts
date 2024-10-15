import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvisoDePrivacidadPage } from './aviso-de-privacidad.page';

describe('AvisoDePrivacidadPage', () => {
  let component: AvisoDePrivacidadPage;
  let fixture: ComponentFixture<AvisoDePrivacidadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AvisoDePrivacidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
