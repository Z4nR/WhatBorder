import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePlaceDto, GeoJson } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PrismaService } from 'src/db/prisma.service';
import { Place } from './entities/place.entity';
import { HelperService } from '../helper-service/helper.service';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class PlaceService {
  constructor(
    private readonly prisma: PrismaService,
    private helperService: HelperService,
  ) {}

  // All Access
  async findBuilding() {
    try {
      const buildings = await this.prisma.buildingType.findMany({
        select: {
          building_id: true,
          name: true,
          label: true,
          color: true,
        },
      });

      return buildings.map((building) => ({
        ...building,
        building_id: building.building_id.toString(),
      }));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.placeData.findMany({
        select: {
          place_id: true,
          place_name: true,
          place_address: true,
          type: {
            select: {
              name: true,
              label: true,
            },
          },
          created_by: true,
          created_at: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(place_id: string) {
    try {
      return await this.prisma.placeData.findUnique({
        select: {
          place_name: true,
          place_owner: true,
          place_address: true,
          place_description: true,
          place_center_point: true,
          created_by: true,
          updated_at: true,
          type: {
            select: {
              color: true,
              label: true,
              name: true,
            },
          },
          place_map: {
            select: {
              place_geojson: true,
            },
          },
          user: {
            select: {
              user_id: true,
            },
          },
        },
        where: {
          place_id,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // User Access
  async validatePlaceExist(placeName: string, placeGeojson: GeoJson) {
    try {
      const place = await this.helperService.checkingPlaceName(placeName);
      const map = await this.helperService.checkingPlaceMap(placeGeojson);

      if (place)
        throw new ConflictException(
          'Nama tempat sudah ditambahkan oleh orang lain',
        );
      if (map)
        throw new ConflictException('Lokasi sudah ditambahkan oleh orang lain');
      if (place && map)
        throw new ConflictException(
          'Nama dan Lokasi sudah ditambahkan oleh orang lain',
        );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(user_id: string, name: string, createPlaceDto: CreatePlaceDto) {
    const plainGeojson = instanceToPlain(createPlaceDto.placeGeojson);
    console.log(plainGeojson);

    try {
      await this.prisma.$transaction(async (tx) => {
        const placeMap = await tx.placeMap.create({
          data: {
            place_geojson: plainGeojson,
            created_by: name,
          },
          select: {
            map_id: true,
          },
        });

        const buildingType = await tx.buildingType.findFirst({
          select: {
            building_id: true,
          },
          where: {
            name: createPlaceDto.placeType,
          },
        });

        await tx.placeData.create({
          data: {
            place_name: createPlaceDto.placeName,
            place_address: createPlaceDto.placeAddress,
            place_owner: createPlaceDto.placeOwner ?? null,
            place_description: createPlaceDto.placeDescription ?? null,
            place_center_point: createPlaceDto.placePoints,
            type_id: buildingType.building_id,
            map_id: placeMap.map_id,
            created_by: name,
            user_id,
          },
        });
      });

      return { message: 'Data tempat berhasil berhasil ditambahkan' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async compareList(id: string) {
    try {
      const { place_center_point } = await this.prisma.placeData.findUnique({
        select: {
          place_center_point: true,
        },
        where: {
          place_id: id,
        },
      });

      const compare = await this.prisma.placeData.findMany({
        where: {
          NOT: {
            place_id: id,
          },
        },
        select: {
          place_id: true,
          place_name: true,
          place_address: true,
          place_center_point: true,
          type: {
            select: {
              name: true,
              label: true,
            },
          },
          place_map: {
            select: {
              place_geojson: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      console.log(compare);

      const dataCompare: any[] = [];
      compare.map((place: any) => {
        const rangeCount = this.helperService.rangeCount(
          place_center_point[0],
          place.place_center_point[0],
          place_center_point[1],
          place.place_center_point[1],
        );
        console.log(rangeCount);

        if (rangeCount < 5) {
          dataCompare.push({
            ...place,
            rangePlace: `+- ${rangeCount} M`,
          });
        }
      });

      return dataCompare;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findPlaceUser(user_id: string) {
    console.log(user_id);

    try {
      return await this.prisma.placeData.findMany({
        select: {
          place_id: true,
          place_name: true,
          place_address: true,
          place_center_point: true,
          place_map: {
            select: {
              place_geojson: true,
            },
          },
          type: {
            select: {
              name: true,
              label: true,
            },
          },
          created_at: true,
        },
        where: {
          user_id,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findPlaceAdmin() {
    try {
      return await this.prisma.placeData.findMany({
        select: {
          place_id: true,
          place_name: true,
          place_address: true,
          place_center_point: true,
          place_map: {
            select: {
              place_geojson: true,
            },
          },
          type: {
            select: {
              name: true,
              label: true,
            },
          },
          created_at: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async statisticUser(user_id: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the month
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    ); // Last day of the month

    try {
      const totalPlaceCount = await this.prisma.placeData.count({
        where: {
          user_id,
        },
      });
      const totalPlaceCountByMonth = await this.prisma.placeData.count({
        where: {
          user_id,
          created_at: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
      });

      const buildingCount = await this.prisma.buildingType.findMany({
        select: {
          name: true,
          color: true,
          _count: {
            select: {
              PlaceData: {
                where: {
                  user_id,
                },
              },
            },
          },
        },
      });

      const newestPlace = await this.prisma.placeData.findMany({
        take: 10,
        orderBy: {
          created_at: 'desc',
        },
        select: {
          place_name: true,
          type: {
            select: {
              name: true,
              label: true,
            },
          },
          place_id: true,
          created_at: true,
        },
        where: {
          user_id,
        },
      });

      const building = buildingCount.map((item) => ({
        buildingName: item.name,
        color: item.color,
        placeCount: item._count.PlaceData,
      }));

      const newest = newestPlace.map((item) => ({
        placeId: item.place_id,
        placeName: item.place_name,
        placeType: item.type,
        createdAt: item.created_at,
      }));

      return {
        total_place: totalPlaceCount,
        total_place_this_month: totalPlaceCountByMonth,
        detail: building,
        new_place: newest,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(
    place_id: string,
    user_id: string,
    userName: string,
    updatePlaceDto: UpdatePlaceDto,
  ) {
    const updatePlaceData: Place = {
      place_name: updatePlaceDto.placeName,
      place_address: updatePlaceDto.placeAddress,
      place_description: updatePlaceDto.placeDescription,
      place_owner: updatePlaceDto.placeOwner,
      place_type: updatePlaceDto.placeType,
      updated_by: userName,
    };

    try {
      await this.prisma.$transaction(async (tx) => {
        const mapId = await this.prisma.placeData.findFirst({
          select: {
            map_id: true,
          },
          where: {
            place_id,
            user_id,
          },
        });

        if (!mapId) {
          throw new Error(
            'Place not found or you do not have permission to update it',
          );
        }

        await tx.placeData.update({
          data: updatePlaceData,
          where: {
            place_id,
            user_id,
          },
        });

        if (updatePlaceDto.placeGeojson !== undefined) {
          const plainGeojson = instanceToPlain(updatePlaceDto.placeGeojson);
          console.log(plainGeojson);

          await tx.placeMap.update({
            data: {
              place_geojson: plainGeojson,
              updated_by: userName,
            },
            where: {
              map_id: mapId.map_id,
            },
          });
        }
      });
      return { message: 'Data Berhasil Diperbarui' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async remove(place_id: string, user_id: string) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const mapId = await tx.placeData.findUnique({
          select: {
            map_id: true,
          },
          where: {
            place_id,
            user_id,
          },
        });

        await tx.placeMap.delete({
          where: {
            map_id: mapId.map_id,
          },
        });

        await tx.placeData.delete({
          where: {
            place_id,
            user_id,
          },
        });
      });
      return { message: 'Data tempat berhasil dihapus' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Admin Access
  async adminPlaceList() {
    try {
      const data = await this.prisma.placeData.findMany({
        select: {
          place_id: true,
          place_owner: true,
          place_description: true,
          place_name: true,
          place_address: true,
          place_center_point: true,
          created_by: true,
          created_at: true,
          updated_at: true,
          type: {
            select: {
              name: true,
              label: true,
              color: true,
            },
          },
          place_map: {
            select: {
              place_geojson: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private async buildingCountCreate() {
    try {
      const now = new Date();
      const someMonthsAgo = new Date();
      someMonthsAgo.setMonth(now.getMonth() - 6); // few months ago to include the current month

      // Fetch building data with associated places
      const buildingData = await this.prisma.buildingType.findMany({
        select: {
          name: true,
          color: true,
          PlaceData: {
            where: {
              created_at: { gte: someMonthsAgo },
            },
            select: {
              created_at: true,
            },
          },
        },
      });

      // Generate an array of last 12 months
      const lastMonthsAgo: string[] = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(now.getMonth() - i);
        return this.helperService.formatMonth(date);
      }).reverse(); // Ensure chronological order

      // Process the results
      const formattedData: {
        buildingName: string;
        color: string;
        month: string;
        placeCount: number;
      }[] = [];

      buildingData.forEach((building) => {
        // Initialize monthly counts to 0
        const monthlyCounts: Record<string, number> = lastMonthsAgo.reduce(
          (acc, month) => {
            acc[month] = 0;
            return acc;
          },
          {} as Record<string, number>,
        );

        // Count occurrences per month
        building.PlaceData.forEach((place) => {
          const monthKey = this.helperService.formatMonth(
            new Date(place.created_at),
          );
          if (monthKey in monthlyCounts) {
            monthlyCounts[monthKey] = (monthlyCounts[monthKey] ?? 0) + 1;
          }
        });

        // Convert data into the required array format (object, not array!)
        Object.entries(monthlyCounts).forEach(([month, totalCount]) => {
          formattedData.push({
            buildingName: building.name,
            color: building.color,
            month,
            placeCount: totalCount,
          });
        });
      });

      return formattedData;
    } catch (error) {
      console.error('Error in buildingCount:', error);
      throw error;
    }
  }

  private async buildingCountUpdate() {
    try {
      const now = new Date();
      const someMonthsAgo = new Date();
      someMonthsAgo.setMonth(now.getMonth() - 4); // 3 months ago

      // Fetch building data with associated places
      const buildingData = await this.prisma.buildingType.findMany({
        select: {
          name: true,
          color: true,
          PlaceData: {
            where: {
              updated_at: { gte: someMonthsAgo },
            },
            select: {
              created_at: true,
              updated_at: true,
            },
          },
        },
      });

      // Generate last 3 months' keys
      const lastMonthsAgo: string[] = Array.from({ length: 4 }, (_, i) => {
        const date = new Date();
        date.setMonth(now.getMonth() - i);
        return this.helperService.formatMonth(date);
      }).reverse();

      // Process the results
      const formattedData: {
        buildingName: string;
        color: string;
        month: string;
        placeCount: number;
      }[] = [];

      buildingData.forEach((building) => {
        // Initialize monthly counts
        const monthlyCounts: Record<string, number> = Object.fromEntries(
          lastMonthsAgo.map((month) => [month, 0]),
        );

        // Process only places where updated_at !== created_at
        building.PlaceData.forEach((place) => {
          if (place.updated_at !== place.created_at) {
            const monthKey = this.helperService.formatMonth(
              new Date(place.updated_at),
            );
            if (monthKey in monthlyCounts) {
              monthlyCounts[monthKey]++;
            }
          }
        });

        // Convert data into the required format
        Object.entries(monthlyCounts).forEach(([month, totalCount]) => {
          formattedData.push({
            buildingName: building.name,
            color: building.color,
            month,
            placeCount: totalCount,
          });
        });
      });

      return formattedData;
    } catch (error) {
      console.error('Error in buildingCount:', error);
      throw error;
    }
  }

  private async buildingCountAdmin() {
    try {
      const created = await this.buildingCountCreate();
      const updated = await this.buildingCountUpdate();

      return {
        create: created,
        update: updated,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async statisticAdmin() {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the month
    const endOfThisMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    ); // Last day of the month

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); // First day of last month
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999,
    ); // Last day of last month

    try {
      const totalPlaceCount = await this.prisma.placeData.count();

      const totalPlaceCountThisMonth = await this.prisma.placeData.count({
        where: {
          created_at: {
            gte: startOfThisMonth,
            lt: endOfThisMonth,
          },
        },
      });

      const totalPlaceCountLastMonth = await this.prisma.placeData.count({
        where: {
          created_at: {
            gte: startOfLastMonth,
            lt: endOfLastMonth,
          },
        },
      });

      const buildingCountInMonth = await this.buildingCountAdmin();

      const buildingCountPlaceType = await this.prisma.buildingType.findMany({
        select: {
          name: true,
          color: true,
          _count: {
            select: {
              PlaceData: true,
            },
          },
        },
      });

      const countPlaceType = buildingCountPlaceType.map((item) => ({
        buildingName: item.name,
        color: item.color,
        placeCount: item._count.PlaceData,
      }));

      const buildingCountPlaceArea = await this.prisma.placeData.findMany({
        select: {
          place_id: true,
          place_name: true,
          place_owner: true,
          place_center_point: true,
        },
      });

      const centerPointPlace = buildingCountPlaceArea.map((item) => ({
        place_id: item.place_id,
        place_name: item.place_name,
        place_owner: item.place_owner,
        place_center_long: item.place_center_point[0],
        place_center_lat: item.place_center_point[1],
      }));

      const newestPlace = await this.prisma.placeData.findMany({
        take: 10,
        orderBy: {
          created_at: 'desc',
        },
        select: {
          place_name: true,
          type: {
            select: {
              name: true,
              label: true,
            },
          },
          place_id: true,
          created_at: true,
        },
      });

      const newest = newestPlace.map((item) => ({
        placeId: item.place_id,
        placeName: item.place_name,
        placeType: item.type,
        createdAt: item.created_at,
      }));

      // Calculate percentage change
      let percentageChange = 0;
      if (totalPlaceCountLastMonth > 0) {
        percentageChange =
          ((totalPlaceCountThisMonth - totalPlaceCountLastMonth) /
            totalPlaceCountLastMonth) *
          100;
      } else if (totalPlaceCountThisMonth > 0) {
        percentageChange = 100;
      } else {
        percentageChange = 0;
      }

      const statusPercentage =
        percentageChange === 0
          ? 'stabil'
          : percentageChange < 0
            ? 'decrease'
            : 'increase';
      const formattedPercentage =
        percentageChange < 0
          ? percentageChange.toFixed(2) // Negative Value
          : percentageChange.toFixed(2); // Positive Value

      console.log(`Percentage change: ${formattedPercentage}`);

      return {
        total_place: totalPlaceCount,
        total_place_this_month: totalPlaceCountThisMonth,
        percentage_comparison: formattedPercentage,
        status_percentage: statusPercentage,
        chart_create: buildingCountInMonth.create,
        chart_update: buildingCountInMonth.update,
        chart_type: countPlaceType,
        chart_area: centerPointPlace,
        new_place: newest,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
