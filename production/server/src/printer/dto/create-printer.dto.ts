import { ApiProperty } from '@nestjs/swagger';

export type PrinterType = 'octopi';

export class CreatePrinterDto {
  @ApiProperty({ example: 'printer upstairs' })
  name: string;

  @ApiProperty({ example: '10.0.0.8' })
  ip: string;

  @ApiProperty({ example: 'http' })
  proto: 'http' | 'https';

  @ApiProperty({ example: 80 })
  port: number;

  @ApiProperty({ example: 'octopi' })
  type: PrinterType;

  @ApiProperty({ example: 'supersecretapikey' })
  apiKey: string;
}

export class CreatePrinterResponse {
  @ApiProperty({ example: 'asd68-dfgdg435-sadg45-fdsf5' })
  id: string;

  @ApiProperty({ example: '1.8.1' })
  version: string;

  @ApiProperty({ example: 'incomplete_startup' })
  safemode: string;
}
