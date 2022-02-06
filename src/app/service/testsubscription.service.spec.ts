import { TestBed } from '@angular/core/testing';

import { TestsubscriptionService } from './testsubscription.service';

describe('TestsubscriptionService', () => {
  let service: TestsubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestsubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
