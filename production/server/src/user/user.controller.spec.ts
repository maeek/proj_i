import { UserService } from './services/user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService({} as any);
    userController = new UserController(userService);
  });

  describe('create', () => {
    it('should return a new printer', async () => {
      const result = {
        name: 'test',
        id: '123',
        role: 'admin',
      };

      jest.spyOn(userService, 'create').mockImplementation(() => result as any);

      expect(
        await userController.create({
          name: 'test',
          password: 'aaaa',
          role: 'admin',
        }),
      ).toBe(result);
    });
  });
});
