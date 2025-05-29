import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienProStep2Component } from './step2.component';
import { ActivatedRoute } from '@angular/router';

describe('EntretienProStep2Component', () => {
  let component: EntretienProStep2Component;
  let fixture: ComponentFixture<EntretienProStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntretienProStep2Component],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntretienProStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
