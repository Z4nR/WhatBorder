-- CreateTable
CREATE TABLE "User" (
    "user_id" STRING NOT NULL,
    "user_name" STRING(10) NOT NULL,
    "full_name" STRING(30),
    "password" STRING NOT NULL,
    "admin" BOOL NOT NULL DEFAULT false,
    "description" STRING,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "PlaceData" (
    "place_id" STRING NOT NULL,
    "place_name" STRING NOT NULL,
    "place_owner" STRING,
    "place_address" STRING NOT NULL,
    "place_description" STRING,
    "place_type" STRING NOT NULL,
    "map_id" STRING NOT NULL,
    "user_id" STRING NOT NULL,
    "created_by" STRING,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" STRING,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaceData_pkey" PRIMARY KEY ("place_id")
);

-- CreateTable
CREATE TABLE "PlaceMap" (
    "map_id" STRING NOT NULL,
    "place_geojson" JSONB NOT NULL,
    "created_by" STRING,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" STRING,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaceMap_pkey" PRIMARY KEY ("map_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_name_key" ON "User"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "PlaceData_map_id_key" ON "PlaceData"("map_id");

-- CreateIndex
CREATE INDEX "PlaceData_user_id_idx" ON "PlaceData"("user_id");
