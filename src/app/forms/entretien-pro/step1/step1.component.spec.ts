import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienProStep1Component } from './step1.component';
import { ActivatedRoute } from '@angular/router';

describe('EntretienProStep1Component', () => {
  let component: EntretienProStep1Component;
  let fixture: ComponentFixture<EntretienProStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntretienProStep1Component],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntretienProStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
