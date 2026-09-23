import { TestBed } from '@angular/core/testing';
import { Iot } from './iot';

describe('Iot', () => {
  let service: Iot;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Iot);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
