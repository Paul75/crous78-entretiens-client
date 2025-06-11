import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienProStep6Component } from './step6.component';
import { ActivatedRoute } from '@angular/router';

describe('EntretienProStep5Component', () => {
  let component: EntretienProStep6Component;
  let fixture: ComponentFixture<EntretienProStep6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntretienProStep6Component],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntretienProStep6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
