import { Test, TestingModule } from '@nestjs/testing';
import { OrderUserService } from './order_user.service';

describe('OrderUserService', () => {
  let service: OrderUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderUserService],
    }).compile();

    service = module.get<OrderUserService>(OrderUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
