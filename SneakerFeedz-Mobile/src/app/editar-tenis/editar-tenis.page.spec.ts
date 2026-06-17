import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarTenisPage } from './editar-tenis.page';

describe('EditarTenisPage', () => {
  let component: EditarTenisPage;
  let fixture: ComponentFixture<EditarTenisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarTenisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
