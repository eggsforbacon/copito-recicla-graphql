-- Step 1: Add a temporary column for the float conversion
ALTER TABLE "Reciclyng" ADD COLUMN "weight_tmp" DOUBLE PRECISION;

-- Step 2: Copy data, converting or replacing NULLs
UPDATE "Reciclyng" SET "weight_tmp" = COALESCE("weight"::DOUBLE PRECISION, 0.0);

-- Step 3: Drop the old column
ALTER TABLE "Reciclyng" DROP COLUMN "weight";

-- Step 4: Rename the temporary column to the original name
ALTER TABLE "Reciclyng" RENAME COLUMN "weight_tmp" TO "weight";

-- Step 5: Set NOT NULL constraint
ALTER TABLE "Reciclyng" ALTER COLUMN "weight" SET NOT NULL;
