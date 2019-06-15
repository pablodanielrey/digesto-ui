import { TestBed } from '@angular/core/testing';

import { NavegarService } from './navegar.service';

describe('VolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavegarService = TestBed.get(NavegarService);
    expect(service).toBeTruthy();
  });
});
