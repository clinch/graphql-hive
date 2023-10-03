import { type MigrationExecutor } from '../pg-migrator';

export default {
  name: '2023.10.02T14.41.41.schema-checks-dedup.ts',
  run: ({ sql }) => sql`
    CREATE TABLE "public"."sdl_store" (
      "id" text PRIMARY KEY NOT NULL,
      "sdl" text NOT NULL
    );
    
    CREATE UNIQUE INDEX sdl_store_unique_id ON "public"."sdl_store" ("id");
    
    ALTER TABLE "public"."schema_checks" ADD COLUMN "schema_sdl_store_id" text REFERENCES "public"."sdl_store" ("id");
    ALTER TABLE "public"."schema_checks" ADD COLUMN "supergraph_sdl_store_id" text REFERENCES "public"."sdl_store" ("id");
    ALTER TABLE "public"."schema_checks" ADD COLUMN "composite_schema_sdl_store_id" text REFERENCES "public"."sdl_store" ("id");

    ALTER TABLE "public"."schema_checks" ALTER COLUMN "schema_sdl" DROP NOT NULL;
    ALTER TABLE "public"."schema_checks" ALTER COLUMN "supergraph_sdl" DROP NOT NULL;
    ALTER TABLE "public"."schema_checks" ALTER COLUMN "composite_schema_sdl" DROP NOT NULL;

    CREATE INDEX "schema_check_by_schema_sdl_store_id" ON "public"."schema_checks" ("schema_sdl_store_id" ASC);
    CREATE INDEX "schema_check_by_supergraph_sdl_store_id" ON "public"."schema_checks" ("supergraph_sdl_store_id" ASC);
    CREATE INDEX "schema_check_by_composite_schema_sdl_store_id" ON "public"."schema_checks" ("composite_schema_sdl_store_id" ASC);
  `,
} satisfies MigrationExecutor;
