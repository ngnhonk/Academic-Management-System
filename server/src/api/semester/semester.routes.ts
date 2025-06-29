import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

import { authenticate, authorize } from "@/common/middleware/auth";
import {
    SemesterSchema,
    GetSemesterSchema,
    CreateSemesterSchema,
    UpdateSemesterSchema
} from "@/api/semester/semester.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { semesterController } from "./semester.controller";

export const semesterRegistry = new OpenAPIRegistry();
export const semesterRouter: Router = express.Router();

semesterRegistry.register("Semester", SemesterSchema);

// Get all semesters
semesterRegistry.registerPath({
    method: "get",
    path: "/semesters",
    tags: ["Semester (Học kỳ)"],
    summary: "Get semesters list",
    responses: createApiResponse(z.array(SemesterSchema), "Success"),
});

semesterRouter.get("/",  authenticate,
  authorize(["admin", "moderator"]), semesterController.getAllSemesters);

// Get a semester
semesterRegistry.registerPath({
    method: "get",
    path: "/semesters/{id}",
    tags: ["Semester (Học kỳ)"],
    summary: "Get a semester by ID",
    request: {
        params: GetSemesterSchema.shape.params,
    },
    responses: createApiResponse(GetSemesterSchema, "Success"),
});

semesterRouter.get(
    "/:id",  authenticate,
      authorize(["admin", "moderator"]),
    validateRequest(GetSemesterSchema),
    semesterController.getSemesterById
);

// Create a semester
semesterRegistry.registerPath({
    method: "post",
    path: "/semesters",
    tags: ["Semester (Học kỳ)"],
    summary: "Create a semester",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateSemesterSchema.shape.body,
                },
            },
        },
    },
    responses: createApiResponse(SemesterSchema, "Success"),
});

semesterRouter.post(
    "/",  authenticate,
      authorize(["admin", "moderator"]),
    validateRequest(CreateSemesterSchema),
    semesterController.createSemester
);

// Update a semester information
semesterRegistry.registerPath({
    method: "put",
    path: "/semesters/{id}",
    tags: ["Semester (Học kỳ)"],
    summary: "Update semester information",
    request: {
        params: UpdateSemesterSchema.shape.params,
        body: {
            content: {
                "application/json": {
                    schema: UpdateSemesterSchema.shape.body,
                },
            },
        },
    },
    responses: createApiResponse(SemesterSchema, "Success"),
});

semesterRouter.put(
    "/:id",  authenticate,
      authorize(["admin", "moderator"]),
    validateRequest(UpdateSemesterSchema),
    semesterController.updateSemester
);


// Delete a semester
semesterRegistry.registerPath({
    method: "delete",
    path: "/semesters/{id}",
    tags: ["Semester (Học kỳ)"],
    summary: "Delete semester",
    request: {
        params: GetSemesterSchema.shape.params,
    },
    responses: createApiResponse(SemesterSchema, "Success"),
});
semesterRouter.delete(
    "/:id",  authenticate,
      authorize(["admin", "moderator"]),
    validateRequest(GetSemesterSchema),
    semesterController.deleteSemester
);
