-- AlterTable
ALTER TABLE `Enrollment` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Grade` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Notice` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Subject` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `Enrollment_deletedAt_idx` ON `Enrollment`(`deletedAt`);

-- CreateIndex
CREATE INDEX `Enrollment_studentId_deletedAt_idx` ON `Enrollment`(`studentId`, `deletedAt`);

-- CreateIndex
CREATE INDEX `Enrollment_subjectId_deletedAt_idx` ON `Enrollment`(`subjectId`, `deletedAt`);

-- CreateIndex
CREATE INDEX `Grade_deletedAt_idx` ON `Grade`(`deletedAt`);

-- CreateIndex
CREATE INDEX `Grade_enrollmentId_deletedAt_idx` ON `Grade`(`enrollmentId`, `deletedAt`);

-- CreateIndex
CREATE INDEX `Notice_deletedAt_idx` ON `Notice`(`deletedAt`);

-- CreateIndex
CREATE INDEX `Notice_deletedAt_createdAt_idx` ON `Notice`(`deletedAt`, `createdAt`);

-- CreateIndex
CREATE INDEX `Subject_deletedAt_idx` ON `Subject`(`deletedAt`);

-- CreateIndex
CREATE INDEX `User_deletedAt_idx` ON `User`(`deletedAt`);
