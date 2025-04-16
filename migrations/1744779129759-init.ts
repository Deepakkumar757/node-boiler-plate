import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tables1744173595869 implements MigrationInterface {
  schema = process.env.DB_SCHEMA || 'public';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE SCHEMA IF NOT EXISTS ${this.schema};
    `);

    const dataTypesFromSchema: { typename: string }[] = await queryRunner.query(`
            SELECT t.typname as typename
            FROM pg_type t
            JOIN pg_namespace n ON n.oid = t.typnamespace
            WHERE n.nspname = '${this.schema}'
        `);
    const existingTypes = new Set(dataTypesFromSchema.map((type) => type.typename));

    // Create all required ENUM types
    const typeDefinitions = [
      {
        name: 'role_enum',
        query: `CREATE TYPE ${this.schema}.role_enum AS ENUM ('admin', 'incharge');`
      },
      {
        name: 'process_type',
        query: `CREATE TYPE ${this.schema}.process_type AS ENUM ('batch', 'fedBatch', 'continues');`
      },
      {
        name: 'scheduler_type_enum',
        query: `CREATE TYPE ${this.schema}.scheduler_type_enum AS ENUM ('create_request', 'report_mail', 'mail');`
      },
      {
        name: 'schedule_type_enum',
        query: `CREATE TYPE ${this.schema}.schedule_type_enum AS ENUM ('ONCE', 'REPEAT');`
      },
      {
        name: 'data_type_enum',
        query: `CREATE TYPE ${this.schema}.data_type_enum AS ENUM ('text', 'number', 'date', 'upload', 'dropdown', 'object', 'scan');`
      },
      {
        name: 'form_type_enum',
        query: `CREATE TYPE ${this.schema}.form_type_enum AS ENUM ('dataInput', 'inchargeInput', 'output');`
      },
      {
        name: 'drop_down_type',
        query: `CREATE TYPE ${this.schema}.drop_down_type AS ENUM ('inventory', 'lookup', 'nextNodes');`
      },
      {
        name: 'lookup_type_enum',
        query: `CREATE TYPE ${this.schema}.lookup_type_enum AS ENUM ('category', 'unit', 'manual');`
      },
      {
        name: 'request_status',
        query: `CREATE TYPE ${this.schema}.request_status AS ENUM ('pending', 'inProgress', 'completed', 'failed', 'overdue', 'onHold', 'lateCompleted');`
      },
      {
        name: 'task_status',
        query: `CREATE TYPE ${this.schema}.task_status AS ENUM ('pending', 'inProgress', 'completed', 'onHold');`
      }
    ];

    for (const typeDef of typeDefinitions) {
      if (!existingTypes.has(typeDef.name)) {
        await queryRunner.query(typeDef.query);
      }
    }

    // Create base tables
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS ${this.schema}.users (
                id UUID PRIMARY KEY,
                "userName" VARCHAR(100) NOT NULL,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                "userRole" ${this.schema}.role_enum NOT NULL,
                "createdBy" UUID DEFAULT NULL,
                "updatedBy" UUID DEFAULT NULL,
                "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_users_id ON ${this.schema}.users(id);
            CREATE INDEX IF NOT EXISTS idx_users_userName ON ${this.schema}.users("userName");
            CREATE INDEX IF NOT EXISTS idx_users_isDeleted ON ${this.schema}.users("isDeleted");
        `);

    // Create process table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS ${this.schema}.process (
                id UUID PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description VARCHAR(255) NOT NULL,
                "processType" ${this.schema}.process_type NOT NULL,
                "createdBy" UUID NOT NULL,
                "updatedBy" UUID NOT NULL,
                "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "process_createdBy_fk" FOREIGN KEY ("createdBy") REFERENCES ${this.schema}.users(id),
                CONSTRAINT "process_updatedBy_fk" FOREIGN KEY ("updatedBy") REFERENCES ${this.schema}.users(id)
            );

            CREATE INDEX IF NOT EXISTS idx_process_id ON ${this.schema}.process(id);
            CREATE INDEX IF NOT EXISTS idx_process_isDeleted ON ${this.schema}.process("isDeleted");
        `);

    await queryRunner.query(`
      Create table if not exists ${this.schema}.node_config (
        id UUID PRIMARY KEY,
        version int default 1 not null,
        isShared BOOLEAN DEFAULT FALSE NOT NULL,
        config JSON NOT NULL,
        "createdBy" UUID NOT NULL,
        "updatedBy" UUID NOT NULL,
        "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "node_config_createdBy_fk" FOREIGN KEY ("createdBy") REFERENCES ${this.schema}.users(id),
        CONSTRAINT "node_config_updatedBy_fk" FOREIGN KEY ("updatedBy") REFERENCES ${this.schema}.users(id)
        );
        
        CREATE INDEX IF NOT EXISTS idx_node_config_id ON ${this.schema}.node_config(id);
        CREATE INDEX IF NOT EXISTS idx_node_config_isDeleted ON ${this.schema}.node_config("isDeleted");
        `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS ${this.schema}.pre_build_nodes (
        id UUID PRImary key,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(50) NOT NULL,
        description VARCHAR(255) NOT NULL,
        "configId" UUID NOT NULL,
        "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "pre_build_nodes_configId_fk" FOREIGN KEY ("configId") REFERENCES ${this.schema}.node_config(id),
        CONSTRAINT pre_build_nodes_slug_unique UNIQUE (slug)
      );

      CREATE INDEX IF NOT EXISTS idx_pre_build_nodes_id ON ${this.schema}.pre_build_nodes(id);
      CREATE INDEX IF NOT EXISTS idx_pre_build_nodes_isDeleted ON ${this.schema}.pre_build_nodes("isDeleted");
      CREATE INDEX IF NOT EXISTS idx_pre_build_nodes_configId ON ${this.schema}.pre_build_nodes("configId");
      `);

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS ${this.schema}.template_node (
                id UUID PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description VARCHAR(255) NULL,
                "reqValidationScript" TEXT NULL,
                "nodeScript" TEXT NULL,
                initial BOOLEAN DEFAULT FALSE NULL,
                "isSynchronous" BOOLEAN DEFAULT FALSE NULL,
                "isAsynchronous" BOOLEAN DEFAULT FALSE NULL,
                "isRejectable" BOOLEAN DEFAULT FALSE NULL,
                "processId" UUID NULL,
                "createdBy" UUID NOT NULL,
                "updatedBy" UUID NOT NULL,
                "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
                CONSTRAINT "template_node_createdBy_fk" FOREIGN KEY ("createdBy") REFERENCES ${this.schema}.users(id),
                CONSTRAINT "template_node_processId_fk" FOREIGN KEY ("processId") REFERENCES ${this.schema}.process(id),
                CONSTRAINT "node_updatedBy_fk" FOREIGN KEY ("updatedBy") REFERENCES ${this.schema}.users(id)
            );

            CREATE INDEX IF NOT EXISTS idx_template_node_id ON ${this.schema}.template_node(id);
            CREATE INDEX IF NOT EXISTS idx_template_node_isDeleted ON ${this.schema}.template_node("isDeleted");
            CREATE INDEX IF NOT EXISTS idx_template_node_processId ON ${this.schema}.template_node("processId");
            CREATE INDEX IF NOT EXISTS idx_template_node_createdBy ON ${this.schema}.template_node("createdBy");
            CREATE INDEX IF NOT EXISTS idx_template_node_updatedBy ON ${this.schema}.template_node("updatedBy");
        `);

    // Create node table with all its dependencies
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS ${this.schema}.node (
                id UUID PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description VARCHAR(255) NULL,
                "reqValidationScript" TEXT NULL,
                "nodeScript" TEXT NULL,
                initial BOOLEAN DEFAULT FALSE NULL,
                x FLOAT8 DEFAULT 0 NULL,
                y FLOAT8 DEFAULT 0 NULL,
                "nodeSlug" VARCHAR(50) NULL,
                "configId" UUID NULL,
                "templateNodeId" UUID NULL,
                "inchargeId" UUID NULL,
                "wareHouseId" UUID NULL,
                "isSynchronous" BOOLEAN DEFAULT FALSE NULL,
                "isAsynchronous" BOOLEAN DEFAULT FALSE NULL,
                "processId" UUID NOT NULL,
                "isRejectable" BOOLEAN DEFAULT FALSE NULL,
                "createdBy" UUID NOT NULL,
                "updatedBy" UUID NOT NULL,
                "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
                CONSTRAINT "node_createdBy_fk" FOREIGN KEY ("createdBy") REFERENCES ${this.schema}.users(id),
                CONSTRAINT "node_inchargeId_fk" FOREIGN KEY ("inchargeId") REFERENCES ${this.schema}.users(id),
                CONSTRAINT "node_templateNodeId_fk" FOREIGN KEY ("templateNodeId") REFERENCES ${this.schema}.template_node(id),
                CONSTRAINT "node_processId_fk" FOREIGN KEY ("processId") REFERENCES ${this.schema}.process(id),
                CONSTRAINT "node_updatedBy_fk" FOREIGN KEY ("updatedBy") REFERENCES ${this.schema}.users(id),
                CONSTRAINT "node_nodeSlug_fk" FOREIGN KEY ("nodeSlug") REFERENCES ${this.schema}.pre_build_nodes(slug),
                CONSTRAINT "node_configId_fk" FOREIGN KEY ("configId") REFERENCES ${this.schema}.node_config(id)
            ); 

            CREATE INDEX IF NOT EXISTS idx_node_inchargeid ON ${this.schema}.node USING btree ("inchargeId");
            CREATE INDEX IF NOT EXISTS idx_node_isdeleted ON ${this.schema}.node USING btree ("isDeleted");
            CREATE INDEX IF NOT EXISTS idx_node_processid ON ${this.schema}.node USING btree ("processId");
            CREATE INDEX IF NOT EXISTS idx_node_configid ON ${this.schema}.node USING btree ("configId");
            CREATE INDEX IF NOT EXISTS idx_node_templateNodeid ON ${this.schema}.node USING btree ("templateNodeId");
            CREATE INDEX IF NOT EXISTS idx_node_createdBy ON ${this.schema}.node USING btree ("createdBy");
            CREATE INDEX IF NOT EXISTS idx_node_updatedBy ON ${this.schema}.node USING btree ("updatedBy");
        `);

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS ${this.schema}.schedulers (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                type ${this.schema}.scheduler_type_enum NOT NULL,
                schedule_type ${this.schema}.schedule_type_enum NOT NULL,
                run_at TIMESTAMPTZ,
                run_time TIME,
                payload JSONB NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                last_triggered_at TIMESTAMPTZ,
                created_at TIMESTAMPTZ DEFAULT now(),
                updated_at TIMESTAMPTZ DEFAULT now()
            );

            CREATE INDEX IF NOT EXISTS idx_schedulers_id ON ${this.schema}.schedulers(id);
            CREATE INDEX IF NOT EXISTS idx_schedulers_is_active ON ${this.schema}.schedulers(is_active);
        `);

    // Create lookup tables
    await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS ${this.schema}.lookup (
              id UUID PRIMARY KEY,
              name VARCHAR(100) NOT NULL,
              type ${this.schema}.lookup_type_enum NOT NULL,
              "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
              "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

          CREATE INDEX IF NOT EXISTS idx_lookup_id ON ${this.schema}.lookup(id);
          CREATE INDEX IF NOT EXISTS idx_lookup_isDeleted ON ${this.schema}.lookup("isDeleted");
          CREATE INDEX IF NOT EXISTS idx_lookup_type ON ${this.schema}.lookup(type);

          CREATE TABLE IF NOT EXISTS ${this.schema}.lookup_value (
              id UUID PRIMARY KEY,
              "lookupId" UUID NOT NULL,
              value VARCHAR(100) NOT NULL,
              "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
              "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT "lookup_value_lookupId_fk" FOREIGN KEY ("lookupId") REFERENCES ${this.schema}.lookup(id)
          );

          CREATE INDEX IF NOT EXISTS idx_lookup_value_id ON ${this.schema}.lookup_value(id);
          CREATE INDEX IF NOT EXISTS idx_lookup_value_isDeleted ON ${this.schema}.lookup_value("isDeleted");
          CREATE INDEX IF NOT EXISTS idx_lookup_value_lookupId ON ${this.schema}.lookup_value("lookupId");
      `);

    // Create node form data table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS ${this.schema}.node_form_data (
                id UUID PRIMARY KEY,
                "nodeId" UUID NOT NULL,
                name VARCHAR(100) NOT NULL,
                "dataType" ${this.schema}.data_type_enum NOT NULL,
                "formType" ${this.schema}.form_type_enum NOT NULL,
                "dropDownType" ${this.schema}.drop_down_type,
                "lookupId" UUID,
                "isRequired" BOOLEAN DEFAULT FALSE,
                "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "node_form_data_nodeId_fk" FOREIGN KEY ("nodeId") REFERENCES ${this.schema}.node(id),
                CONSTRAINT "node_form_data_lookupId_fk" FOREIGN KEY ("lookupId") REFERENCES ${this.schema}.lookup(id)
            );

            CREATE INDEX IF NOT EXISTS idx_node_form_data_id ON ${this.schema}.node_form_data(id);
            CREATE INDEX IF NOT EXISTS idx_node_form_data_isDeleted ON ${this.schema}.node_form_data("isDeleted");
            CREATE INDEX IF NOT EXISTS idx_node_form_data_lookupId ON ${this.schema}.node_form_data("lookupId");
            CREATE INDEX IF NOT EXISTS idx_node_form_data_nodeId ON ${this.schema}.node_form_data("nodeId");
        `);

    // Create node edges table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS ${this.schema}.node_edges (
                id UUID PRIMARY KEY,
                "fromNodeId" UUID NOT NULL,
                "toNodeId" UUID NOT NULL,
                "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "node_edges_fromNodeId_fk" FOREIGN KEY ("fromNodeId") REFERENCES ${this.schema}.node(id),
                CONSTRAINT "node_edges_toNodeId_fk" FOREIGN KEY ("toNodeId") REFERENCES ${this.schema}.node(id)
            );

            CREATE INDEX IF NOT EXISTS idx_node_edges_id ON ${this.schema}.node_edges(id);
            CREATE INDEX IF NOT EXISTS idx_node_edges_isDeleted ON ${this.schema}.node_edges("isDeleted");
            CREATE INDEX IF NOT EXISTS idx_node_edges_fromNodeId ON ${this.schema}.node_edges("fromNodeId");
            CREATE INDEX IF NOT EXISTS idx_node_edges_toNodeId ON ${this.schema}.node_edges("toNodeId");
        `);

    // Create request and task tables
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS ${this.schema}.request (
                id UUID PRIMARY KEY,
                "nodeId" UUID NOT NULL,
                "processId" UUID NOT NULL,
                status ${this.schema}.request_status NOT NULL DEFAULT 'pending',
                state JSONB DEFAULT NULL,
                "createdBy" UUID NOT NULL,
                "updatedBy" UUID NOT NULL,
                "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "request_nodeId_fk" FOREIGN KEY ("nodeId") REFERENCES ${this.schema}.node(id),
                CONSTRAINT "request_processId_fk" FOREIGN KEY ("processId") REFERENCES ${this.schema}.process(id),
                CONSTRAINT "request_createdBy_fk" FOREIGN KEY ("createdBy") REFERENCES ${this.schema}.users(id),
                CONSTRAINT "request_updatedBy_fk" FOREIGN KEY ("updatedBy") REFERENCES ${this.schema}.users(id)
            );

            CREATE INDEX IF NOT EXISTS idx_request_id ON ${this.schema}.request(id);
            CREATE INDEX IF NOT EXISTS idx_request_isDeleted ON ${this.schema}.request("isDeleted");
            CREATE INDEX IF NOT EXISTS idx_request_nodeId ON ${this.schema}.request("nodeId");
            CREATE INDEX IF NOT EXISTS idx_request_processId ON ${this.schema}.request("processId");
            CREATE INDEX IF NOT EXISTS idx_request_createdBy ON ${this.schema}.request("createdBy");
            CREATE INDEX IF NOT EXISTS idx_request_updatedBy ON ${this.schema}.request("updatedBy");
        `);

    await queryRunner.query(`
              CREATE TABLE IF NOT EXISTS ${this.schema}.request_versioning (
                id UUID PRIMARY KEY,
                "requestId" UUID NOT NULL,
                version INTEGER NOT NULL,
                state JSONB NOT NULL,
                "createdBy" UUID NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "request_versioning_requestId_fk" FOREIGN KEY ("requestId") REFERENCES ${this.schema}.request(id),
                CONSTRAINT "request_versioning_createdBy_fk" FOREIGN KEY ("createdBy") REFERENCES ${this.schema}.users(id),
                UNIQUE ("requestId", "version")
            );

            CREATE INDEX IF NOT EXISTS idx_request_versioning_id ON ${this.schema}.request_versioning(id);
            CREATE INDEX IF NOT EXISTS idx_request_versioning_requestId ON ${this.schema}.request_versioning("requestId");
    `);

    // Create task table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS ${this.schema}.task (
                id UUID PRIMARY KEY,
                "taskId" VARCHAR(50) NOT NULL,
                status ${this.schema}.task_status DEFAULT 'pending'::${this.schema}.task_status NULL,
                "nodeId" UUID NOT NULL,
                "requestId" UUID NOT NULL,
                assignee UUID NOT NULL,
                "startTime" TIMESTAMP NULL,
                "completedTime" TIMESTAMP NULL,
                "draftedTime" TIMESTAMP NULL,
                "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
                "dataInput" JSONB DEFAULT '{}'::JSONB NULL,
                "isSynchronous" BOOLEAN DEFAULT TRUE NULL,
                CONSTRAINT fk_task_assignee FOREIGN KEY (assignee) REFERENCES ${this.schema}.users(id) ON DELETE CASCADE,
                CONSTRAINT fk_task_node_id FOREIGN KEY ("nodeId") REFERENCES ${this.schema}.node(id) ON DELETE CASCADE,
                CONSTRAINT fk_task_request_id FOREIGN KEY ("requestId") REFERENCES ${this.schema}.request(id) ON DELETE CASCADE
            );
            CREATE INDEX idx_task_assignee ON ${this.schema}.task USING btree (assignee);
            CREATE INDEX idx_task_isdeleted ON ${this.schema}.task USING btree ("isDeleted");
            CREATE INDEX idx_task_nodeid ON ${this.schema}.task USING btree ("nodeId");
            CREATE INDEX idx_task_requestid ON ${this.schema}.task USING btree ("requestId");
            CREATE INDEX idx_task_status ON ${this.schema}.task USING btree (status);
            CREATE INDEX idx_task_taskid ON ${this.schema}.task USING btree ("taskId");

        `);

    await queryRunner.query(`
            CREATE TABLE ${this.schema}.task_data (
                id uuid DEFAULT uuid_generate_v4() NOT NULL,
                "taskId" uuid NOT NULL,
                "previousTaskId" uuid NULL,
                "timestamp" timestamp DEFAULT now() NOT NULL,
                status ${this.schema}.task_status DEFAULT 'pending'::${this.schema}.task_status NOT NULL,
                "isPrimary" BOOLEAN DEFAULT FALSE NOT NULL,
                draft jsonb DEFAULT '{}'::jsonb NULL,
                "dataInput" jsonb DEFAULT '{}'::jsonb NULL,
                "nodeInput" jsonb DEFAULT '{}'::jsonb NULL,
                "output" jsonb DEFAULT '{}'::jsonb NULL,
                consumed jsonb DEFAULT '{}'::jsonb NULL,
                dispatched jsonb DEFAULT '{}'::jsonb NULL,
                produced jsonb DEFAULT '{}'::jsonb NULL,
                "startedTime" timestamp DEFAULT now() NULL,
                "completedTime" timestamp NULL,
                "createdAt" timestamp DEFAULT now() NOT NULL,
                "updatedAt" timestamp DEFAULT now() NOT NULL,
                CONSTRAINT task_data_pkey PRIMARY KEY (id),
                CONSTRAINT fk_task_data_previoustask FOREIGN KEY ("previousTaskId") REFERENCES ${this.schema}.task(id) ON DELETE SET NULL,
                CONSTRAINT fk_task_data_task FOREIGN KEY ("taskId") REFERENCES ${this.schema}.task(id) ON DELETE CASCADE
            );
            CREATE INDEX idx_task_data_previoustaskid ON ${this.schema}.task_data USING btree ("previousTaskId");
            CREATE INDEX idx_task_data_status ON ${this.schema}.task_data USING btree (status);
            CREATE INDEX idx_task_data_taskid ON ${this.schema}.task_data USING btree ("taskId");
            CREATE INDEX idx_task_data_timestamp ON ${this.schema}.task_data USING btree ("timestamp");
            CREATE INDEX idx_task_data_isPrimary ON ${this.schema}.task_data USING btree ("isPrimary");
            `);

    // Create ID counter table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS ${this.schema}.id_counter (
                id SERIAL PRIMARY KEY,
                context VARCHAR(50) UNIQUE NOT NULL,
                "latestId" VARCHAR(20) NOT NULL,
                "lastUpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

    // Create graph functions
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION ag_catalog.get_connected_nodes_with_details(
                initial_node_id text,
                graph_name text,
                schema_name text
            )
            RETURNS TABLE(
                "nodeId" text,
                "processId" text,
                "inchargeId" uuid,
                "reqValidationScript" text,
                name text
            )
            LANGUAGE plpgsql
            AS $function$
            BEGIN
                RETURN QUERY EXECUTE FORMAT('
                    SELECT
                        result."nodeId"::TEXT AS "nodeId",
                        result."processId"::TEXT AS "processId",
                        n."inchargeId" AS "inchargeId",
                        COALESCE(n."reqValidationScript", parent."reqValidationScript") AS "reqValidationScript",
                        n.name::TEXT AS "name"
                    FROM ag_catalog.cypher(%L, $$
                        MATCH (a:Nodes {nodeId: %L})
                        MATCH (a)-[:edge]->(b)
                        RETURN b.nodeId AS nodeId, b.processId AS processId
                    $$) AS result("nodeId" ag_catalog.agtype, "processId" ag_catalog.agtype)
                    LEFT JOIN %I.node n ON (result."nodeId"::TEXT = n.id::TEXT)
                    LEFT JOIN %I.node parent ON (n."parentId" = parent.id);',
                    graph_name, initial_node_id, schema_name, schema_name
                );
            END;
            $function$;
        `);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order (respecting foreign key dependencies)
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.id_counter CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.task_data CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.task CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.request_versioning CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.request CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.node_edges CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.node_form_data CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.lookup_value CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.lookup CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.node CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.template_node CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.pre_build_nodes CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.node_config CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.process CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.users CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.schedulers CASCADE;`);

    // Drop custom types
    await queryRunner.query(`DROP TYPE IF EXISTS ${this.schema}.task_status CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS ${this.schema}.request_status CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS ${this.schema}.lookup_type_enum CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS ${this.schema}.drop_down_type CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS ${this.schema}.form_type_enum CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS ${this.schema}.data_type_enum CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS ${this.schema}.scheduler_type_enum CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS ${this.schema}.schedule_type_enum CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS ${this.schema}.process_type CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS ${this.schema}.role_enum CASCADE;`);

    // Drop functions
    await queryRunner.query(`DROP FUNCTION IF EXISTS ag_catalog.get_connected_nodes_with_details(text, text, text);`);
  }
}
