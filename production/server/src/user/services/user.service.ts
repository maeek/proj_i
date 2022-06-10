import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    if (['admin', 'root'].includes(createUserDto.name)) {
      throw new HttpException(
        {
          error: 'Reseved name',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (!createUserDto.password || !createUserDto.name) {
      throw new HttpException(
        {
          error: 'Invalid user data',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { name, password, role = 'user' } = createUserDto;

    const newUser = await this.userRepository.create({
      name,
      password: await bcrypt.hash(password, 10),
      role,
    });

    return {
      id: newUser.UserId,
      name: newUser.name,
      role: newUser.role,
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
