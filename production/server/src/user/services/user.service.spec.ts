import { HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('UserController', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository({} as any);
    userService = new UserService(userRepository);
  });

  describe('create', () => {
    it('should return a new printer', async () => {
      const userResult = {
        name: 'test',
        UserId: '123',
        role: 'admin',
      };

      const result = {
        name: 'test',
        id: '123',
        role: 'admin',
      };

      jest
        .spyOn(userRepository, 'create')
        .mockImplementation(() => userResult as any);

      expect(
        await userService.create({
          name: 'test',
          password: 'aaaa',
          role: 'admin',
        }),
      ).toEqual(result);
    });

    it('should throw error when username is reserved', async () => {
      try {
        await userService.create({
          name: 'admin',
          password: 'aaaa',
          role: 'admin',
        });
      } catch (e) {
        expect(e).toEqual(
          new HttpException(
            {
              error: 'Reseved name',
            },
            HttpStatus.FORBIDDEN,
          ),
        );
      }
    });

    it.each([['name', 'password']])(
      'should throw error when %s is not provided',
      async (field) => {
        const result: any = {
          name: 'admin',
          password: 'aaaa',
          role: 'admin',
        };

        delete result[field];

        try {
          await userService.create(result);
        } catch (e) {
          expect(e).toEqual(
            new HttpException(
              {
                error: 'Invalid user data',
              },
              HttpStatus.BAD_REQUEST,
            ),
          );
        }
      },
    );
  });
});
