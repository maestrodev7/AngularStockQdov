import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProduitDialogComponent } from './delete-produit-dialog.component';

describe('DeleteProduitDialogComponent', () => {
  let component: DeleteProduitDialogComponent;
  let fixture: ComponentFixture<DeleteProduitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteProduitDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteProduitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
