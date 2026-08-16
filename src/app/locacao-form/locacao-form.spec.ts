import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocacaoFormComponent } from './locacao-form';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('LocacaoFormComponent', () => {
  let component: LocacaoFormComponent;
  let fixture: ComponentFixture<LocacaoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocacaoFormComponent],
      providers: [
        provideHttpClient(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocacaoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});