import {MigrationInterface, QueryRunner} from "typeorm";

export class TableUsersAddFieldBalance1685794621818 implements MigrationInterface {
    name = 'TableUsersAddFieldBalance1685794621818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "balance" character varying(20) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('SuperAdmin', 'Manager', 'Client')`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING "role"::"text"::"public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "role" SET DEFAULT 'Client'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum_old" AS ENUM('SuperAdmin', 'Manager')`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING "role"::"text"::"public"."users_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "role" SET DEFAULT 'Manager'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "balance"`);
    }

}
