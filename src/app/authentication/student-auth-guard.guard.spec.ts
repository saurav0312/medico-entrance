import { TestBed } from '@angular/core/testing';

import { StudentAuthGuardGuard } from './student-auth-guard.guard';

describe('StudentAuthGuardGuard', () => {
  let guard: StudentAuthGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StudentAuthGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
