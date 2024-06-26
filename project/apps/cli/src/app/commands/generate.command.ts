import { PrismaClient } from '@prisma/client';
import { ICommand } from './index.js';
import { Product, TMockServerData } from '@project/shared/core';
import { MockItemGenerator } from '@project/shared/helpers';
import { getErrorMessage } from '@project/shared/helpers';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

function isMockServerData(value: unknown): value is TMockServerData {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.hasOwn(value, 'names') &&
    Object.hasOwn(value, 'descriptions') &&
    Object.hasOwn(value, 'photos') &&
    Object.hasOwn(value, 'types') &&
    Object.hasOwn(value, 'stringCount')
  );
}

export class GenerateCommand implements ICommand {
  private readonly _name: string = '--generate';
  private _data: Product[] = [];
  private _initialData: TMockServerData;
  private _prismaClient: PrismaClient = new PrismaClient();

  constructor(
    private mockFileDefault = 'mock-server-data.json',
  ) { }

  private async load() {
    try {
      const jsonContent = await readFile(resolve('./assets/', this.mockFileDefault), { encoding: 'utf-8' });
      const importedContent: unknown = JSON.parse(jsonContent);

      if (!isMockServerData(importedContent)) {
        throw new Error('Failed to parse json content.');
      }

      this._initialData = importedContent;
    } catch {
      throw new Error(`Can't load data from ${resolve('./assets/', this.mockFileDefault)}`);
    }
  }

  private async write(itemCount: number) {
    const mockGenerator = new MockItemGenerator(this._initialData);
    try {
      for (let i = 0; i < itemCount; i++) {
        const item = mockGenerator.generate() as unknown as Product;
        this._data.push(item);

        await this._prismaClient.product.upsert({
          where: { id: item.id },
          update: {},
          create: {
            id: item.id,
            name: item.name,
            description: item.description,
            photo: item.photo,
            type: item.type,
            article: item.article,
            stringCount: item.stringCount,
            price: item.price,
          }
        })
      }
    } catch (error: unknown) {
      console.error(getErrorMessage(error));
      globalThis.process.exit(1);
    } finally {
      await this._prismaClient.$disconnect();
    }
  }

  public get name(): string {
    return this._name;
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count] = parameters;
    const itemCount = Number.parseInt(count, 10);

    if (!itemCount) {
      throw new Error(`Can't generate the mock data because the required parameter "count" is not passed`);
    }

    try {
      await this.load();
      await this.write(itemCount);
      console.info(`the elements have been created!`);
    } catch (error: unknown) {
      console.error('Can\'t generate data');
      console.error(getErrorMessage(error));
    }
  }
}
