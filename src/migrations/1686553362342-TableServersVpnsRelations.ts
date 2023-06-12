import {MigrationInterface, QueryRunner} from "typeorm";

export class TableServersVpnsRelations1686553362342 implements MigrationInterface {
    name = 'TableServersVpnsRelations1686553362342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."vpn" RENAME COLUMN "serverAddr" TO "serverId"`);
        await queryRunner.query(`ALTER TABLE "public"."vpn" DROP COLUMN "serverId"`);
        await queryRunner.query(`ALTER TABLE "public"."vpn" ADD "serverId" integer`);
        await queryRunner.query(`ALTER TABLE "public"."vpn" ADD CONSTRAINT "FK_fe2e00db844285f3d4e542e76d9" FOREIGN KEY ("serverId") REFERENCES "servers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."vpn" DROP CONSTRAINT "FK_fe2e00db844285f3d4e542e76d9"`);
        await queryRunner.query(`ALTER TABLE "public"."vpn" DROP COLUMN "serverId"`);
        await queryRunner.query(`ALTER TABLE "public"."vpn" ADD "serverId" character varying(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."vpn" RENAME COLUMN "serverId" TO "serverAddr"`);
    }

}
