import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTableVpn1685201060898 implements MigrationInterface {
    name = 'CreateTableVpn1685201060898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "vpn_status_enum" AS ENUM('Normal', 'Approved', 'Disabled', 'WaitForApprove', 'WaitForDisable')`);
        await queryRunner.query(`CREATE TABLE "vpn" ("id" SERIAL NOT NULL, "createdByUserId" integer NOT NULL, "name" character varying(20) NOT NULL, "serverAddr" character varying(30) NOT NULL, "status" "vpn_status_enum" NOT NULL DEFAULT 'WaitForApprove', "approvedDate" TIMESTAMP NOT NULL, "waitForApproveFromDate" TIMESTAMP NOT NULL, "disabledDate" TIMESTAMP NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_886ae775a5e190c186ba1580376" UNIQUE ("name"), CONSTRAINT "PK_d4d88a67a6c31b2630975e2cde9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_886ae775a5e190c186ba158037" ON "vpn" ("name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_886ae775a5e190c186ba158037"`);
        await queryRunner.query(`DROP TABLE "vpn"`);
        await queryRunner.query(`DROP TYPE "vpn_status_enum"`);
    }

}
