import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTransfertComponent } from './list-transfert.component';

describe('ListTransfertComponent', () => {
  let component: ListTransfertComponent;
  let fixture: ComponentFixture<ListTransfertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTransfertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListTransfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
