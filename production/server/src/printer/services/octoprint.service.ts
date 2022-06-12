import 'isomorphic-fetch';
import { Injectable } from '@nestjs/common';
import { Printer } from '../schemas/printer.schema';
import { PrinterInfoResponse } from '../dto/printer-validation';
import * as FormData from 'form-data';

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

  async uploadFile(printer: PrinterDto, file: Express.Multer.File) {
    const form = new FormData({
      encoding: 'utf-8',
    });
    form.setBoundary('----WebKitFormBoundaryDeC2E3iWbTv1PwMC');
    form.append('file', file.buffer, file.originalname);
    form.append('select', 'true');
    form.append('print', 'true');
    form.append('path', 'uploads/');

    return this._request(printer, 'api/files/local', {
      headers: {
        'Content-Type':
          'multipart/form-data; boundary=----WebKitFormBoundaryDeC2E3iWbTv1PwMC',
        'Content-Length': form.getLengthSync(),
      },
      method: 'POST',
      body: form,
    });
  }

  private async _request<T = Record<string, unknown>>(
    printer: PrinterDto,
    apiPath: string,
    options?: any,
  ): Promise<T> {
    const url = `${printer.proto || 'http'}://${printer.ip}:${
      printer.port
    }/${apiPath}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'X-Api-Key': printer.apiKey,
      },
    });

    if (response.status === 200) {
      return response.json();
    } else if (response.status === 401) {
      throw new Error('Invalid API key');
    } else if (response.status >= 400) {
      console.error(response);
      throw new Error('Printer not reachable');
    }
  }
}
