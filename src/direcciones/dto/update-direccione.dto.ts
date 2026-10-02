import { PartialType } from '@nestjs/swagger';
import { CreateDireccionDto } from './create-direccione.dto.js';

export class UpdateDireccioneDto extends PartialType(CreateDireccionDto) {}
