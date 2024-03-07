import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @UseGuards(AuthGuard())
  @Post()
  create(
    @Body() createPropertyDto: CreatePropertyDto,
    @CurrentUser('email') email: string,
  ) {
    return this.propertiesService.create(createPropertyDto, email);
  }

  @UseGuards(AuthGuard())
  @Get()
  findAll(@CurrentUser('email') email: string) {
    return this.propertiesService.findAll(email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(+id);
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @CurrentUser('email') email: string,
  ) {
    return this.propertiesService.update(id, updatePropertyDto, email);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(+id);
  }
}
