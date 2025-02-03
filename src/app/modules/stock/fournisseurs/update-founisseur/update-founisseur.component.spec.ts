import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFounisseurComponent } from './update-founisseur.component';

describe('UpdateFounisseurComponent', () => {
  let component: UpdateFounisseurComponent;
  let fixture: ComponentFixture<UpdateFounisseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateFounisseurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateFounisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
