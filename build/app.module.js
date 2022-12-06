"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var user_module_1 = require("./user/user.module");
var typeorm_1 = require("@nestjs/typeorm");
var dotenv = require("dotenv");
var Joi = require("joi");
var user_entity_1 = require("./user/user.entity");
var profile_entity_1 = require("./user/profile.entity");
var logs_entity_1 = require("./logs/logs.entity");
var envFilePath = ".env.".concat(process.env.NODE_ENV || 'development');
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: envFilePath,
                    load: [function () { return dotenv.config({ path: '.env' }); }],
                    validationSchema: Joi.object({
                        NODE_ENV: Joi.string()
                            .valid('development', 'production')
                            .default('development'),
                        DB_TYPE: Joi.string()
                    })
                }),
                typeorm_1.TypeOrmModule.forRootAsync({
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: function (configService) {
                        return ({
                            type: 'mysql',
                            port: 22900,
                            host: '47.111.240.180',
                            username: 'root',
                            password: 'SunnyData247824',
                            database: 'testdb',
                            synchronize: true,
                            entities: [user_entity_1.User, logs_entity_1.Logs, profile_entity_1.Profile],
                            logging: ['error']
                        });
                    }
                }),
                user_module_1.UserModule
            ],
            controllers: [],
            providers: []
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map