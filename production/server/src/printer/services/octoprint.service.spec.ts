import { OctoprintService } from './octoprint.service';

jest.mock('isomorphic-fetch');
global.fetch = jest.fn();

describe('OctoprintService', () => {
  let octoprintService: OctoprintService;

  beforeEach(() => {
    octoprintService = new OctoprintService();
  });

  describe('validate', () => {
    it('should validate positively', async () => {
      const validationResult = {
        status: true,
        version: '1.8.1',
        safemode: 'incomplete_startup',
      };

      (global as any).fetch = jest.fn(async () => ({
        status: 200,
        json: async () => validationResult,
      }));

      expect(
        await octoprintService.validate({
          ip: 'x.x.x.x',
          proto: 'http',
          port: 80,
          apiKey: 'supersecretapikey',
        }),
      ).toEqual(validationResult);
    });

    it('should throw error - invalid api key', async () => {
      (global as any).fetch = jest.fn(async () => ({
        status: 401,
        json: async () => null,
      }));

      try {
        await octoprintService.validate({
          ip: 'x.x.x.x',
          proto: 'http',
          port: 80,
          apiKey: 'supersecretapikey',
        });
      } catch (e) {
        expect(e.message).toEqual('Invalid API key');
      }
    });

    it('should throw error - not reachable', async () => {
      (global as any).fetch = jest.fn(async () => ({
        status: 502,
        json: async () => null,
      }));

      try {
        await octoprintService.validate({
          ip: 'x.x.x.x',
          proto: 'http',
          port: 80,
          apiKey: 'supersecretapikey',
        });
      } catch (e) {
        expect(e.message).toEqual('Printer not reachable');
      }
    });
  });

  describe('get', () => {
    it('should get positively', async () => {
      const spyResults: any = {
        status: true,
        version: '1.8.1',
        safemode: 'incomplete_startup',
      };

      const results: any = {
        ...spyResults,
        connection: spyResults,
        printer: spyResults,
      };

      (global as any).fetch = jest.fn(async () => ({
        status: 200,
        json: async () => spyResults,
      }));

      expect(
        await octoprintService.get({
          ip: 'x.x.x.x',
          proto: 'http',
          port: 80,
          apiKey: 'supersecretapikey',
        }),
      ).toEqual(results);
    });
  });

  describe('upload', () => {
    it('should upload positively', async () => {
      const file = { buffer: new Buffer('file'), name: 'file.gcode' };

      (global as any).fetch = jest.fn(async () => ({
        status: 200,
        json: () => ({}),
      }));

      expect(
        await octoprintService.uploadFile(
          {
            ip: 'x.x.x.x',
            proto: 'http',
            port: 80,
            apiKey: 'supersecretapikey',
          },
          file as any,
        ),
      ).toEqual({});
    });
  });
});
