import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienProStep7Component } from './step7.component';
import { ActivatedRoute } from '@angular/router';

describe('EntretienProStep5Component', () => {
  let component: EntretienProStep7Component;
  let fixture: ComponentFixture<EntretienProStep7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntretienProStep7Component],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntretienProStep7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
