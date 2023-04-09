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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const users_service_1 = require("../../users/users.service");
const messages_service_1 = require("./messages.service");
const common_2 = require("@nestjs/common");
let MessageController = class MessageController {
    constructor(messageService, userService) {
        this.messageService = messageService;
        this.userService = userService;
    }
    getRoomMessages(roomId) {
        return this.messageService.getRoomMessages(roomId);
    }
    getDirectMessages(req) {
        return this.messageService.getUserDirectMessages(req.user.sub);
    }
};
__decorate([
    (0, common_1.Get)('room/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "getRoomMessages", null);
__decorate([
    (0, common_1.Get)('direct'),
    __param(0, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "getDirectMessages", null);
MessageController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [messages_service_1.MessageService,
        users_service_1.UsersService])
], MessageController);
exports.MessageController = MessageController;
//# sourceMappingURL=messages.controller.js.map