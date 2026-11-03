-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('XBOX', 'PS5');

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "rawgId" INTEGER,
    "title" TEXT NOT NULL,
    "coverUrl" TEXT,
    "platform" "Platform" NOT NULL,
    "playTimeHours" INTEGER NOT NULL,
    "storyScore" INTEGER NOT NULL,
    "gameplayScore" INTEGER NOT NULL,
    "artScore" INTEGER NOT NULL,
    "review" TEXT,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);
