import { MigrationInterface, QueryRunner } from 'typeorm';
import { passwordHash } from 'src/common/helpers/password.helper';

export class CreateSuperAdmin1729937655585 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = await passwordHash('pass');

    await queryRunner.query(`
          INSERT INTO "user" ("firstName", "lastName", "email", "password", "role")
          VALUES ('Super', 'Admin', 'admin@admin.com', '${hashedPassword}', 'superAdmin');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DELETE FROM "user" WHERE "email" = 'admin@admin.com';
        `);
  }
}
