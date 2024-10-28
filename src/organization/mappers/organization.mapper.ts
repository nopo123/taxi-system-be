import { mapUserToGetUserDto } from "../../user/mappers/user.mapper";
import { GetOrganizationDto } from "../dto/get-organization.dto";
import { OrganizationEntity } from "../entities/organization.entity";

export const mapOrganizationToGetOrganizationDto = (organization: OrganizationEntity): GetOrganizationDto => {
  return {
    id: organization.id,
    name: organization.name,
    address: organization.address,
    users: organization.users ? organization.users.map(user => mapUserToGetUserDto(user)) : [],
  };
}
