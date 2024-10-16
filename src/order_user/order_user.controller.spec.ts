import { Test, TestingModule } from '@nestjs/testing';
import { OrderUserController } from './order_user.controller';

describe('OrderUserController', () => {
  let controller: OrderUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderUserController],
    }).compile();

    controller = module.get<OrderUserController>(OrderUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
