import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienFormStep7Component } from './step7.component';
import { ActivatedRoute } from '@angular/router';

describe('EntretienFormStep7Component', () => {
  let component: EntretienFormStep7Component;
  let fixture: ComponentFixture<EntretienFormStep7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntretienFormStep7Component],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntretienFormStep7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
