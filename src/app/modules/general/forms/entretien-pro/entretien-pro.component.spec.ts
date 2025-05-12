import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienProComponent } from './entretien-pro.component';
import { ActivatedRoute } from '@angular/router';

describe('EntretienProComponent', () => {
  let component: EntretienProComponent;
  let fixture: ComponentFixture<EntretienProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntretienProComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntretienProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
