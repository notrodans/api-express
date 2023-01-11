import "reflect-metadata";
import { UserModel } from "@prisma/client";
import { Container } from "inversify";
import { IConfigService } from "../config/config.service.interface";
import { TYPES } from "../types";
import { IUsersRepository } from "./users.repository.interface";
import { UserService } from "./users.service";
import { IUsersService } from "./users.service.interface";

const ConfigServiceMock: IConfigService = {
	get: jest.fn()
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn()
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUsersService;

beforeAll(() => {
	container.bind<IUsersService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersService = container.get<IUsersService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe("User Service[createUser] - PASS", () => {
	it("createUser", async () => {
		configService.get = jest.fn().mockReturnValueOnce("1");
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: UserModel): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1
			})
		);
		createdUser = await usersService.createUser({
			email: "notrodans.test@gmail.com",
			name: "notrodans",
			password: "onatnegra"
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual("1");
	});

	it("validateUser - pass", async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const user = await usersService.validateUser({
			email: "notrodans.test@gmail.com",
			password: "onatnegra"
		});
		expect(user).toBeTruthy();
	});

	it("validateUser - fail", async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const user = await usersService.validateUser({
			email: "notrodans.test@gmail.com",
			password: "3"
		});
		expect(user).toBeFalsy();
	});
});
