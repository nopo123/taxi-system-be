import { GetRolesDto } from '../dto/get-roles.dto';
import { RolesEntity } from '../entities/roles.entity';

export const mapRoleToGetRoleDto = (worker: RolesEntity): GetRolesDto => {
  return {
    created: worker.created.toString(),
    id: worker.id,
    type: worker.type,
    updated: worker.updated.toString(),
  };
};