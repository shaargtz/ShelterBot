import { TestBed } from '@angular/core/testing';

import { ContentProviderService } from './content-provider.service';

describe('ContentProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentProviderService = TestBed.get(ContentProviderService);
    expect(service).toBeTruthy();
  });
});
