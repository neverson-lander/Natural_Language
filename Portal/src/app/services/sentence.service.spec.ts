import { TestBed, inject } from '@angular/core/testing';

import { SentenceService } from './sentence.service';

describe('SentenceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SentenceService]
    });
  });

  it('should be created', inject([SentenceService], (service: SentenceService) => {
    expect(service).toBeTruthy();
  }));
});
