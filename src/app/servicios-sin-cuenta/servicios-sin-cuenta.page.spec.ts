import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiciosSinCuentaPage } from './servicios-sin-cuenta.page';

describe('ServiciosSinCuentaPage', () => {
  let component: ServiciosSinCuentaPage;
  let fixture: ComponentFixture<ServiciosSinCuentaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosSinCuentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
