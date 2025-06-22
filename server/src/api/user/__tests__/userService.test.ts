import { StatusCodes } from "http-status-codes";
import type { Mock } from "vitest";

import type { User } from "@/api/user/user.model";
import { UserRepository } from "@/api/user/user.repository";
import { UserService } from "@/api/user/user.service";

vi.mock("@/api/user/userRepository");

describe("userService", () => {
	let userServiceInstance: UserService;
	let userRepositoryInstance: UserRepository;

	const mockUsers = [
		{
			id: 1,
			name: "Alice",
			email: "alice@example.com",
			age: 42,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: 2,
			name: "Bob",
			email: "bob@example.com",
			age: 21,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	beforeEach(() => {
		userRepositoryInstance = new UserRepository();
		userServiceInstance = new UserService(userRepositoryInstance);
	});

	describe("findAll", () => {
		it("return all users", async () => {
			// Arrange
			(userRepositoryInstance.getAllUsers as Mock).mockReturnValue(mockUsers);

			// Act
			const result = await userServiceInstance.getAllUsers();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).equals("Users found");
			expect(result.responseObject).toEqual(mockUsers);
		});

		it("returns a not found error for no users found", async () => {
			// Arrange
			(userRepositoryInstance.getAllUsers as Mock).mockReturnValue(null);

			// Act
			const result = await userServiceInstance.getAllUsers();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(result.success).toBeFalsy();
			expect(result.message).equals("No Users found");
			expect(result.responseObject).toBeNull();
		});

		it("handles errors for findAllAsync", async () => {
			// Arrange
			(userRepositoryInstance.getAllUsers as Mock).mockRejectedValue(new Error("Database error"));

			// Act
			const result = await userServiceInstance.getAllUsers();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
			expect(result.success).toBeFalsy();
			expect(result.message).equals("An error occurred while retrieving users.");
			expect(result.responseObject).toBeNull();
		});
	});

	describe("findById", () => {
		it("returns a user for a valid ID", async () => {
			// Arrange
			const testId = 1;
			const mockUser = mockUsers.find((user) => user.id === testId);
			(userRepositoryInstance.getUserById as Mock).mockReturnValue(mockUser);

			// Act
			const result = await userServiceInstance.getUserById(testId);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).equals("User found");
			expect(result.responseObject).toEqual(mockUser);
		});

		it("handles errors for findByIdAsync", async () => {
			// Arrange
			const testId = 1;
			(userRepositoryInstance.getUserById as Mock).mockRejectedValue(new Error("Database error"));

			// Act
			const result = await userServiceInstance.getUserById(testId);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
			expect(result.success).toBeFalsy();
			expect(result.message).equals("An error occurred while finding user.");
			expect(result.responseObject).toBeNull();
		});

		it("returns a not found error for non-existent ID", async () => {
			// Arrange
			const testId = 1;
			(userRepositoryInstance.getUserById as Mock).mockReturnValue(null);

			// Act
			const result = await userServiceInstance.getUserById(testId);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(result.success).toBeFalsy();
			expect(result.message).equals("User not found");
			expect(result.responseObject).toBeNull();
		});
	});
});
