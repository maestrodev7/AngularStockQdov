import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMagazinDialogComponent } from './delete-magazin-dialog.component';

describe('DeleteMagazinDialogComponent', () => {
  let component: DeleteMagazinDialogComponent;
  let fixture: ComponentFixture<DeleteMagazinDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMagazinDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteMagazinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
