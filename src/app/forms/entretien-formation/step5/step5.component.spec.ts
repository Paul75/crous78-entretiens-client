import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienFormStep5Component } from './step5.component';
import { ActivatedRoute } from '@angular/router';

describe('EntretienFormStep5Component', () => {
  let component: EntretienFormStep5Component;
  let fixture: ComponentFixture<EntretienFormStep5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntretienFormStep5Component],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntretienFormStep5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
