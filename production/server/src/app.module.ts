import { Module } from '@nestjs/common';
import { PrinterModule } from './printer/printer.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrinterModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
