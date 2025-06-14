import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { ListeEntretiensComponent } from './liste-entretiens.component';

describe('ListeEntretiensComponent', () => {
  let component: ListeEntretiensComponent;
  let fixture: ComponentFixture<ListeEntretiensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeEntretiensComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListeEntretiensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
