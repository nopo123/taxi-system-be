import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { mapUserToGetUserDto } from './mappers/user.mapper';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enums/role.enum';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import {OrderService} from "../order/order.service";
import {OrganizationService} from "../organization/organization.service";
import {GetOrganizationDto} from "../organization/dto/get-organization.dto";
import {passwordHash} from "../common/helpers/password.helper";


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => OrganizationService))
    private readonly organizationService: OrganizationService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {}

  async create(
    body: CreateUserDto,
    loggedUser: UserEntity,
  ): Promise<GetUserDto> {
    const foundUser: UserEntity = await this.findUserByEmail(body.email);
    if (foundUser) {
      throw new InternalServerErrorException(
        'Nie je možné vytvoriť používateľa',
      );
    }

    const organization: GetOrganizationDto =
      await this.organizationService.findOne(
        body.organizationId || loggedUser.organizationId,
      );

    const createdUser: UserEntity = this.userRepository.create({
      ...body,
      organizationId: body.organizationId || loggedUser.organizationId,
      organization: organization || null,
      orders: [],
    });

    const savedUser = await this.userRepository.save(createdUser);

    return mapUserToGetUserDto(savedUser);
  }

  async createSuperAdmin(body: CreateSuperAdminDto): Promise<GetUserDto> {
    const isSuperAdmin: UserEntity = await this.userRepository.findOne({
      where: { role: Role.SUPER_ADMIN },
    });

    if (isSuperAdmin) {
      throw new InternalServerErrorException(
        'Nie je možné vytvoriť používateľa',
      );
    }

    const createdUser: UserEntity = this.userRepository.create({
      ...body,
      organizationId: null,
      organization: null,
      orders: [],
      role: Role.SUPER_ADMIN,
    });

    const savedUser = await this.userRepository.save(createdUser);

    return mapUserToGetUserDto(savedUser);
  }

  async createAdmin(CreateAdminDto: CreateUserDto, organizationId: number): Promise<GetUserDto> {
    const organization: GetOrganizationDto = await this.organizationService.findOne(organizationId);

    const createdUser: UserEntity = this.userRepository.create({
      ...CreateAdminDto,
      organizationId: organizationId,
      organization: organization,
      orders: [],
      role: Role.ADMIN,
    });

    const savedUser = await this.userRepository.save(createdUser);

    return mapUserToGetUserDto(savedUser);
  }

  async findAll(loggedUser: UserEntity): Promise<GetUserDto[]> {
    const users: UserEntity[] = await this.userRepository.find({
      where: {
        organizationId: loggedUser.organizationId,
      },
      relations: ['orders'],
    });
    return users.map((user: UserEntity) => mapUserToGetUserDto(user));
  }

  async findOne(id: number, loggedUser: UserEntity): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['orders'],
    });

    if (!user) {
      throw new NotFoundException('Používateľ nebol nájdený');
    }

    if (
      user.organizationId !== loggedUser.organizationId &&
      loggedUser.role !== Role.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Nemáte oprávnenie na zobrazenie tohto používateľa',
      );
    }

    return mapUserToGetUserDto(user);
  }

  async update(
    userId: number,
    body: UpdateUserDto,
    loggedUser: UserEntity,
  ): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (
      !user ||
      (user.organizationId !== loggedUser.organizationId &&
        loggedUser.role !== Role.SUPER_ADMIN)
    ) {
      throw new NotFoundException('Používateľ nebol nájdený');
    }
    const userByEmail = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (userByEmail && userByEmail.id !== user.id) {
      throw new ForbiddenException('Používateľ s týmto emailom už existuje');
    }

    const updatedUser = await this.userRepository.save({
      id: user.id,
      ...body,
    });

    // Map updated user entity to DTO
    return mapUserToGetUserDto(updatedUser);
  }

  async updatePassword(
    userId: number,
    body: UpdatePasswordDto,
    loggedUser: UserEntity,
  ): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Používateľ nebol nájdený');
    }

    if (
      user.organizationId !== loggedUser.organizationId &&
      loggedUser.role !== Role.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Nemáte oprávnenie na zmenu hesla tohto používateľa',
      );
    }

    if (body.password !== body.confirmPassword) {
      throw new ForbiddenException('Heslá sa nezhodujú');
    }

    const updatedUser = await this.userRepository.save({
      id: user.id,
      ...user,
      password: await passwordHash(body.password),
    });

    return mapUserToGetUserDto(updatedUser);
  }

  async delete(userId: number, loggedUser: UserEntity): Promise<void> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['orders'],
    });

    if (!user) {
      throw new NotFoundException('Používateľ nebol nájdený');
    }

    if (
      user.organizationId !== loggedUser.organizationId &&
      loggedUser.role !== Role.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Nemáte oprávnenie na zmazanie tohto používateľa',
      );
    }

    for (const order of user.orders) {
      await this.orderService.delete(order.id);
    }

    await this.userRepository.delete({ id: userId });
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'organizationId',
        'role',
      ],
    });
  }
}
