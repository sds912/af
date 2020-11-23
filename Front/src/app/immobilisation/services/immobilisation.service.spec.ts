import { TestBed } from '@angular/core/testing';

import { ImmobilisationService } from './immobilisation.service';

describe('ImmobilisationService', () => {
  let service: ImmobilisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImmobilisationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
