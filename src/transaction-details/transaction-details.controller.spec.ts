import { Test, TestingModule } from '@nestjs/testing';
import { TransactionDetailsController } from './transaction-details.controller';
import { TransactionDetailsService } from './transaction-details.service';

describe('TransactionDetailsController', () => {
  let controller: TransactionDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionDetailsController],
      providers: [TransactionDetailsService],
    }).compile();

    controller = module.get<TransactionDetailsController>(TransactionDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
