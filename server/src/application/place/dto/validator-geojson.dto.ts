import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  ValidateNested,
  IsObject,
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

class Geometry {
  @IsArray()
  @ArrayNotEmpty()
  @IsArray({ each: true }) // Ensures each element inside is also an array
  @ArrayNotEmpty({ each: true }) // Ensures each group is not empty
  @IsArray({ each: true }) // Ensures the coordinate pairs are arrays
  @ArrayNotEmpty({ each: true }) // Ensures coordinate pairs are not empty
  @IsNumber({}, { each: true }) // Ensures numbers inside are valid
  @Type(() => Number)
  coordinates: number[][][];

  @IsString()
  @IsNotEmpty()
  type: string;
}

class Properties {
  @IsString()
  @IsNotEmpty()
  copyright: string;

  @IsString()
  @IsNotEmpty()
  creator: string;
}

class Feature {
  @IsObject()
  @ValidateNested()
  @Type(() => Geometry)
  geometry: Geometry;

  @IsObject()
  @ValidateNested()
  @Type(() => Properties)
  properties: Properties;

  @IsString()
  @IsNotEmpty()
  type: string;
}

export class FeatureCollection {
  @IsArray()
  @ArrayNotEmpty()
  features: Feature[];

  @IsString()
  @IsNotEmpty()
  type: string;
}
