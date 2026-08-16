import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocacaoForm } from './locacao-form';

describe('LocacaoForm', () => {
  let component: LocacaoForm;
  let fixture: ComponentFixture<LocacaoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocacaoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LocacaoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
