import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PaginationResult, Product } from '@project/shared/core';
import { BasePostgresRepository } from '@project/data-access';
import { PrismaClientService } from '@project/models';

import { ShopProductEntity } from './shop-product.entity';
import { ShopProductFactory } from './shop-product.factory';
import { ShopQuery } from './query/shop-product.query';

@Injectable()
export class ShopProductRepository extends BasePostgresRepository<ShopProductEntity, Product> {
  constructor(
    entityFactory: ShopProductFactory,
    readonly client: PrismaClientService,
  ) {
    super(entityFactory, client)
  }

  private calculateProductPageCount(totalCount: number, limit: number): number {
    return Math.ceil(totalCount / limit);
  }

  public async getProductCount(where: Prisma.PostWhereInput): Promise<number> {
    return this.client.product.count({ where });
  }

  public async save(entity: ShopProductEntity): Promise<ShopProductEntity> {
    const record = await this.client.product.create({
      data: {
        ...entity
      },
    });

    entity.id = record.id;

    return entity;
  }

  public async deleteById(id: string): Promise<void> {
    await this.client.product.delete({
      where: {
        id
      }
    });
  }

  public async findById(id: string): Promise<ShopProductEntity> {
    const document = await this.client.product.findFirst({
      where: {
        id,
      }
    });

    if (!document) {
      throw new NotFoundException(`Product with id ${id} not found.`);
    }

    return this.createEntityFromDocument(document);
  }

  public async update(entity: ShopProductEntity): Promise<ShopProductEntity> {
    const record = await this.client.product.update({
      where: { id: entity.id },
      data: {
        ...entity
      }
    });

    return this.createEntityFromDocument(record);
  }

  public async findByQuery(query?: ShopQuery): Promise<PaginationResult<ShopProductEntity>> {
    const skip = query?.page && query?.limit ? (query.page - 1) * query.limit : undefined;
    const take = query?.limit;
    const where: Prisma.PostWhereInput = {};
    const orderBy: Prisma.PostOrderByWithRelationInput = {};

    if (query?.sortDirection) {
      orderBy.createdAt = query.sortDirection;
    }

    const [records, postCount] = await Promise.all([
      this.client.post.findMany({
        where, orderBy, skip, take,
        include: {
          comments: true,
        },
      }),
      this.getProductCount(where),
    ]);

    return {
      entities: records.map((record) => this.createEntityFromDocument(record)),
      currentPage: query?.page,
      totalPages: this.calculateProductPageCount(postCount, take),
      itemsPerPage: take,
      totalItems: postCount,
    }
  }
}