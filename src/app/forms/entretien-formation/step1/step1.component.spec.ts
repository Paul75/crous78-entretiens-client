import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienFormStep1Component } from './step1.component';
import { ActivatedRoute } from '@angular/router';

describe('EntretienFormStep1Component', () => {
  let component: EntretienFormStep1Component;
  let fixture: ComponentFixture<EntretienFormStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntretienFormStep1Component],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntretienFormStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
