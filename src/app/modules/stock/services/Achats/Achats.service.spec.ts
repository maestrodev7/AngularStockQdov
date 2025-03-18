/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AchatsService } from './Achats.service';

describe('Service: Achats', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AchatsService]
    });
  });

  it('should ...', inject([AchatsService], (service: AchatsService) => {
    expect(service).toBeTruthy();
  }));
});
