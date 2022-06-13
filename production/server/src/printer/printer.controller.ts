import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PrinterService } from './services/printer.service';
import {
  CreatePrinterDto,
  CreatePrinterResponse,
} from './dto/create-printer.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Printer')
@Controller('printer')
export class PrinterController {
  constructor(private readonly printerService: PrinterService) {}

  @Post()
  @ApiBody({ type: CreatePrinterDto })
  @ApiCreatedResponse({ type: CreatePrinterResponse })
  create(@Body() createPrinterDto: CreatePrinterDto) {
    return this.printerService.create(createPrinterDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.printerService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const printer = await this.printerService.findOne(id);

      return printer;
    } catch (error) {
      throw new HttpException(
        {
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async print(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.printerService.print(id, file);
  }
}
