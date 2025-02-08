import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMagazinsComponent } from './list-magazins.component';

describe('ListMagazinsComponent', () => {
  let component: ListMagazinsComponent;
  let fixture: ComponentFixture<ListMagazinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMagazinsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListMagazinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
