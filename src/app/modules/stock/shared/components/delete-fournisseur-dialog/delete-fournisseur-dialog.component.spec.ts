import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFournisseurDialogComponent } from './delete-fournisseur-dialog.component';

describe('DeleteFournisseurDialogComponent', () => {
  let component: DeleteFournisseurDialogComponent;
  let fixture: ComponentFixture<DeleteFournisseurDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteFournisseurDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteFournisseurDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
