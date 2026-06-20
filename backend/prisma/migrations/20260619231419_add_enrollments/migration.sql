/*
  Warnings:

  - You are about to drop the column `studentId` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Grade` table. All the data in the column will be lost.
  - Added the required column `enrollmentId` to the `Grade` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Grade` DROP FOREIGN KEY `Grade_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `Grade` DROP FOREIGN KEY `Grade_subjectId_fkey`;

-- DropIndex
DROP INDEX `Grade_studentId_idx` ON `Grade`;

-- DropIndex
DROP INDEX `Grade_studentId_subjectId_idx` ON `Grade`;

-- DropIndex
DROP INDEX `Grade_subjectId_idx` ON `Grade`;

-- AlterTable
ALTER TABLE `Grade` DROP COLUMN `studentId`,
    DROP COLUMN `subjectId`,
    ADD COLUMN `enrollmentId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Enrollment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Enrollment_studentId_idx`(`studentId`),
    INDEX `Enrollment_subjectId_idx`(`subjectId`),
    UNIQUE INDEX `Enrollment_studentId_subjectId_key`(`studentId`, `subjectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Grade_enrollmentId_idx` ON `Grade`(`enrollmentId`);

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grade` ADD CONSTRAINT `Grade_enrollmentId_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `Enrollment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
