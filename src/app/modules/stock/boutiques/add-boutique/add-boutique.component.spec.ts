import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBoutiqueComponent } from './add-boutique.component';

describe('AddBoutiqueComponent', () => {
  let component: AddBoutiqueComponent;
  let fixture: ComponentFixture<AddBoutiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBoutiqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBoutiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
