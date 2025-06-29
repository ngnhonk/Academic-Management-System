import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  ChangePasswordSchema,
  CreateUserSchema,
  GetUserSchema,
  UpdateUserSchema,
  UserSchema,
} from "@/api/user/user.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./user.controller";
import { authenticate, authorize } from "@/common/middleware/auth";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

// Get all users
userRegistry.registerPath({
  method: "get",
  path: "/users",
  tags: ["User"],
  summary: "Get users list",
  responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRouter.get(
  "/",
  authenticate,
  authorize(["admin"]),
  userController.getAllUsers
);

// Get an user
userRegistry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["User"],
  summary: "Get an user by id",
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.get(
  "/:id",
  authenticate,
  authorize(["admin"]),
  validateRequest(GetUserSchema),
  userController.getUserById
);
// Get personal information of the logged-in user
userRegistry.registerPath({
  method: "get",
  path: "/users/{id}/me",
  tags: ["User"],
  summary: "Get personal information of the logged-in user",
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.get("/:id/me", authenticate, userController.getMyself);

// Create an user
userRegistry.registerPath({
  method: "post",
  path: "/users",
  tags: ["User"],
  summary: "Create an user",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateUserSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.post(
  "/",
  authenticate,
  authorize(["admin"]),
  validateRequest(CreateUserSchema),
  userController.createUser
);

// force change password 

userRouter.put(
  "/change-password",
  authenticate,
  authorize(["admin"]),
  validateRequest(ChangePasswordSchema),
  userController.changePassword
);

// Update an user information
userRegistry.registerPath({
  method: "put",
  path: "/users/{id}",
  tags: ["User"],
  summary: "Update user information",
  request: {
    params: GetUserSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: UpdateUserSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.put(
  "/:id",
  authenticate,
  validateRequest(UpdateUserSchema),
  userController.updateUser
);

// Delete an user information
userRegistry.registerPath({
  method: "delete",
  path: "/users/{id}",
  tags: ["User"],
  summary: "Delete user information",
  request: {
    params: GetUserSchema.shape.params,
  },
  responses: createApiResponse(UserSchema, "Success"),
});
userRouter.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  validateRequest(GetUserSchema),
  userController.deleteUser
);

