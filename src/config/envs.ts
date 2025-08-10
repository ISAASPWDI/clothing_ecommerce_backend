import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
    ROOT_PASSWORD: get('MYSQL_ROOT_PASSWORD').required().asString(),
    DB_NAME: get('MYSQL_DATABASE').required().asString(),
    DB_USER: get('MYSQL_USER').required().asString(),
    DB_PASSWORD: get('MYSQL_PASSWORD').required().asString(),
}