import {MigrationInterface, QueryRunner} from "typeorm";

export class TableVpnModifyDates1685203672607 implements MigrationInterface {
    name = 'TableVpnModifyDates1685203672607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."vpn" ALTER COLUMN "approvedDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."vpn" ALTER COLUMN "waitForApproveFromDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."vpn" ALTER COLUMN "disabledDate" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."vpn" ALTER COLUMN "disabledDate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."vpn" ALTER COLUMN "waitForApproveFromDate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."vpn" ALTER COLUMN "approvedDate" SET NOT NULL`);
    }

}
