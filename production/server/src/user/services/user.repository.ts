import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async count(filter?: FilterQuery<UserDocument>) {
    return this.userModel.count(filter);
  }

  async exists(existsFilterQuery: FilterQuery<UserDocument>) {
    return this.userModel.exists(existsFilterQuery);
  }

  findOne(printerFilterQuery: FilterQuery<UserDocument>) {
    return this.userModel.findOne(printerFilterQuery);
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

  find(printersFilterQuery?: FilterQuery<UserDocument>) {
    return this.userModel.find(printersFilterQuery);
  }

  async create(printer: Partial<User>) {
    const newUser = new this.userModel(printer);
    return newUser.save();
  }

  async remove(printerFilterQuery: FilterQuery<UserDocument>) {
    return this.userModel.deleteMany(printerFilterQuery);
  }

  async findOneAndUpdate(
    printerFilterQuery: FilterQuery<UserDocument>,
    printer: Partial<User>,
  ) {
    return this.userModel.findOneAndUpdate(printerFilterQuery, printer, {
      new: true,
    });
  }
}
