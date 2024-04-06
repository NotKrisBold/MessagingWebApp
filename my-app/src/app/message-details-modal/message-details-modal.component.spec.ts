import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDetailsModalComponent } from './message-details-modal.component';

describe('MessageDetailsModalComponent', () => {
  let component: MessageDetailsModalComponent;
  let fixture: ComponentFixture<MessageDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageDetailsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
