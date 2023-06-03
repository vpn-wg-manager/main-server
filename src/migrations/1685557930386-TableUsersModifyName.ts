import {MigrationInterface, QueryRunner} from "typeorm";

export class TableUsersModifyName1685557930386 implements MigrationInterface {
    name = 'TableUsersModifyName1685557930386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" ADD CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf" UNIQUE ("name")`);
    }

}
