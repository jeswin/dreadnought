CREATE TABLE "kvstore" (
    "user_id" character varying (64) NOT NULL,
    "key" character varying (128) NOT NULL,
    "value" character varying (1024) NOT NULL,
    "tag" character varying (128) NOT NULL,
    "timestamp" bigint NOT NULL,
    CONSTRAINT "kvstore_pkey" 
        PRIMARY KEY ("user_id", "key"));

CREATE INDEX "idx_kvstore_user_id_tag" 
    ON kvstore("user_id", "tag");

CREATE TABLE "resource" (
    "id" character varying (64) NOT NULL,
    "timestamp" bigint NOT NULL,
    CONSTRAINT "resource_pkey" 
        PRIMARY KEY ("id"));

CREATE TABLE "resource_permission" (
    "resource_id" character varying (64) NOT NULL,
    "user_id" character varying (64) NOT NULL,
    "read" character(1) NOT NULL,
    "write" character(1) NOT NULL,
    "execute" character(1) NOT NULL,
    "timestamp" bigint NOT NULL,
    CONSTRAINT "resource_permission_pkey" 
        PRIMARY KEY ("resource_id", "user_id"),
    CONSTRAINT "resource_permission_resource_id_fkey" 
        FOREIGN KEY ("resource_id") 
        REFERENCES "resource" ("id"));

