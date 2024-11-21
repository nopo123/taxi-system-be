import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
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
import { OrderService } from '../order/order.service';
import { OrganizationService } from '../organization/organization.service';
import { GetOrganizationDto } from '../organization/dto/get-organization.dto';
import { passwordHash } from '../common/helpers/password.helper';

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
  private readonly logger = new Logger(UserService.name);

  async create(body: CreateUserDto, loggedUser: UserEntity): Promise<GetUserDto> {
    this.logger.log(`Creating user with: ${body.firstName} ${body.lastName}`);
    const foundUser: UserEntity = await this.findUserByEmail(body.email);
    if (foundUser) {
      this.logger.error(`User with email: ${body.email} already exists`);
      throw new InternalServerErrorException('Nie je možné vytvoriť používateľa');
    }

    const organization: GetOrganizationDto = await this.organizationService.findOne(
      body.organizationId || loggedUser.organizationId,
    );

    const createdUser: UserEntity = this.userRepository.create({
      ...body,
      organizationId: body.organizationId || loggedUser.organizationId,
      organization: organization || null,
      orders: [],
    });

    const savedUser = await this.userRepository.save(createdUser);

    this.logger.log(`User with id: ${savedUser.id} created successfully`);
    return mapUserToGetUserDto(savedUser);
  }

  async createSuperAdmin(body: CreateSuperAdminDto): Promise<GetUserDto> {
    this.logger.log(`Creating super admin with email`);
    const isSuperAdmin: UserEntity = await this.userRepository.findOne({
      where: { role: Role.SUPER_ADMIN },
    });

    if (isSuperAdmin) {
      this.logger.error(`Super admin already exists`);
      throw new InternalServerErrorException('Nie je možné vytvoriť používateľa');
    }

    const createdUser: UserEntity = this.userRepository.create({
      ...body,
      organizationId: null,
      organization: null,
      orders: [],
      role: Role.SUPER_ADMIN,
    });

    const savedUser = await this.userRepository.save(createdUser);

    this.logger.log(`Super admin with email: ${savedUser.id} created successfully`);
    return mapUserToGetUserDto(savedUser);
  }

  async createAdmin(CreateAdminDto: CreateUserDto, organizationId: number): Promise<GetUserDto> {
    const organization: GetOrganizationDto = await this.organizationService.findOne(organizationId);

    this.logger.log(`Creating admin with email: ${CreateAdminDto.firstName} ${CreateAdminDto.lastName}`);
    const createdUser: UserEntity = this.userRepository.create({
      ...CreateAdminDto,
      organizationId: organizationId,
      organization: organization,
      orders: [],
      role: Role.ADMIN,
    });

    const savedUser = await this.userRepository.save(createdUser);

    this.logger.log(`Admin with email: ${savedUser.id} created successfully`);
    return mapUserToGetUserDto(savedUser);
  }

  async findAll(loggedUser: UserEntity): Promise<GetUserDto[]> {
    this.logger.log(`Finding all users`);
    const users: UserEntity[] = await this.userRepository.find({
      where: {
        organizationId: loggedUser.organizationId,
      },
      relations: ['orders'],
    });
    return users.map((user: UserEntity) => mapUserToGetUserDto(user));
  }

  async findOne(id: number, loggedUser: UserEntity): Promise<GetUserDto> {
    this.logger.log(`Finding user with id: ${id}`);
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['orders'],
    });

    if (!user) {
      throw new NotFoundException('Používateľ nebol nájdený');
    }

    if (user.organizationId !== loggedUser.organizationId && loggedUser.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Nemáte oprávnenie na zobrazenie tohto používateľa');
    }

    this.logger.log(`User with id: ${id} found successfully`);
    return mapUserToGetUserDto(user);
  }

  async update(userId: number, body: UpdateUserDto, loggedUser: UserEntity): Promise<GetUserDto> {
    this.logger.log(`Updating user with id: ${userId}`);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || (user.organizationId !== loggedUser.organizationId && loggedUser.role !== Role.SUPER_ADMIN)) {
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

    this.logger.log(`User with id: ${userId} updated successfully`);
    return mapUserToGetUserDto(updatedUser);
  }

  async updatePassword(userId: number, body: UpdatePasswordDto, loggedUser: UserEntity): Promise<GetUserDto> {
    this.logger.log(`Updating password for user with id: ${userId}`);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      this.logger.error(`User with id: ${userId} not found`);
      throw new NotFoundException('Používateľ nebol nájdený');
    }

    if (user.organizationId !== loggedUser.organizationId && loggedUser.role !== Role.SUPER_ADMIN) {
      this.logger.error(`User with id: ${userId} does not belong to your organization`);
      throw new ForbiddenException('Nemáte oprávnenie na zmenu hesla tohto používateľa');
    }

    if (body.password !== body.confirmPassword) {
      this.logger.error(`Passwords do not match`);
      throw new ForbiddenException('Heslá sa nezhodujú');
    }

    const updatedUser = await this.userRepository.save({
      id: user.id,
      ...user,
      password: await passwordHash(body.password),
    });

    this.logger.log(`Password for user with id: ${userId} updated successfully`);
    return mapUserToGetUserDto(updatedUser);
  }

  async delete(userId: number, loggedUser: UserEntity): Promise<void> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['orders'],
    });

    if (!user) {
      this.logger.error(`User with id: ${userId} not found`);
      throw new NotFoundException('Používateľ nebol nájdený');
    }

    if (user.organizationId !== loggedUser.organizationId && loggedUser.role !== Role.SUPER_ADMIN) {
      this.logger.error(`User with id: ${userId} does not belong to your organization`);
      throw new ForbiddenException('Nemáte oprávnenie na zmazanie tohto používateľa');
    }

    for (const order of user.orders) {
      await this.orderService.delete(order.id);
    }

    this.logger.log(`Deleting user with id: ${userId}`);
    await this.userRepository.delete({ id: userId });
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'firstName', 'lastName', 'organizationId', 'role'],
    });
  }
}
