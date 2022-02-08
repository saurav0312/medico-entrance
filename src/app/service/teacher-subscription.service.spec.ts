import { TestBed } from '@angular/core/testing';

import { TeacherSubscriptionService } from './teacher-subscription.service';

describe('TeacherSubscriptionService', () => {
  let service: TeacherSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
