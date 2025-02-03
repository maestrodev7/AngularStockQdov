import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteClientDialogComponent } from './delete-client-dialog.component';

describe('DeleteClientDialogComponent', () => {
  let component: DeleteClientDialogComponent;
  let fixture: ComponentFixture<DeleteClientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteClientDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteClientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
