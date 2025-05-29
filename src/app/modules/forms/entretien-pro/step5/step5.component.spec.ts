import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienProStep5Component } from './step5.component';
import { ActivatedRoute } from '@angular/router';

describe('EntretienProStep5Component', () => {
  let component: EntretienProStep5Component;
  let fixture: ComponentFixture<EntretienProStep5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntretienProStep5Component],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntretienProStep5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
