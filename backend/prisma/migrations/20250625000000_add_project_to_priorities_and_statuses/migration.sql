-- DropForeignKey (so we can alter priorities/statuses)
ALTER TABLE "test_cases" DROP CONSTRAINT IF EXISTS "test_cases_priority_id_fkey";
ALTER TABLE "test_cases" DROP CONSTRAINT IF EXISTS "test_cases_status_id_fkey";

-- DropIndex (unique on value)
DROP INDEX IF EXISTS "test_case_priorities_value_key";
DROP INDEX IF EXISTS "test_case_statuses_value_key";

-- AlterTable test_case_priorities: add project_id (requires empty table or run after DB reset)
ALTER TABLE "test_case_priorities" ADD COLUMN "project_id" BIGINT NOT NULL;

-- AlterTable test_case_statuses
ALTER TABLE "test_case_statuses" ADD COLUMN "project_id" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "test_case_priorities" ADD CONSTRAINT "test_case_priorities_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "test_case_statuses" ADD CONSTRAINT "test_case_statuses_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex (unique per project)
CREATE UNIQUE INDEX "test_case_priorities_project_id_value_key" ON "test_case_priorities"("project_id", "value");
CREATE UNIQUE INDEX "test_case_statuses_project_id_value_key" ON "test_case_statuses"("project_id", "value");

-- Re-add FK from test_cases
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_priority_id_fkey" FOREIGN KEY ("priority_id") REFERENCES "test_case_priorities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "test_case_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
