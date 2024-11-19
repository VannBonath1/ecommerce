import { Injectable, UseGuards } from '@nestjs/common';
import { Shop } from './shop.entity';
import { AlreadyExistsError } from 'src/filters/already-exist-error.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundExceptionCustom } from 'src/filters/not-found.exception';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { CannotCreateShopForOtherAccountError } from 'src/filters/cannot-create-shop-for-other-account.error';
import { Repository } from 'typeorm';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
  ) {}

  async createShop(
    userId: number,
    shopName: string,
    location: string,
    userSub: number,
  ): Promise<Shop> {
    try {
      const existingShop = await this.shopRepository.findOne({
        where: { shopName: shopName },
      });
      if (existingShop) {
        throw new AlreadyExistsError('shop already exist');
      }

      if (userId !== userSub) {
        throw new CannotCreateShopForOtherAccountError('');
      }

      const newShop = this.shopRepository.create({
        userId,
        shopName,
        location,
      });
      return await this.shopRepository.save(newShop);
    } catch (error) {
      throw error;
    }
  }

  async deleteShop(
    shopId: number,
    userSub: number,
    userId: number,
  ): Promise<void> {
    try {
      const existingShop = await this.shopRepository.findOne({
        where: { id: shopId },
      });

      if (userId !== userSub) {
        throw new CannotCreateShopForOtherAccountError(
          'cant Delete other user shop',
        );
      }

      if (!existingShop) {
        throw new NotFoundExceptionCustom('already deleted');
      }

      await this.shopRepository.delete(shopId);
    } catch (error) {
      throw error;
    }
  }

  async updateShop(
    shopId: number,
    userId: number,
    newShopName: string,
    newLocation: string,
    userSub: number,
  ): Promise<Shop> {
    try {
      const existingShop = await this.shopRepository.findOne({
        where: { id: shopId },
      });

      if (!existingShop) {
        throw new NotFoundExceptionCustom('shop not found');
      }

      // Ensure that the user is updating their own shop
      if (userId !== userSub) {
        throw new CannotCreateShopForOtherAccountError(
          'You can only update your own shop',
        );
      }

      // Check if the new shop name already exists
      const existingShopWithNewName = await this.shopRepository.findOne({
        where: { shopName: newShopName },
      });

      if (existingShopWithNewName) {
        throw new AlreadyExistsError('this shop name is already taken');
      }

      // update
      existingShop.shopName = newShopName;
      existingShop.location = newLocation;

      return await this.shopRepository.save(existingShop);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
