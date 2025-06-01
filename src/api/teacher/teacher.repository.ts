import db from "../configs/database";
import type { Teacher } from "@/api/teacher/teacher.model";

export class TeacherRepository {
    async getAllTeachers(): Promise<Teacher[]> {
        const result = await db("teacher").select("*");
        return result;
    }

    async createTeacher(full_name: string, phone: string, email: string, degree_id: number, faculty_id: number): Promise<number> {
        const [id] = await db("teacher").insert({ full_name, phone, email, degree_id, faculty_id });
        return id;
    }

    async updateTeacher(id: number, full_name: string, phone: string, email: string, degree_id: number, faculty_id: number): Promise<number> {
        const result = await db("teacher").where({ id }).update({ full_name, phone, email, degree_id, faculty_id });
        return result;
    }

    async deleteTeacher(id: number): Promise<number> {
        return await db("teacher").where({ id }).del();
    }

    async isTeacherExists(field: "id" | "phone" | "email", value: string | number): Promise<boolean> {
        const exists = await db("teacher")
            .where({ [field]: value })
            .first();
        return !!exists;
    }

    async getTeacherBy(field: "id" | "phone" | "email", value: string | number): Promise<Teacher | null> {
        const result = await db("teacher")
            .where({ [field]: value })
            .first();
        return result;
    }
}