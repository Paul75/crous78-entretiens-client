import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienFormStep6Component } from './step6.component';
import { ActivatedRoute } from '@angular/router';

describe('EntretienFormStep6Component', () => {
  let component: EntretienFormStep6Component;
  let fixture: ComponentFixture<EntretienFormStep6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntretienFormStep6Component],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntretienFormStep6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
