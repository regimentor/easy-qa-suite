/*
  Warnings:

  - You are about to drop the column `priority` on the `test_cases` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `test_cases` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `test_suites` table. All the data in the column will be lost.
  - Added the required column `priority_id` to the `test_cases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_id` to the `test_cases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_id` to the `test_suites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "test_cases" DROP COLUMN "priority",
DROP COLUMN "status",
ADD COLUMN     "priority_id" BIGINT NOT NULL,
ADD COLUMN     "status_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "test_suites" DROP COLUMN "type",
ADD COLUMN     "type_id" BIGINT NOT NULL;

-- CreateTable
CREATE TABLE "test_case_priorities" (
    "id" BIGSERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_case_priorities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_case_statuses" (
    "id" BIGSERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_case_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_suite_types" (
    "id" BIGSERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_suite_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "test_case_priorities_value_key" ON "test_case_priorities"("value");

-- CreateIndex
CREATE UNIQUE INDEX "test_case_statuses_value_key" ON "test_case_statuses"("value");

-- CreateIndex
CREATE UNIQUE INDEX "test_suite_types_value_key" ON "test_suite_types"("value");

-- AddForeignKey
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_priority_id_fkey" FOREIGN KEY ("priority_id") REFERENCES "test_case_priorities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "test_case_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_suites" ADD CONSTRAINT "test_suites_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "test_suite_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
