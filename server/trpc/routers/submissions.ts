import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import { submissions, assessments } from "@/server/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export const submissionsRouter = router({
  getAll: protectedProcedure
    .input(
      z.object({
        status: z.enum(["new", "reviewed", "contacted", "archived"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const conditions = input.status ? [eq(submissions.status, input.status)] : [];

      const results = await db.query.submissions.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        with: {
          assessment: true,
        },
        orderBy: [desc(submissions.createdAt)],
      });

      return results;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const submission = await db.query.submissions.findFirst({
        where: eq(submissions.id, input.id),
        with: {
          assessment: true,
        },
      });

      if (!submission) {
        throw new Error("Submission not found");
      }

      return submission;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z.enum(["new", "reviewed", "contacted", "archived"]),
      })
    )
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(submissions)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(submissions.id, input.id))
        .returning();

      return updated;
    }),

  updateNotes: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        adminNotes: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(submissions)
        .set({
          adminNotes: input.adminNotes,
          updatedAt: new Date(),
        })
        .where(eq(submissions.id, input.id))
        .returning();

      return updated;
    }),

  getStats: protectedProcedure.query(async () => {
    const allSubmissions = await db.query.submissions.findMany();

    const stats = {
      total: allSubmissions.length,
      new: allSubmissions.filter((s) => s.status === "new").length,
      reviewed: allSubmissions.filter((s) => s.status === "reviewed").length,
      contacted: allSubmissions.filter((s) => s.status === "contacted").length,
      archived: allSubmissions.filter((s) => s.status === "archived").length,
    };

    return stats;
  }),
});
