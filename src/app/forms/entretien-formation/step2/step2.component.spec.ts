import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienFormStep2Component } from './step2.component';
import { ActivatedRoute } from '@angular/router';

describe('EntretienFormStep2Component', () => {
  let component: EntretienFormStep2Component;
  let fixture: ComponentFixture<EntretienFormStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntretienFormStep2Component],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntretienFormStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
