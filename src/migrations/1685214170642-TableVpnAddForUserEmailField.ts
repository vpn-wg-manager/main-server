import {MigrationInterface, QueryRunner} from "typeorm";

export class TableVpnAddForUserEmailField1685214170642 implements MigrationInterface {
    name = 'TableVpnAddForUserEmailField1685214170642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."vpn" ADD "forUserEmail" character varying(40) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."vpn" DROP COLUMN "forUserEmail"`);
    }

}
