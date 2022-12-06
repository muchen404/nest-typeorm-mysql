"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var config_enum_1 = require("../enum/config.enum");
var UserController = /** @class */ (function () {
    function UserController(configService) {
        this.configService = configService;
    }
    UserController.prototype.test = function () {
        console.log('test api', this.configService.get(config_enum_1.ConfigEnum.DB_TYPE));
        console.log('test api', this.configService.get(config_enum_1.ConfigEnum.DB_HOST));
        console.log('test api', this.configService.get(config_enum_1.ConfigEnum.DB_PASSWORD));
        return 'Hello World!';
    };
    __decorate([
        (0, common_1.Get)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], UserController.prototype, "test", null);
    UserController = __decorate([
        (0, common_1.Controller)('user'),
        __metadata("design:paramtypes", [config_1.ConfigService])
    ], UserController);
    return UserController;
}());
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map