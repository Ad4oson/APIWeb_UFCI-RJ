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
exports.RentalsController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../common/guards/admin.guard");
const create_rental_dto_1 = require("./dto/create-rental.dto");
const extend_rental_dto_1 = require("./dto/extend-rental.dto");
const list_rentals_dto_1 = require("./dto/list-rentals.dto");
const rentals_service_1 = require("./rentals.service");
let RentalsController = class RentalsController {
    rentals;
    constructor(rentals) {
        this.rentals = rentals;
    }
    create(dto) {
        return this.rentals.create(dto);
    }
    findAll(query) {
        return this.rentals.findAll(query);
    }
    findActive() {
        return this.rentals.findActive();
    }
    findOverdue() {
        return this.rentals.findOverdue();
    }
    findByUser(userId) {
        return this.rentals.findByUser(userId);
    }
    findOne(id) {
        return this.rentals.findOne(id);
    }
    returnRental(id) {
        return this.rentals.returnRental(id);
    }
    cancel(id) {
        return this.rentals.cancel(id);
    }
    extend(id, dto) {
        return this.rentals.extend(id, dto);
    }
    remove(id) {
        return this.rentals.remove(id);
    }
};
exports.RentalsController = RentalsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_rental_dto_1.CreateRentalDto]),
    __metadata("design:returntype", void 0)
], RentalsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_rentals_dto_1.ListRentalsDto]),
    __metadata("design:returntype", void 0)
], RentalsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RentalsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('overdue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RentalsController.prototype, "findOverdue", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RentalsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RentalsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/return'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RentalsController.prototype, "returnRental", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RentalsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/extend'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, extend_rental_dto_1.ExtendRentalDto]),
    __metadata("design:returntype", void 0)
], RentalsController.prototype, "extend", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RentalsController.prototype, "remove", null);
exports.RentalsController = RentalsController = __decorate([
    (0, common_1.Controller)('rentals'),
    __metadata("design:paramtypes", [rentals_service_1.RentalsService])
], RentalsController);
//# sourceMappingURL=rentals.controller.js.map