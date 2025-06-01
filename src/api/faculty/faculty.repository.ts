import db from "../configs/database";
import type { Faculty } from "@/api/faculty/faculty.model";

export class FacultyRepository {
    async getAllFaculties(): Promise<Faculty[]> {
        const result = await db("faculty").select("*");
        return result;
    }

    async getFacultyById(id: number): Promise<Faculty | null> {
        return await db("faculty").select("*").where({ id }).first();
    }

    async createFaculty(full_name: string, short_name: string, description: string): Promise<number> {
        const [id] = await db("faculty").insert({ full_name, short_name, description });
        return id;
    }

    async updateFaculty(id: number, full_name: string, short_name: string, description: string): Promise<number> {
        const result = await db("faculty").where({ id }).update({ full_name, short_name, description });
        return result;
    }

    async deleteFaculty(id: number): Promise<number> {
        return await db("faculty").where({ id }).del();
    }

    async isFacultyExists(field: "id" | "full_name" | "short_name", value: string | number): Promise<boolean> {
        const exists = await db("faculty")
            .where({ [field]: value })
            .first();
        return !!exists;
    }
}