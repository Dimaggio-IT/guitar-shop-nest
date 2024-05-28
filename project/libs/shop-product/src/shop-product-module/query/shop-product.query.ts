import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

import { SortBy, SortDirection } from '@project/shared/core';

import {
  PRODUCT_DEFAULT_COUNT_LIMIT,
  PRODUCT_DEFAULT_SORT_DIRECTION,
  PRODUCT_DEFAULT_PAGE_COUNT,
  PRODUCT_DEFAULT_SORT_BY,
  GuitarType,
} from '../shop-product.constant';
import { ApiProperty } from '@nestjs/swagger';


export class ShopQuery {
  @ApiProperty({
    description: 'Limit',
    example: 7,
  })
  @Transform(({ value }) => +value || PRODUCT_DEFAULT_COUNT_LIMIT)
  @IsNumber()
  @IsOptional()
  public limit = PRODUCT_DEFAULT_COUNT_LIMIT;

  @ApiProperty({
    description: 'Type',
    example: 'text',
  })
  @IsIn(Object.values(GuitarType))
  @IsOptional()
  public guitarType?: GuitarType;

  @ApiProperty({
    description: 'String count',
    example: '12',
  })
  @IsIn(Object.values(GuitarType))
  @IsOptional()
  public stringCount?: GuitarType;

  @ApiProperty({
    description: 'Sort by',
    example: 'createdAt',
  })
  @IsIn(Object.values(SortBy))
  @IsOptional()
  public sortBy?: SortBy = PRODUCT_DEFAULT_SORT_BY;

  @ApiProperty({
    description: 'Sort direction',
    example: 'desc',
  })
  @IsIn(Object.values(SortDirection))
  @IsOptional()
  public sortDirection?: SortDirection = PRODUCT_DEFAULT_SORT_DIRECTION;

  @ApiProperty({
    description: 'Page',
    example: 1,
  })
  @Transform(({ value }) => +value || PRODUCT_DEFAULT_PAGE_COUNT)
  @IsOptional()
  public page: number = PRODUCT_DEFAULT_PAGE_COUNT;
}