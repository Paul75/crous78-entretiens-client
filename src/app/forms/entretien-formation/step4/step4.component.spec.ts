import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienFormStep4Component } from './step4.component';
import { ActivatedRoute } from '@angular/router';

describe('EntretienFormStep4Component', () => {
  let component: EntretienFormStep4Component;
  let fixture: ComponentFixture<EntretienFormStep4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntretienFormStep4Component],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntretienFormStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
