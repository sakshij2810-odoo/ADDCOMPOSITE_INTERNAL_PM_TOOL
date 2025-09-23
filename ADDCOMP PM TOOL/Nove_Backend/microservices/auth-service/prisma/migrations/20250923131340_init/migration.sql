-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('EMPLOYEE', 'PROJECT_MANAGER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "googleId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatarUrl" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'EMPLOYEE',
    "department" TEXT,
    "position" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "userFactId" INTEGER,
    "userUuid" TEXT,
    "status" TEXT DEFAULT 'ACTIVE',
    "createdByUuid" TEXT,
    "createdByName" TEXT,
    "createTs" TIMESTAMP(3),
    "insertTs" TIMESTAMP(3),
    "userDimId" INTEGER,
    "roleUuid" TEXT,
    "roleValue" TEXT,
    "userProfileId" INTEGER,
    "personalEmail" TEXT,
    "jobTitle" TEXT,
    "userType" TEXT,
    "assignedPhoneNumber" TEXT,
    "sharedEmail" TEXT,
    "mobile" TEXT,
    "homePhone" TEXT,
    "linkedinProfile" TEXT,
    "hireDate" TIMESTAMP(3),
    "lastDayAtWork" TIMESTAMP(3),
    "fax" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "motherMaidenName" TEXT,
    "photo" TEXT,
    "signature" TEXT,
    "streetAddress" TEXT,
    "unitOrSuite" TEXT,
    "city" TEXT,
    "csr" TEXT,
    "csrCode" TEXT,
    "marketer" TEXT,
    "marketerCode" TEXT,
    "producerOne" TEXT,
    "producerOneCode" TEXT,
    "producerTwo" TEXT,
    "producerTwoCode" TEXT,
    "producerThree" TEXT,
    "producerThreeCode" TEXT,
    "branchCode" TEXT,
    "provinceOrState" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "languagesKnown" TEXT,
    "documents" TEXT,
    "branchName" TEXT,
    "branchUuid" TEXT,
    "referralCode" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch" (
    "id" SERIAL NOT NULL,
    "branchUuid" TEXT NOT NULL,
    "branchName" TEXT NOT NULL,
    "branchCode" TEXT,
    "branchEmail" TEXT,
    "branchLogo" TEXT,
    "description" TEXT,
    "branchPhoneNo" TEXT,
    "branchMobileNo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdByUuid" TEXT,
    "createdByName" TEXT,
    "modifiedByUuid" TEXT,
    "modifiedByName" TEXT,
    "createTs" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "insertTs" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_userFactId_key" ON "users"("userFactId");

-- CreateIndex
CREATE UNIQUE INDEX "users_userUuid_key" ON "users"("userUuid");

-- CreateIndex
CREATE UNIQUE INDEX "branch_branchUuid_key" ON "branch"("branchUuid");
