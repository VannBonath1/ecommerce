import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { Shop } from './shop.entity';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Role } from '../role/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Role('Merchant')
@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

  @Post('')
  async createShop(
    @Request() req,
    @Body()
    createShopDto: {
      userId: number;
      shopName: string;
      location: string;
    },
  ): Promise<Shop> {
    const { shopName, location, userId } = createShopDto;
    return await this.shopService.createShop(
      userId,
      shopName,
      location,
      req.user.userId,
    );
  }

  @Delete(':id')
  async deteleShop(
    @Param('id') shopId: number,
    @Request() req,
    @Body() deleteDto: { userId: number },
  ): Promise<string> {
    const { userId } = deleteDto;
    await this.shopService.deleteShop(shopId, req.user.userId, userId);
    return 'delete Successfully';
  }

  @Put(':id')
  async updateShop(
    @Param('id') shopId: number,
    @Body()
    newShopDto: { userId: number; newShopName: string; newLocation: string },
    @Request() req,
  ): Promise<Shop> {
    return await this.shopService.updateShop(
      shopId,
      newShopDto.userId,
      newShopDto.newShopName,
      newShopDto.newLocation,
      req.user.userId,
    );
  }
}
