import { Test, TestingModule } from '@nestjs/testing';
import { TourDatesService } from './tour-dates.service';

describe('TourDatesService', () => {
  let service: TourDatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TourDatesService],
    }).compile();

    service = module.get<TourDatesService>(TourDatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
