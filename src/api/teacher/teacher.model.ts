import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Teacher = z.infer<typeof TeacherSchema>;
export const TeacherSchema = z.object({
    id: z.number(),
    full_name: z.string(),
    phone: z.string(),
    email: z.string(),
    degree_id: z.number(),
    faculty_id: z.number()
});

export const GetTeacherSchema = z.object({
    params: z.object({ id: commonValidations.id }),
});

export const CreateTeacherSchema = z.object({
    body: z.object({
        full_name: commonValidations.full_name,
        phone: commonValidations.phone,
        email: commonValidations.email,
        degree_id: commonValidations.id,
        faculty_id: commonValidations.id,
    }),
});

export const UpdateTeacherSchema = z.object({
    params: z.object({
        id: commonValidations.id,
    }),
    body: z.object({
        full_name: commonValidations.full_name,
        phone: commonValidations.phone,
        email: commonValidations.email,
        degree_id: commonValidations.id,
        faculty_id: commonValidations.id,
    }),
});
