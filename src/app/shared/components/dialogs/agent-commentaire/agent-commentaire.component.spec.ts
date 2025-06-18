import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AgentCommentaireComponent } from './agent-commentaire.component';

describe('AgentCommentaireComponent', () => {
  let component: AgentCommentaireComponent;
  let fixture: ComponentFixture<AgentCommentaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentCommentaireComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentCommentaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
