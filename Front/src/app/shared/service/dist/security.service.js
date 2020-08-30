"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SecurityService = void 0;
var core_1 = require("@angular/core");
var shared_service_1 = require("./shared.service");
var angular_jwt_1 = require("@auth0/angular-jwt");
var rxjs_1 = require("rxjs");
var sidebar_items_1 = require("../../layout/sidebar/sidebar-items");
var SecurityService = /** @class */ (function () {
    function SecurityService(injector, httpClient, router) {
        var _this = this;
        this.injector = injector;
        this.httpClient = httpClient;
        this.router = router;
        this.loading = false;
        this.showLoadingIndicatior = new rxjs_1.Subject();
        this.sharedService = this.injector.get(shared_service_1.SharedService);
        this.urlBack = this.sharedService.urlBack;
        this.isAuth = false;
        this.SupAdmin = false;
        this.admin = false;
        this.superviseur = false;
        this.superviseurGene = false;
        this.superviseurAdjoint = false;
        this.guest = false;
        this.chefEquipe = false;
        this.membreInv = false;
        this.fonction = "";
        this.securePwd = true;
        this.jwtHelper = new angular_jwt_1.JwtHelperService;
        this.urlAfterConnexion = "/dashboard/main";
        this.showLoadingIndicatior.subscribe(function (value) {
            setTimeout(function () { return _this.loading = value; }, 1); //pour eviter l erreur: Expression has changed after it was checked
        });
    }
    SecurityService.prototype.login = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.httpClient
                .post(_this.urlBack + "/login", data)
                .subscribe(function (rep) {
                _this.traitementLogin(rep.token, rep.refresh_token);
                resolve();
            }, function (error) {
                reject(error);
            });
        });
    };
    SecurityService.prototype.traitementLogin = function (token, refresh) {
        this.isAuth = true;
        this.token = token;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refresh);
        var tokenDeco = this.jwtHelper.decodeToken(token);
        localStorage.setItem('username', tokenDeco.username);
        localStorage.setItem('roles', tokenDeco.roles);
        this.user = { id: tokenDeco.id };
        this.getUser();
        this.setRole();
    };
    SecurityService.prototype.setRole = function () {
        var roles = localStorage.getItem("roles");
        if (roles.search("ROLE_SuperAdmin") >= 0) {
            this.SupAdmin = true;
            this.fonction = "Super admin";
        }
        else if (roles.search("ROLE_Admin") >= 0) {
            this.admin = true;
            this.fonction = "Admin";
        }
        else if (roles.search("ROLE_SuperViseurGene") >= 0) {
            this.superviseurGene = true;
            this.fonction = "Superviseur général";
        }
        else if (roles.search("ROLE_SuperViseurAdjoint") >= 0) {
            this.superviseurAdjoint = true;
            this.fonction = "Superviseur adjoint";
        }
        else if (roles.search("ROLE_Superviseur") >= 0) {
            this.superviseur = true;
            this.fonction = "Superviseur";
        }
        else if (roles.search("ROLE_Guest") >= 0) {
            this.guest = true;
            this.fonction = "Invité";
        }
        else if (roles.search("ROLE_CE") >= 0) {
            this.chefEquipe = true;
            this.fonction = "Chef d'équipe de comptage";
        }
        else if (roles.search("ROLE_MI") >= 0) {
            this.membreInv = true;
            this.fonction = "Membre d'équipe de comptage";
        }
    };
    SecurityService.prototype.logOut = function () {
        this.isAuth = false;
        this.SupAdmin = false;
        this.admin = false;
        this.superviseur = false;
        this.superviseurGene = false;
        this.superviseurAdjoint = false;
        this.guest = false;
        this.chefEquipe = false;
        this.membreInv = false;
        localStorage.clear();
        this.router.navigate(['/login']);
    };
    SecurityService.prototype.load = function () {
        if (localStorage.getItem('token')) {
            var token = localStorage.getItem('token');
            var refresh = localStorage.getItem('refreshToken');
            this.traitementLogin(token, refresh);
            //this.refreshToken()
        }
    };
    SecurityService.prototype.changePwd = function (data) {
        //return this.sharedService.postElement(data,"/password")
        return this.sharedService.putElement(data, "/users/password/" + this.user.id);
    };
    SecurityService.prototype.changeInfo = function (data) {
        return this.sharedService.putElement(data, "/users/info/" + this.user.id);
    };
    SecurityService.prototype.activKey = function (data) {
        return this.sharedService.postElement(data, "/activeKey");
    };
    SecurityService.prototype.updateInfo = function (data) {
        return this.sharedService.postElement(data, "/info");
    };
    SecurityService.prototype.updatePP = function (image) {
        var formData = new FormData();
        formData.append('image', image);
        return this.sharedService.postElement(formData, "/update/pp");
    };
    SecurityService.prototype.getUser = function () {
        var _this = this;
        this.securePwd = true;
        return this.sharedService.getElement("/info").then(function (rep) {
            var _a;
            _this.user = rep[0];
            if (((_a = _this.user.entreprises) === null || _a === void 0 ? void 0 : _a.length) == 1) {
                localStorage.setItem("currentEse", _this.user.entreprises[0].id);
            }
            localStorage.setItem('idUser', _this.user.id);
            localStorage.setItem('mercureAuthorization', rep[1]);
            if (rep[2] == 1) {
                _this.securePwd = false;
            }
            //console.log(rep)
        });
    };
    SecurityService.prototype.refreshToken = function () {
        var _this = this;
        var rt = "";
        if (localStorage.getItem('refreshToken'))
            rt = localStorage.getItem('refreshToken');
        var data = { refresh_token: rt };
        console.log(data);
        this.sharedService.postElement(data, "/token/refresh").then(function (rep) {
            _this.token = rep.token;
            localStorage.setItem('token', rep.token);
            localStorage.setItem('refreshToken', rep.refresh);
            console.log(rep);
        });
    };
    SecurityService.prototype.guestAccess = function (url) {
        var idUrl = this.idByUrl(sidebar_items_1.ROUTES, url);
        var access = this.getIdGuestRoute().indexOf(idUrl) > -1;
        if (this.guest && !access && url != this.urlAfterConnexion) {
            this.logOut();
        }
    };
    SecurityService.prototype.getIdGuestRoute = function () {
        var ids = [];
        if (this.guest && this.user && this.user.menu) {
            var menus = this.user.menu;
            for (var i = 0; i < menus.length; i++) {
                ids.push(menus[i][0]); //idMenu
                menus[i][1].forEach(function (idSub) { return ids.push(idSub); });
            }
        }
        return ids;
    };
    SecurityService.prototype.idByUrl = function (menus, url) {
        var id = "";
        for (var i = 0; i < menus.length; i++) {
            if (menus[i].path == url) {
                id = menus[i].id;
                break;
            }
            menus[i].submenu.forEach(function (submenu) {
                if (submenu.path && submenu.path == url) {
                    id = submenu.id;
                }
            });
        }
        return id;
    };
    SecurityService.prototype.updateCurentEse = function (data) {
        return this.sharedService.putElement(data, "/users/" + localStorage.getItem("idUser"));
    };
    SecurityService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], SecurityService);
    return SecurityService;
}());
exports.SecurityService = SecurityService;
