create TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(255),
    banStatus VARCHAR(255),
    passwordLimitation VARCHAR(255)
);