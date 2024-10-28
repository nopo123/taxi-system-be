import { UserService } from '../../user/user.service';
import {
  Services,
  SetupConfig,
  SetupData,
} from '../interfaces/setup-services.interface';
import { GetUserDto } from '../../user/dto/get-user.dto';
import { CreateSuperAdminDto } from '../../user/dto/create-super-admin.dto';
import { Role } from '../../user/enums/role.enum';
import { GetOrganizationDto } from '../../organization/dto/get-organization.dto';
import { OrganizationService } from '../../organization/organization.service';
import { CreateOrganiationDto } from '../../organization/dto/create-organization.dto';
import { RolesService } from '../../roles/roles.service';
import {CreateUserDto} from "../../user/dto/create-user.dto";
import {OrderService} from "../../order/order.service";
import {OrderUserService} from "../../order_user/order_user.service";
import { GetOrderDto } from '../../order/dto/get-order-dto';
import { CreateOrderDto } from '../../order/dto/create-order.dto';
import { UserEntity } from 'src/user/entities/user.entity';
export class SetupTestingEntitiesHelpers {
  usersService: UserService;
  organizationService: OrganizationService;
  rolesService: RolesService;
  orderService: OrderService;
  orderUserService: OrderUserService;


  constructor(services: Services) {
    this.usersService = services.usersService;
    this.organizationService = services.organizationService;
    this.rolesService = services.rolesService;
    this.orderService = services.orderService;
    this.orderUserService = services.orderUserService;
  }

  async createTestingData(config: SetupConfig): Promise<SetupData> {
    const superAdmin: GetUserDto = await this.createTestingSuperAdmin();

    let organizations: GetOrganizationDto[] = [];
    if(config.organizations && config.organizations.count > 0){
      organizations = await this.createTestingOrganization(
        config.organizations.count,
      );
    }

    let orders: GetOrderDto[] = [];
    if(config.orders && config.orders.count > 0){ 
      orders = await this.createTestingOrders(
        superAdmin,
        organizations[0].id,
        config.orders.count,
      );
    }


    let admins: GetUserDto[];
    admins = await this.createTestingAdmins(
      superAdmin,
      organizations[0].id,
      config.users.count,
      config.testName,
    );

    return {
      superAdmin,
      admins,
      organizations,
      orders,
    };
  }

  async createTestingOrganization(
    count: number,
  ): Promise<GetOrganizationDto[]> {
    const organizations: GetOrganizationDto[] = [];
    for (let i = 0; i < count; i++) {
      const createOrganizationDto: CreateOrganiationDto = {
        name: 'testingOrganization' + i,
        address: 'testingCity',
      };

      const organization = await this.organizationService.create(
        createOrganizationDto,
      );
      organizations.push(organization);
    }
    return organizations;
  }

  async createTestingSuperAdmin(): Promise<GetUserDto> {
    const createSuperAdminDto: CreateSuperAdminDto = {
      email: 'asosSuperAdmin@mail.com',
      password: 'Pass123',
      firstName: 'Asos',
      lastName: 'Asos',
    }
    return await this.usersService.createSuperAdmin(createSuperAdminDto);
  }

  async createTestingAdmins(
    superAdmin: GetUserDto,
    organizationId: number,
    count: number,
    testName: string,
  ): Promise<GetUserDto[]> {
    const admins: GetUserDto[] = [];
    for (let i = 0; i < count; i++) {
      const createUserDto: CreateUserDto = {
        email: `asosAdminds${i} + ${testName}@mail.com`,
        password: "Pass123",
        firstName: 'Asos',
        lastName: 'Asos',
        role: Role.ADMIN,
        organizationId: organizationId,
      };
      const admin = await this.usersService.createAdmin(
          createUserDto,
          organizationId
      );

      admins.push(admin);
    }
    return admins;
  }

  async createTestingOrders(superAdmin: GetUserDto, organizationId: number, count: number,): Promise<GetOrderDto[]> {
    const orders: GetOrderDto[] = [];
    const admins = await this.createTestingAdmins(superAdmin, organizationId, count, "testingOrders");
    const loggedUser = await this.usersService.findUserByEmail(admins[0].email);

    for (let i = 0; i < count; i++) {
      const createOrderDto: CreateOrderDto = {
        userId: admins[i].id,
        firstName: 'Asos' + i,
        lastName: 'Asos' + i,
        orderUserId: superAdmin.id,
        route: 'testingRoute' + i,
        date: "2021-12-12",
        price: 100 + i,
        distance: 100 + i, 
        secondDriver: 0 + i, 
        waitingTime: 10 + i,
        driverSignature: 'DriverSignature' + i,
        clientSignature: 'ClientSignature' + i,
      };
      const order = await this.orderService.create(createOrderDto, loggedUser);
      orders.push(order);
    }
    return orders;
  }
}
