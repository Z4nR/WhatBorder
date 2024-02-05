import { Test, TestingModule } from '@nestjs/testing';
import { HelperServiceService } from './helper.service';

describe('HelperServiceService', () => {
  let service: HelperServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperServiceService],
    }).compile();

    service = module.get<HelperServiceService>(HelperServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
