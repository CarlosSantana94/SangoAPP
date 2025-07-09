import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAdressPage } from './edit-adress.page';

describe('EditAdressPage', () => {
  let component: EditAdressPage;
  let fixture: ComponentFixture<EditAdressPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAdressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
