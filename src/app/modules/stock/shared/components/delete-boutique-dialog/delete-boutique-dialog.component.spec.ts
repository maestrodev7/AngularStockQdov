import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBoutiqueDialogComponent } from './delete-boutique-dialog.component';

describe('DeleteBoutiqueDialogComponent', () => {
  let component: DeleteBoutiqueDialogComponent;
  let fixture: ComponentFixture<DeleteBoutiqueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteBoutiqueDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteBoutiqueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
