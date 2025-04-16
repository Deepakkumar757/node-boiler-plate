import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultData1735277837089 implements MigrationInterface {
  schema = process.env.DB_SCHEMA || 'public';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert data into the lookup table
    await queryRunner.query(
      `INSERT INTO ${this.schema}.lookup(id, name, type, "createdAt", "updatedAt")
             VALUES (
               'b009ab58-f5ae-4c56-bd37-212067736a50',
               'Unit',
               'unit',
               NOW(),
               NOW()
             )
             ON CONFLICT (id) DO NOTHING`
    );

    // Insert data into the users table
    await queryRunner.query(
      `INSERT INTO ${this.schema}.users(id,"userName", name, email, password, "userRole", "createdAt", "updatedAt") 
             VALUES 
             ('2349285a-7c8a-4979-b602-1eed5c1ccb33','user1', 'User1', 'user1@gmail.com', '12345678', 'incharge', NOW(), NOW()),
             ('67f83cbd-7287-40fd-9062-e123fd39903f','user2', 'User2', 'user2@gmail.com', '12345678', 'incharge', NOW(), NOW()),
             ('3d6a72f4-19eb-4c6b-8cc3-2c95468081ed','user3', 'User3', 'user3@gmail.com', '12345678', 'incharge', NOW(), NOW()),
             ('542a6306-0867-4057-9856-67a57c9d2578','user4', 'User4', 'user4@gmail.com', '12345678', 'incharge', NOW(), NOW()),
             ('d86a68e3-c457-4fe4-97f7-3f90db2174d2','user5', 'User5', 'user5@gmail.com', '12345678', 'incharge', NOW(), NOW()),
             ('b64f413b-c0c6-4b79-b918-68fef0679649','admin', 'Admin', 'admin@gmail.com', '12345678', 'admin', NOW(), NOW())
             ON CONFLICT (id) DO NOTHING;`
    );

    await queryRunner.query(`
            INSERT INTO ${this.schema}.id_counter (id,context, "latestId") 
            VALUES
            (1,'request', 'REQ0000'),
            (2,'task', 'TASK0000') ON CONFLICT (id) DO NOTHING`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the inserted rows from the lookup table
    await queryRunner.query(`DELETE FROM ${this.schema}.lookup WHERE id = 'b009ab58-f5ae-4c56-bd37-212067736a50';`);

    // Remove the inserted rows from the users table
    await queryRunner.query(
      `DELETE FROM ${this.schema}.users 
             WHERE id IN (
                '2349285a-7c8a-4979-b602-1eed5c1ccb33',
                '67f83cbd-7287-40fd-9062-e123fd39903f',
                '3d6a72f4-19eb-4c6b-8cc3-2c95468081ed',
                'b64f413b-c0c6-4b79-b918-68fef0679649'
             );`
    );
    await queryRunner.query(`DELETE FROM ${this.schema}.id_counter WHERE id IN (1,2);`);
  }
}
