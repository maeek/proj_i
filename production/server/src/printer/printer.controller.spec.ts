import { CreatePrinterResponse } from './dto/create-printer.dto';
import { PrinterController } from './printer.controller';
import { PrinterService } from './services/printer.service';

describe('PrinterController', () => {
  let printersController: PrinterController;
  let printersService: PrinterService;

  beforeEach(() => {
    printersService = new PrinterService({} as any, {} as any);
    printersController = new PrinterController(printersService);
  });

  describe('create', () => {
    it('should return a new printer', async () => {
      const result = {
        id: 'string',
        version: '1.8.1',
        safemode: 'incomplete_startup',
      } as CreatePrinterResponse;
      jest
        .spyOn(printersService, 'create')
        .mockImplementation(() => result as any);

      expect(
        await printersController.create({
          name: 'printer upstairs',
          ip: 'x.x.x.x',
          proto: 'http',
          port: 80,
          type: 'octopi',
          apiKey: 'supersecretapikey',
        }),
      ).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return printers list', async () => {
      const result = [];
      jest
        .spyOn(printersService, 'findAll')
        .mockImplementation(() => result as any);

      expect(await printersController.findAll(0, 10)).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return printers list', async () => {
      const result = {
        id: 'abc',
        state: {},
        job: {},
        printer: {},
      };
      jest
        .spyOn(printersService, 'findOne')
        .mockImplementation(() => result as any);

      expect(await printersController.findOne(result.id)).toBe(result);
    });
  });
});
