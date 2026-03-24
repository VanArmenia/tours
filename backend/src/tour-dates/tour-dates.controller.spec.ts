import { Test, TestingModule } from '@nestjs/testing';
import { TourDatesController } from './tour-dates.controller';

describe('TourDatesController', () => {
  let controller: TourDatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TourDatesController],
    }).compile();

    controller = module.get<TourDatesController>(TourDatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
