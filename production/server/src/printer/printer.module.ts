import { Module } from '@nestjs/common';
import { PrinterService } from './services/printer.service';
import { PrinterController } from './printer.controller';
import { PrintersRepository } from './services/printer.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfigService } from 'src/service/mongo-config.service';
import { PrinterSchema } from './schemas/printer.schema';
import { OctoprintService } from './services/octoprint.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: 'Printer',
        schema: PrinterSchema,
        collection: 'printers',
      },
    ]),
  ],
  controllers: [PrinterController],
  providers: [PrinterService, PrintersRepository, OctoprintService],
})
export class PrinterModule {}
