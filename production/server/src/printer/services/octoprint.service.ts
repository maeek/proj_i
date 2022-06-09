import 'isomorphic-fetch';
import { Injectable } from '@nestjs/common';
import { Printer } from '../schemas/printer.schema';
import { PrinterInfoResponse } from '../dto/printer-validation';

export type PrinterDto = Pick<Printer, 'ip' | 'apiKey' | 'port' | 'proto'>;

@Injectable()
export class OctoprintService {
  async validate(printer: PrinterDto) {
    const responseJson = await this._request<PrinterInfoResponse>(
      printer,
      'api/server',
    );
    return {
      status: true,
      version: responseJson.version,
      safemode: responseJson.safemode,
    };
  }

  async get(printer: PrinterDto) {
    const jobStatus = await this.getJobStatus(printer);
    const connection = await this.getConnection(printer);
    const printerStatus = await this.getOperations(printer);

    return {
      ...jobStatus,
      connection,
      printer: printerStatus,
    };
  }

  async getJobStatus(printer: PrinterDto) {
    return this._request(printer, 'api/job');
  }

  async getConnection(printer: PrinterDto) {
    return this._request(printer, 'api/connection');
  }

  async getOperations(printer: PrinterDto) {
    return this._request(printer, '/api/printer?history=true&limit=1');
  }

  private async _request<T = Record<string, unknown>>(
    printer: PrinterDto,
    apiPath: string,
  ): Promise<T> {
    const url = `${printer.proto || 'http'}://${printer.ip}:${
      printer.port
    }/${apiPath}`;

    const response = await fetch(url, {
      headers: {
        'X-Api-Key': printer.apiKey,
      },
    });

    if (response.status === 200) {
      return response.json();
    } else if (response.status === 401) {
      throw new Error('Invalid API key');
    } else if (response.status >= 400) {
      throw new Error('Printer not reachable');
    }
  }
}
