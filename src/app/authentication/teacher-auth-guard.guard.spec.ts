import { TestBed } from '@angular/core/testing';

import { TeacherAuthGuardGuard } from './teacher-auth-guard.guard';

describe('TeacherAuthGuardGuard', () => {
  let guard: TeacherAuthGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TeacherAuthGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
