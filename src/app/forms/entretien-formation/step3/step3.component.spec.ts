import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienProStep3Component } from './step3.component';
import { ActivatedRoute } from '@angular/router';

describe('EntretienProStep3Component', () => {
  let component: EntretienProStep3Component;
  let fixture: ComponentFixture<EntretienProStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntretienProStep3Component],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntretienProStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
