import { Module } from '@nestjs/common';
import { PrinterModule } from './printer/printer.module';

@Module({
  imports: [PrinterModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
