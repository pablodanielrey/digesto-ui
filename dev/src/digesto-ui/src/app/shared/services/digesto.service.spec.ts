import { TestBed } from '@angular/core/testing';

import { DigestoService } from './digesto.service';

describe('DigestoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DigestoService = TestBed.get(DigestoService);
    expect(service).toBeTruthy();
  });
});
