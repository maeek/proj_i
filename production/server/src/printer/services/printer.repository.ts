import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Printer, PrinterDocument } from '../schemas/printer.schema';

@Injectable()
export class PrintersRepository {
  constructor(
    @InjectModel(Printer.name) private printerModel: Model<PrinterDocument>,
  ) {}

  async count(filter?: FilterQuery<PrinterDocument>) {
    return this.printerModel.count(filter);
  }

  async exists(existsFilterQuery: FilterQuery<PrinterDocument>) {
    return this.printerModel.exists(existsFilterQuery);
  }

  findOne(printerFilterQuery: FilterQuery<PrinterDocument>) {
    return this.printerModel.findOne(printerFilterQuery);
  }

  async findAll(page = 0, perPage = 100) {
    const docsCount = await this.count();
    let pg = Math.max(0, page) * perPage;
    const lm = Math.max(1, perPage);

    // TODO: check if this is correct, im stoned
    if (pg * lm > docsCount) {
      pg = Math.ceil(docsCount / lm);
    }

    return this.find().skip(pg).limit(lm).exec();
  }

  find(printersFilterQuery?: FilterQuery<PrinterDocument>) {
    return this.printerModel.find(printersFilterQuery);
  }

  async create(printer: Partial<Printer>) {
    const newPrinter = new this.printerModel(printer);
    return newPrinter.save();
  }

  async remove(printerFilterQuery: FilterQuery<PrinterDocument>) {
    return this.printerModel.deleteMany(printerFilterQuery);
  }

  async findOneAndUpdate(
    printerFilterQuery: FilterQuery<PrinterDocument>,
    printer: any,
  ) {
    return this.printerModel.findOneAndUpdate(printerFilterQuery, printer, {
      new: true,
    });
  }
}
