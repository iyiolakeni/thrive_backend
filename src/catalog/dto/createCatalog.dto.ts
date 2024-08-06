import { ApiProperty } from "@nestjs/swagger";

export class CreateCatalogDto {
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  productTracker: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  brandName: string;

  @ApiProperty()
  modelNumber: string;

  @ApiProperty()
  shortDescription: string;

  @ApiProperty()
  longDescription: string;

  @ApiProperty()
  images: string[];

  @ApiProperty()
  price: number;

  @ApiProperty()
  discountPrice: number;

  @ApiProperty()
  availabilityStatus: boolean;

  @ApiProperty()
  shippingCost: number;

  @ApiProperty()
  warrantyInformation: string;

  @ApiProperty()
  returnPolicy: string;
}