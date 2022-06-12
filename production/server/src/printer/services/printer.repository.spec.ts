import { Test, TestingModule } from '@nestjs/testing';
import { PrintersRepository } from './printer.repository';

describe('PrinterService', () => {
  let service: PrintersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrintersRepository],
    }).compile();

    service = module.get<PrintersRepository>(PrintersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('', () => {});
});
