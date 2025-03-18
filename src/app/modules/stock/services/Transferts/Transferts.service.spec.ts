/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TransfertsService } from './Transferts.service';

describe('Service: Transferts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransfertsService]
    });
  });

  it('should ...', inject([TransfertsService], (service: TransfertsService) => {
    expect(service).toBeTruthy();
  }));
});
