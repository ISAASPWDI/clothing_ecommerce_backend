import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
    ROOT_PASSWORD: get('MYSQL_ROOT_PASSWORD').required().asString(),
    DB_NAME: get('MYSQL_DATABASE').required().asString(),
    DB_USER: get('MYSQL_USER').required().asString(),
    DB_PASSWORD: get('MYSQL_PASSWORD').required().asString(),
    MERCADOPAGO_ACCESS_TOKEN: get('MERCADOPAGO_ACCESS_TOKEN').required().asString(),
    MERCADOPAGO_PUBLIC_KEY: get('MERCADOPAGO_PUBLIC_KEY').required().asString(),
    MERCADOPAGO_WEBHOOK_SECRET: get('MERCADOPAGO_WEBHOOK_SECRET').required().asString()
}