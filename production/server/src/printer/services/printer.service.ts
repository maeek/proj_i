import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuid, v4 } from 'uuid';
import { CreatePrinterDto } from '../dto/create-printer.dto';
import { Print } from '../schemas/printer.schema';
import { OctoprintService } from './octoprint.service';
import { PrintersRepository } from './printer.repository';

@Injectable()
export class PrinterService {
  constructor(
    private readonly printersRepository: PrintersRepository,
    private readonly octoprintService: OctoprintService,
  ) {}

  async create(createPrinterDto: CreatePrinterDto) {
    if (
      !createPrinterDto ||
      !createPrinterDto.ip ||
      !createPrinterDto.port ||
      !createPrinterDto.apiKey
    ) {
      throw new HttpException(
        {
          error: 'Invalid printer data',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const {
      ip,
      port,
      name = `printer-${uuid()}`,
      type = 'octopi',
      apiKey,
      proto = 'http',
    } = createPrinterDto;

    const { status, ...printerValidated } =
      await this.octoprintService.validate({
        ip,
        port,
        apiKey,
        proto,
      });

    if (!status) {
      throw new HttpException(
        {
          error: 'Printer failed to validate',
        },
        HttpStatus.BAD_GATEWAY,
      );
    }

    const entry = await this.printersRepository.create({
      ip,
      port,
      name,
      type,
      apiKey,
    });

    return {
      ...printerValidated,
      id: entry.PrinterId,
    };
  }

  async findAll(page = 0, limit = 10) {
    const printersCount = await this.printersRepository.count();
    const printersFromDb = await this.printersRepository.findAll(page, limit);

    const printers = await Promise.all(
      printersFromDb.map(async (p) => {
        const { status } = await this.octoprintService.validate({
          ip: p.ip,
          port: p.port,
          apiKey: p.apiKey,
          proto: p.proto,
        });

        if (!status) {
          return null;
        }

        const moreInfo = await this.octoprintService.get(p);

        return {
          id: p.PrinterId,
          name: p.name,
          connectionConfig: {
            ip: p.ip,
            port: p.port,
            type: p.type,
          },
          lastPrintAt: p.lastPrintAt,
          createdAt: p.createdAt,
          ...moreInfo,
        };
      }),
    );

    return {
      printers: printers.filter(Boolean),
      total: printersCount,
    };
  }

  async findOne(PrinterId: string) {
    const foundPrinter = await this.printersRepository.findOne({ PrinterId });

    if (!foundPrinter) {
      throw new Error('Printer not found');
    }

    const {
      name,
      type,
      createdAt,
      ip,
      port,
      lastPrintAt,
      apiKey,
      proto,
      prints,
    } = foundPrinter;

    const { status } = await this.octoprintService.validate({
      ip,
      port,
      apiKey,
      proto,
    });

    if (!status) {
      throw new Error('Printer not responding');
    }

    const printer = await this.octoprintService.get(foundPrinter);

    return {
      name,
      connectionConfig: {
        ip,
        port,
        type,
      },
      lastPrintAt,
      createdAt,
      prints: prints?.map((p) => ({ ...p, file: '' })),
      ...printer,
    };
  }

  async print(PrinterId: string, file: Express.Multer.File) {
    const foundPrinter = await this.printersRepository.findOne({
      PrinterId,
    });

    const { ip, port, apiKey, proto } = foundPrinter;

    await this.octoprintService.uploadFile(
      {
        ip,
        port,
        apiKey,
        proto,
      },
      file,
    );

    await this.printersRepository.findOneAndUpdate(
      { PrinterId },
      {
        $push: {
          prints: {
            UserId: '',
            PrintId: v4(),
            status: 'running',
            startTime: Date.now(),
            endTime: null,
            file: file.buffer.toString('base64'),
          } as Print,
        },
      },
    );

    return this.findOne(PrinterId);
  }
}
