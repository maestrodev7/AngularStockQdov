import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMagazinComponent } from './add-magazin.component';

describe('AddMagazinComponent', () => {
  let component: AddMagazinComponent;
  let fixture: ComponentFixture<AddMagazinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMagazinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddMagazinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
