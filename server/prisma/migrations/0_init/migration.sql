-- CreateTable
CREATE TABLE "Role" (
    "role_id" STRING NOT NULL,
    "role_name" STRING(30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "active_status" BOOL NOT NULL DEFAULT true,
    "role_code" INT4,
    "label" STRING(8),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" STRING NOT NULL,
    "user_name" STRING(10) NOT NULL,
    "full_name" STRING(30),
    "password" STRING NOT NULL,
    "description" STRING,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "special_code" STRING NOT NULL,
    "login_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role_code" INT4 DEFAULT 3,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "BuildingType" (
    "building_id" INT8 NOT NULL DEFAULT unique_rowid(),
    "name" STRING NOT NULL,
    "color" STRING NOT NULL,
    "active_status" BOOL NOT NULL DEFAULT true,
    "created_by" STRING,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" STRING,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "label" STRING NOT NULL DEFAULT '',
    "build_code" INT4,

    CONSTRAINT "BuildingType_pkey" PRIMARY KEY ("building_id")
);

-- CreateTable
CREATE TABLE "PlaceData" (
    "place_id" STRING NOT NULL,
    "place_name" STRING NOT NULL,
    "place_owner" STRING,
    "place_address" STRING NOT NULL,
    "place_description" STRING,
    "place_center_point" FLOAT8[],
    "map_id" STRING,
    "user_id" STRING,
    "created_by" STRING,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" STRING,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type_id" INT8,

    CONSTRAINT "PlaceData_pkey" PRIMARY KEY ("place_id")
);

-- CreateTable
CREATE TABLE "PlaceMap" (
    "map_id" STRING NOT NULL,
    "place_geojson" JSONB NOT NULL,
    "created_by" STRING,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" STRING,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaceMap_pkey" PRIMARY KEY ("map_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_code_key" ON "Role"("role_code");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_name_key" ON "User"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "buildingtype_build_code_idx" ON "BuildingType"("build_code");

-- CreateIndex
CREATE UNIQUE INDEX "PlaceData_map_id_key" ON "PlaceData"("map_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "FK_user_role_code" FOREIGN KEY ("role_code") REFERENCES "Role"("role_code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceData" ADD CONSTRAINT "FK_place_data_place_map" FOREIGN KEY ("map_id") REFERENCES "PlaceMap"("map_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceData" ADD CONSTRAINT "FK_place_data_type" FOREIGN KEY ("type_id") REFERENCES "BuildingType"("building_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceData" ADD CONSTRAINT "FK_place_data_user" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

