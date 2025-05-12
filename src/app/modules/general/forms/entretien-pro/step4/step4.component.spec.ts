import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienProStep4Component } from './step4.component';
import { ActivatedRoute } from '@angular/router';

describe('EntretienProStep4Component', () => {
  let component: EntretienProStep4Component;
  let fixture: ComponentFixture<EntretienProStep4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntretienProStep4Component],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntretienProStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
