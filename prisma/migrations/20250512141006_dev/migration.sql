-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "tokens" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "course_code" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentGroup" (
    "id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AssignmentGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" INTEGER NOT NULL,
    "assignment_group_id" INTEGER NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Course_user_id_key" ON "Course"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentGroup_course_id_key" ON "AssignmentGroup"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_assignment_group_id_key" ON "Assignment"("assignment_group_id");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentGroup" ADD CONSTRAINT "AssignmentGroup_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_assignment_group_id_fkey" FOREIGN KEY ("assignment_group_id") REFERENCES "AssignmentGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
