"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.SidebarComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var sidebar_items_1 = require("./sidebar-items");
var file_saver_1 = require("file-saver");
var SidebarComponent = /** @class */ (function () {
    function SidebarComponent(document, renderer, elementRef, sharedService, //ici laisser à public à cause du html
    securityServ, _snackBar, inventaireServ) {
        this.document = document;
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.sharedService = sharedService;
        this.securityServ = securityServ;
        this._snackBar = _snackBar;
        this.inventaireServ = inventaireServ;
        this.showMenu = '';
        this.showSubMenu = '';
        this.headerHeight = 60;
        this.imagePP = "";
        this.fileToUploadPp = null;
        this.myRole = '';
    }
    SidebarComponent.prototype.windowResizecall = function (event) {
        this.setMenuHeight();
        this.checkStatuForResize(false);
    };
    SidebarComponent.prototype.onGlobalClick = function (event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.renderer.removeClass(this.document.body, 'overlay-open');
        }
    };
    SidebarComponent.prototype.ngOnInit = function () {
        this.sidebarItems = sidebar_items_1.ROUTES.filter(function (sidebarItem) { return sidebarItem; });
        this.initLeftSidebar();
        this.bodyTag = this.document.body;
        this.myRole = localStorage.getItem("roles");
    };
    SidebarComponent.prototype.isGranted = function (menu) {
        var _this_1 = this;
        var roles = menu.roles;
        if (roles[0] == "all")
            return true;
        var bool = false;
        roles.forEach(function (element) {
            if (_this_1.myRole && _this_1.myRole.search(element) >= 0 && (!_this_1.securityServ.guest || _this_1.guestAccessM(menu.id))) {
                bool = true;
            }
        });
        return bool;
    };
    SidebarComponent.prototype.guestAccessM = function (id) {
        var bool = false;
        if (this.securityServ.guest && this.securityServ.user && this.securityServ.user.menu) {
            bool = this.menuIsPick(id, this.securityServ.user.menu);
        }
        return bool;
    };
    SidebarComponent.prototype.getIndexMenu = function (id, tab) {
        var a = -1;
        if (tab) { //sinon erreur
            for (var i = 0; i < tab.length; i++) {
                if (tab[i] && tab[i][0] && tab[i][0] == id) {
                    a = i;
                    break;
                }
                ;
            }
        }
        return a;
    };
    SidebarComponent.prototype.menuIsPick = function (id, tab) {
        return this.getIndexMenu(id, tab) > -1;
    };
    SidebarComponent.prototype.isGrantedSubM = function (menu, i) {
        var _this_1 = this;
        var submenu = menu.submenu;
        var roles = [];
        if (submenu && submenu[i] && submenu[i].roles && submenu[i].roles.length > 0)
            roles = submenu[i].roles;
        if (roles && (roles[0] == "all" || roles.length == 0))
            return true;
        var bool = false;
        roles.forEach(function (element) {
            if (_this_1.myRole && _this_1.myRole.search(element) >= 0 && (!_this_1.securityServ.guest || _this_1.guestAccessSubM(menu.id, submenu[i].id))) {
                bool = true;
            }
        });
        return bool;
    };
    SidebarComponent.prototype.guestAccessSubM = function (idMenu, idSub) {
        var bool = false;
        if (this.securityServ.guest && this.securityServ.user && this.securityServ.user.menu) {
            bool = this.subMenuIsPick(idMenu, idSub, this.securityServ.user.menu);
        }
        return bool;
    };
    SidebarComponent.prototype.subMenuIsPick = function (idMenu, idSub, tab) {
        var indexMenu = this.getIndexMenu(idMenu, tab);
        var bool = false;
        if (indexMenu > -1 && idSub) {
            var tabSub = tab[indexMenu][1];
            bool = tabSub.indexOf(idSub) > -1;
        }
        return bool;
    };
    SidebarComponent.prototype.handleFileInputPP = function (file) {
        var _this_1 = this;
        this.fileToUploadPp = file.item(0);
        var reader = new FileReader();
        reader.onload = function (event) {
            _this_1.imagePP = event.target.result;
            _this_1.changerPP();
        };
        reader.readAsDataURL(this.fileToUploadPp);
    };
    SidebarComponent.prototype.changerPP = function () {
        var _this_1 = this;
        this.securityServ.updatePP(this.fileToUploadPp).then(function (rep) {
            _this_1.securityServ.getUser();
        }, function (error) { var _a; return _this_1.imagePP = _this_1.sharedService.baseUrl + "/images/" + ((_a = _this_1.securityServ.user) === null || _a === void 0 ? void 0 : _a.image); });
    };
    SidebarComponent.prototype.callMenuToggle = function (event, element) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        }
        else {
            this.showMenu = element;
        }
        var hasClass = event.target.classList.contains('toggled');
        if (hasClass) {
            this.renderer.removeClass(event.target, 'toggled');
        }
        else {
            this.renderer.addClass(event.target, 'toggled');
        }
    };
    SidebarComponent.prototype.callSubMenuToggle = function (element) {
        if (element === this.showSubMenu) {
            this.showSubMenu = '0';
        }
        else {
            this.showSubMenu = element;
        }
    };
    SidebarComponent.prototype.initLeftSidebar = function () {
        var _this = this;
        //Set menu height
        _this.setMenuHeight();
        _this.checkStatuForResize(true);
        // //Set Waves
        // Waves.attach(".menu .list a", ["waves-block"]);
        // Waves.init();
    };
    SidebarComponent.prototype.setMenuHeight = function () {
        this.innerHeight = window.innerHeight;
        var height = this.innerHeight - this.headerHeight;
        this.listMaxHeight = height + '';
        this.listMaxWidth = '500px';
    };
    SidebarComponent.prototype.isOpen = function () {
        return this.bodyTag.classList.contains('overlay-open');
    };
    SidebarComponent.prototype.checkStatuForResize = function (firstTime) {
        if (window.innerWidth < 1170) {
            this.renderer.addClass(this.document.body, 'ls-closed');
        }
        else {
            this.renderer.removeClass(this.document.body, 'ls-closed');
        }
    };
    SidebarComponent.prototype.mouseHover = function (e) {
        var body = this.elementRef.nativeElement.closest('body');
        if (body.classList.contains('submenu-closed')) {
            this.renderer.addClass(this.document.body, 'side-closed-hover');
            this.renderer.removeClass(this.document.body, 'submenu-closed');
        }
    };
    SidebarComponent.prototype.mouseOut = function (e) {
        var body = this.elementRef.nativeElement.closest('body');
        if (body.classList.contains('side-closed-hover')) {
            this.renderer.removeClass(this.document.body, 'side-closed-hover');
            this.renderer.addClass(this.document.body, 'submenu-closed');
        }
    };
    SidebarComponent.prototype.showNotification = function (colorName, text, placementFrom, placementAlign) {
        this._snackBar.open(text, '', {
            duration: 2000,
            verticalPosition: placementFrom,
            horizontalPosition: placementAlign,
            panelClass: [colorName, 'color-white']
        });
    };
    SidebarComponent.prototype.exportForMobile = function () {
        var _this_1 = this;
        this.securityServ.showLoadingIndicatior.next(true);
        this.inventaireServ.getDataForMobile(localStorage.getItem("currentEse")).then(function (rep) {
            var blob = new Blob([JSON.stringify(rep)], { type: 'application/json' });
            file_saver_1.saveAs(blob, 'mobile.json');
            _this_1.securityServ.showLoadingIndicatior.next(false);
        }, function (message) {
            _this_1.securityServ.showLoadingIndicatior.next(false);
            _this_1.showNotification('bg-red', message, 'top', 'right');
        });
    };
    __decorate([
        core_1.HostListener('window:resize', ['$event'])
    ], SidebarComponent.prototype, "windowResizecall");
    __decorate([
        core_1.HostListener('document:mousedown', ['$event'])
    ], SidebarComponent.prototype, "onGlobalClick");
    SidebarComponent = __decorate([
        core_1.Component({
            selector: 'app-sidebar',
            templateUrl: './sidebar.component.html',
            styleUrls: ['./sidebar.component.sass']
        }),
        __param(0, core_1.Inject(common_1.DOCUMENT))
    ], SidebarComponent);
    return SidebarComponent;
}());
exports.SidebarComponent = SidebarComponent;
