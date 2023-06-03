import {MigrationInterface, QueryRunner} from "typeorm";

export class TableServersAddMaxUsersField1685783567381 implements MigrationInterface {
    name = 'TableServersAddMaxUsersField1685783567381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."servers" ADD "maxUsers" integer NOT NULL DEFAULT '20'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."servers" DROP COLUMN "maxUsers"`);
    }

}
