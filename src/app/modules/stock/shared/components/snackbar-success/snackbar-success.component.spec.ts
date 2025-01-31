import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarSuccessComponent } from './snackbar-success.component';

describe('SnackbarSuccessComponent', () => {
  let component: SnackbarSuccessComponent;
  let fixture: ComponentFixture<SnackbarSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackbarSuccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SnackbarSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
