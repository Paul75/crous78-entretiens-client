import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DialogFichePosteComponent } from './dialog-fiche-poste.component';

describe('DialogFichePosteComponent', () => {
  let component: DialogFichePosteComponent;
  let fixture: ComponentFixture<DialogFichePosteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogFichePosteComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogFichePosteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
