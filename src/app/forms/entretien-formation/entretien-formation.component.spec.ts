import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { EntretienFormationComponent } from './entretien-formation.component';

describe('EntretienFormationComponent', () => {
  let component: EntretienFormationComponent;
  let fixture: ComponentFixture<EntretienFormationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntretienFormationComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntretienFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
