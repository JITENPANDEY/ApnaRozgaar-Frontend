import { TestBed } from '@angular/core/testing';

import { UserForgetPasswordService } from './user-forget-password.service';

describe('UserForgetPasswordService', () => {
  let service: UserForgetPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserForgetPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
