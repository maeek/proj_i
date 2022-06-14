import { HttpException } from '@nestjs/common';
import { OctoprintService } from './octoprint.service';
import { PrintersRepository } from './printer.repository';
import { PrinterService } from './printer.service';

describe('PrinterController', () => {
  let printersService: PrinterService;
  let printersRepository: PrintersRepository;
  let octoprintService: OctoprintService;

  beforeEach(() => {
    printersRepository = new PrintersRepository({} as any);
    octoprintService = new OctoprintService();
    printersService = new PrinterService(printersRepository, octoprintService);
  });

  describe('create', () => {
    it('should return a new printer', async () => {
      const repoResult = {
        PrinterId: 'string',
      };

      const result = {
        id: 'string',
        version: '1.8.1',
        safemode: 'incomplete_startup',
      };

      const validationResult = {
        status: true,
        version: '1.8.1',
        safemode: 'incomplete_startup',
      };

      jest
        .spyOn(printersRepository, 'create')
        .mockImplementation(() => repoResult as any);

      jest
        .spyOn(octoprintService, 'validate')
        .mockImplementation(() => validationResult as any);

      expect(
        await printersService.create({
          name: 'printer upstairs',
          ip: 'x.x.x.x',
          proto: 'http',
          port: 80,
          type: 'octopi',
          apiKey: 'supersecretapikey',
        }),
      ).toEqual(result);
    });

    it.each([['ip'], ['port'], ['apiKey']])(
      'should throw error when %s is not specified',
      async (field) => {
        const repoResult = {
          PrinterId: 'string',
        };

        const validationResult = {
          status: true,
          version: '1.8.1',
          safemode: 'incomplete_startup',
        };

        jest
          .spyOn(printersRepository, 'create')
          .mockImplementation(() => repoResult as any);

        jest
          .spyOn(octoprintService, 'validate')
          .mockImplementation(() => validationResult as any);

        const dto: any = {
          name: 'printer upstairs',
          ip: 'x.x.x.x',
          proto: 'http',
          port: 80,
          type: 'octopi',
          apiKey: 'supersecretapikey',
        };

        delete dto[field];

        try {
          await printersService.create(dto);
        } catch (e) {
          expect(e).toBeInstanceOf(HttpException);
        }
      },
    );
  });

  describe('findAll', () => {
    it('should return printers list', async () => {
      const printersList: any = [
        {
          PrinterId: 'aaa',
          name: 'printer aaa',
          ip: 'x.x.x.x',
          proto: 'http',
          port: 80,
          type: 'octopi',
          apiKey: 'supersecretapikey',
          createdAt: 12345,
          lastPrintAt: 12345,
        },
        {
          PrinterId: 'bbb',
          name: 'printer bbb',
          ip: 'x.x.x.x',
          proto: 'http',
          port: 80,
          type: 'octopi',
          apiKey: 'supersecretapikey',
          createdAt: 12345,
          lastPrintAt: 12345,
        },
      ];

      const result = {
        printers: [
          {
            id: 'aaa',
            name: 'printer aaa',
            connectionConfig: {
              ip: 'x.x.x.x',
              port: 80,
              type: 'octopi',
            },
            createdAt: 12345,
            lastPrintAt: 12345,
            status: true,
            version: '1.8.1',
            safemode: 'incomplete_startup',
          },
          {
            id: 'bbb',
            name: 'printer bbb',
            connectionConfig: {
              ip: 'x.x.x.x',
              port: 80,
              type: 'octopi',
            },
            createdAt: 12345,
            lastPrintAt: 12345,
            status: true,
            version: '1.8.1',
            safemode: 'incomplete_startup',
          },
        ],
        total: 2,
      };

      const validationResult = {
        status: true,
        version: '1.8.1',
        safemode: 'incomplete_startup',
      };

      jest
        .spyOn(printersRepository, 'count')
        .mockImplementation(() => 2 as any);
      jest
        .spyOn(printersRepository, 'findAll')
        .mockImplementation(() => printersList);

      jest
        .spyOn(octoprintService, 'validate')
        .mockImplementation(() => validationResult as any);

      jest
        .spyOn(octoprintService, 'get')
        .mockImplementation(() => validationResult as any);

      expect(await printersService.findAll(0, 10)).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return printer', async () => {
      const printerId = 'aaa';

      const printer: any = {
        PrinterId: 'aaa',
        name: 'printer aaa',
        ip: 'x.x.x.x',
        proto: 'http',
        port: 80,
        type: 'octopi',
        apiKey: 'supersecretapikey',
        createdAt: 12345,
        lastPrintAt: 12345,
        prints: [],
      };

      const result = {
        name: 'printer aaa',
        connectionConfig: {
          ip: 'x.x.x.x',
          port: 80,
          type: 'octopi',
        },
        createdAt: 12345,
        lastPrintAt: 12345,
        status: true,
        version: '1.8.1',
        safemode: 'incomplete_startup',
        prints: [],
      };

      const validationResult = {
        status: true,
        version: '1.8.1',
        safemode: 'incomplete_startup',
      };

      jest
        .spyOn(printersRepository, 'findOne')
        .mockImplementation(() => printer);

      jest
        .spyOn(octoprintService, 'validate')
        .mockImplementation(() => validationResult as any);

      jest
        .spyOn(octoprintService, 'get')
        .mockImplementation(() => validationResult as any);

      expect(await printersService.findOne(printerId)).toEqual(result);
    });

    it('should return error not found', async () => {
      const printerId = 'aaa';

      jest.spyOn(printersRepository, 'findOne').mockImplementation(() => null);

      try {
        await printersService.findOne(printerId);
      } catch (e) {
        expect(e.message).toEqual('Printer not found');
      }
    });

    it('should return error not responding', async () => {
      const printerId = 'aaa';
      const printer: any = {
        PrinterId: 'aaa',
        name: 'printer aaa',
        ip: 'x.x.x.x',
        proto: 'http',
        port: 80,
        type: 'octopi',
        apiKey: 'supersecretapikey',
        createdAt: 12345,
        lastPrintAt: 12345,
        prints: [],
      };

      jest
        .spyOn(printersRepository, 'findOne')
        .mockImplementation(() => printer);

      jest
        .spyOn(octoprintService, 'validate')
        .mockImplementation(() => ({} as any));

      try {
        await printersService.findOne(printerId);
      } catch (e) {
        expect(e.message).toEqual('Printer not responding');
      }
    });
  });

  describe('print', () => {
    it('should send print', async () => {
      const printer: any = {
        PrinterId: 'aaa',
        name: 'printer aaa',
        ip: 'x.x.x.x',
        proto: 'http',
        port: 80,
        type: 'octopi',
        apiKey: 'supersecretapikey',
        createdAt: 12345,
        lastPrintAt: 12345,
        prints: [],
      };

      const result = {
        name: 'printer aaa',
        connectionConfig: {
          ip: 'x.x.x.x',
          port: 80,
          type: 'octopi',
        },
        createdAt: 12345,
        lastPrintAt: 12345,
        status: true,
        version: '1.8.1',
        safemode: 'incomplete_startup',
        prints: [],
      };

      const validationResult = {
        status: true,
        version: '1.8.1',
        safemode: 'incomplete_startup',
      };

      jest
        .spyOn(printersRepository, 'findOne')
        .mockImplementation(() => printer);

      jest
        .spyOn(octoprintService, 'validate')
        .mockImplementation(() => validationResult as any);

      jest
        .spyOn(octoprintService, 'get')
        .mockImplementation(() => validationResult as any);

      jest
        .spyOn(printersRepository, 'findOneAndUpdate')
        .mockImplementation(() => null as any);

      jest
        .spyOn(octoprintService, 'uploadFile')
        .mockImplementation(() => null as any);

      expect(
        await printersService.print('aaa', {
          buffer: new Buffer('aaaaa'),
        } as any),
      ).toEqual(result);
    });
  });
});
