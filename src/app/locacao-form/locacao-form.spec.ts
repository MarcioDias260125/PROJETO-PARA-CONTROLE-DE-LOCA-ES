import { ComponentFixture, TestBed } from '@angular/core/testing';

// 1. Corrigimos a importação para LocacaoFormComponent
import { LocacaoFormComponent } from './locacao-form'; 

describe('LocacaoFormComponent', () => {
  let component: LocacaoFormComponent;
  let fixture: ComponentFixture<LocacaoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 2. Trocamos aqui também
      imports: [LocacaoFormComponent], 
    }).compileComponents();

    // 3. E aqui na criação do componente
    fixture = TestBed.createComponent(LocacaoFormComponent); 
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});