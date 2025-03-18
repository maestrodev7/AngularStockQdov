/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VentesService } from './Ventes.service';

describe('Service: Ventes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VentesService]
    });
  });

  it('should ...', inject([VentesService], (service: VentesService) => {
    expect(service).toBeTruthy();
  }));
});
