-- Kích hoạt extension uuid-ossp để tạo UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Xóa bảng cũ để tránh trùng lặp
DROP TABLE IF EXISTS user_group, roles, permissions, groups, users, forward, providers, admins, Sapplications, tokens CASCADE ;

-- Tạo bảng tokens
CREATE TABLE IF NOT EXISTS tokens (
    token_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    body JSONB,
    encrypt_token VARCHAR(255) NOT NULL,
    expired_duration BIGINT NOT NULL,
    application_id UUID UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth_table_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_table VARCHAR(255) NOT NULL,
    password_attribute VARCHAR(255) NOT NULL,
    username_attribute VARCHAR(255) NOT NULL,
    hashing_type VARCHAR(255) NOT NULL,
    salt VARCHAR(255),
    hash_config JSONB
);

-- CREATE TABLE IF NOT EXISTS admins (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     username VARCHAR(255) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     uri TEXT,
--     database_username VARCHAR(255) NOT NULL,
--     database_password VARCHAR(255) NOT NULL,
--     database_type VARCHAR(50) NOT NULL CHECK (database_type IN ('MYSQL', 'POSTGRESQL', 'MONGODB', 'SQLSERVER')),
--     ssl_mode VARCHAR(50) CHECK (ssl_mode IN ('DISABLE', 'PREFERRE', 'REQUIRE')),
--     host VARCHAR(255) NOT NULL,
--     port INT NOT NULL,
--     connection_string VARCHAR(10000),
--     table_include_list VARCHAR(10000),
--     schema_include_list VARCHAR(10000),
--     collection_include_list TEXT,
--     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    uri TEXT,
    database_username VARCHAR(255) NOT NULL,
    database_password VARCHAR(255) NOT NULL,
    database_type VARCHAR(50) NOT NULL CHECK (database_type IN ('MYSQL', 'POSTGRESQL', 'MONGODB', 'SQLSERVER')),
    ssl_mode VARCHAR(50) CHECK (ssl_mode IN ('DISABLE', 'PREFER', 'REQUIRE')),
    host VARCHAR(255) NOT NULL,
    port INT NOT NULL,
    connection_string TEXT,
    table_include_list TEXT,
    schema_include_list TEXT,
    collection_include_list TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ALTER
-- TABLE admins ALTER
-- COLUMN connection_string SET DATA TYPE TEXT;

-- ALTER
--  TABLE admins ALTER
--  COLUMN table_include_list SET DATA TYPE TEXT;

--  ALTER
--  TABLE admins ALTER
--  COLUMN schema_include_list SET DATA TYPE TEXT;

--  ALTER
--  TABLE admins ALTER
--  COLUMN collection_include_list SET DATA TYPE TEXT;

-- Tạo bảng applications
CREATE TABLE IF NOT EXISTS applications (
    application_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    admin_id UUID NOT NULL,
    provider_id UUID UNIQUE,
    token_id UUID NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (token_id) REFERENCES tokens(token_id) DEFERRABLE INITIALLY DEFERRED
);

-- Tạo bảng providers
CREATE TABLE IF NOT EXISTS providers (
    provider_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID UNIQUE,
    method_id UUID,
    type VARCHAR(50) NOT NULL CHECK (type IN ('SAML', 'FORWARD', 'OAUTH', 'LDAP')),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(application_id) DEFERRABLE INITIALLY DEFERRED
);

-- Tạo bảng forward
CREATE TABLE IF NOT EXISTS forward (
    method_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID,
    name VARCHAR(255) NOT NULL,
    proxy_host_ip VARCHAR(255) NOT NULL,
    domain_name VARCHAR(255) NOT NULL,
    callback_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(application_id) DEFERRABLE INITIALLY DEFERRED
);

-- Thêm khóa ngoại còn lại
ALTER TABLE applications
    ADD CONSTRAINT fk_provider
    FOREIGN KEY (provider_id) REFERENCES providers(provider_id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE providers
    ADD CONSTRAINT fk_method
    FOREIGN KEY (method_id) REFERENCES forward(method_id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE tokens
    ADD CONSTRAINT fk_application_tokens
    FOREIGN KEY (application_id) REFERENCES applications(application_id) DEFERRABLE INITIALLY DEFERRED;

-- Tạo bảng users
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng groups
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role_id JSONB,
    descriptions VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng user_group
CREATE TABLE IF NOT EXISTS user_group (
    user_id UUID NOT NULL,
    group_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- Tạo bảng permissions
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    api_routes JSONB,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    group_id UUID,
    permission_id JSONB,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- Tạo bảng routes
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    route VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS')),
    protected BOOLEAN NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- userTable": "users",
--     "passwordAttribute": "password",
--     "usernameAttribute": "username",
--     "hashingType": "BCRYPT",
--     "salt": "$2a$12$Gbe4AzAQpfwu5bYRWhpiD.",
--     "hashConfig": {
--       "salt": "$2a$12$Gbe4AzAQpfwu5bYRWhpiD.",
--       "workFactor": 12
--     }
--   }