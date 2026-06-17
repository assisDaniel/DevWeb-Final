import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletarTenisPage } from './deletar-tenis.page';

describe('DeletarTenisPage', () => {
  let component: DeletarTenisPage;
  let fixture: ComponentFixture<DeletarTenisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletarTenisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
