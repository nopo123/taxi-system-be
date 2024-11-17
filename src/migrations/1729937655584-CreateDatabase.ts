import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabase1729937655584 implements MigrationInterface {
    name = 'CreateDatabase1729937655584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "adress" character varying NOT NULL, CONSTRAINT "UQ_c21e615583a3ebbb0977452afb0" UNIQUE ("name"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "route" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "price" numeric(10,2) NOT NULL, "distance" numeric(10,2) NOT NULL, "second_driver" numeric(10,2) NOT NULL, "waiting_time" numeric(10,2) NOT NULL, "drive_signature" character varying NOT NULL, "client_signature" character varying NOT NULL, "organization_id" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "role" character varying NOT NULL, "organization_id" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "type of organization" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_user" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "organization_id" integer NOT NULL, CONSTRAINT "PK_199e32a02ddc0f47cd93181d8fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3e103cdf85b7d6cb620b4db0f0c" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3e103cdf85b7d6cb620b4db0f0c"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`DROP TABLE "order_user"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "organization"`);
    }

}
