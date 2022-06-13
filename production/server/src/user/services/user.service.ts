import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    console.log(bcrypt);
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
}
