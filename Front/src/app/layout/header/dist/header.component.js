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
exports.HeaderComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var window_service_1 = require("../../services/window.service");
var forms_1 = require("@angular/forms");
var event_source_polyfill_1 = require("event-source-polyfill");
var document = window.document;
var file_saver_1 = require("file-saver");
var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(document, window, renderer, elementRef, dataService, sharedService, //ici laisser à public à cause du html
    securityServ, fb, _snackBar, layouteSev) {
        this.document = document;
        this.window = window;
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.dataService = dataService;
        this.sharedService = sharedService;
        this.securityServ = securityServ;
        this.fb = fb;
        this._snackBar = _snackBar;
        this.layouteSev = layouteSev;
        this.imagePP = "";
        this.showPwd = false;
        this.showPwd2 = false;
        this.showPwd3 = false;
        this.errorConfPwd = false;
        this.errorPwd = false;
        this.updateInfo = false;
        this.idEse = null;
        this.notifs = [];
        this.imgLink = "";
        this.countNotif = 6;
        this.paginateN = false;
        this.news = 0;
        this.jsonObject = {
            City: [
                {
                    id: 1,
                    name: 'Basel',
                    founded: -200,
                    beautiful: true,
                    data: 123,
                    keywords: ['Rhine', 'River']
                },
                {
                    id: 1,
                    name: 'Zurich',
                    founded: 0,
                    beautiful: false,
                    data: 'no',
                    keywords: ['Limmat', 'Lake']
                }
            ]
        };
        this.notifications = [
            {
                userImg: 'assets/images/user/user1.jpg',
                userName: 'Sarah Smith',
                time: '14 mins ago',
                message: 'Please check your mail'
            },
            {
                userImg: 'assets/images/user/user2.jpg',
                userName: 'Airi Satou',
                time: '22 mins ago',
                message: 'Work Completed !!!'
            },
            {
                userImg: 'assets/images/user/user3.jpg',
                userName: 'John Doe',
                time: '3 hours ago',
                message: 'kindly help me for code.'
            },
            {
                userImg: 'assets/images/user/user4.jpg',
                userName: 'Ashton Cox',
                time: '5 hours ago',
                message: 'Lets break for lunch...'
            },
            {
                userImg: 'assets/images/user/user5.jpg',
                userName: 'Sarah Smith',
                time: '14 mins ago',
                message: 'Please check your mail'
            },
            {
                userImg: 'assets/images/user/user6.jpg',
                userName: 'Airi Satou',
                time: '22 mins ago',
                message: 'Work Completed !!!'
            },
            {
                userImg: 'assets/images/user/user7.jpg',
                userName: 'John Doe',
                time: '3 hours ago',
                message: 'kindly help me for code.'
            }
        ];
    }
    HeaderComponent.prototype.onWindowScroll = function () {
        var offset = this.window.pageYOffset ||
            this.document.documentElement.scrollTop ||
            this.document.body.scrollTop ||
            0;
        if (offset > 50) {
            this.isNavbarShow = true;
        }
        else {
            this.isNavbarShow = false;
        }
    };
    HeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        //this.isNavbarShow = true;
        this.setStartupStyles();
        this.initForm();
        this.initForm3();
        if (this.securityServ.isAuth) {
            this.getCountNew();
            this.imgLink = this.sharedService.baseUrl + "/images/";
            this.getNotif();
            this.realTime('notification');
        }
        setTimeout(function () {
            if (!_this.securityServ.securePwd) {
                _this.openPasswordModal.nativeElement.click();
            }
            if (!localStorage.getItem("currentEse") && !_this.securityServ.admin) {
                _this.openEseModal.nativeElement.click();
            }
        }, 1000);
        var blob = new Blob([JSON.stringify(this.jsonObject)], { type: 'application/json' });
        file_saver_1.saveAs(blob, 'abc.json');
    };
    HeaderComponent.prototype.showAllNotif = function () {
        this.paginateN = false;
        this.getNotif();
    };
    HeaderComponent.prototype.lireNotif = function (id) {
        var _this = this;
        this.layouteSev.lireNotification(id).then(function () {
            _this.notifs.find(function (notif) { return notif.id == id; }).status = 1;
            _this.news--;
        });
    };
    HeaderComponent.prototype.getCountNew = function () {
        var _this = this;
        this.layouteSev.getCountNewNotifs().then(function (rep) { return _this.news = rep; });
    };
    HeaderComponent.prototype.initForm = function () {
        this.editForm = this.fb.group({
            ancien: ['', [forms_1.Validators.required]],
            password: ['', [forms_1.Validators.required, forms_1.Validators.minLength(6)]],
            confPassword: ['', [forms_1.Validators.required, forms_1.Validators.minLength(6)]]
        }, {
            validator: this.mustMatch('password', 'confPassword')
        });
        if (this.formDirective)
            this.formDirective.resetForm();
    };
    HeaderComponent.prototype.mustMatch = function (controlName, matchingControlName) {
        return function (formGroup) {
            var control = formGroup.controls[controlName];
            var matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                // return if another validator has already found an error on the matchingControl
                return;
            }
            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                setTimeout(function () { return matchingControl.setErrors({ mustMatch: true }); }, 1); //pour eviter l erreur: Expression has changed after it was checked
            }
            else {
                matchingControl.setErrors(null);
            }
        };
    };
    HeaderComponent.prototype.updateInfos = function () {
        this.updateInfo = true;
        this.initForm2();
    };
    HeaderComponent.prototype.initForm2 = function () {
        var user = this.securityServ.user;
        this.InfoForm = this.fb.group({
            nom: [user.nom, [forms_1.Validators.required]],
            poste: [user.poste, [forms_1.Validators.required]]
        });
    };
    HeaderComponent.prototype.initForm3 = function () {
        this.idEse = localStorage.getItem("currentEse") ? localStorage.getItem("currentEse") : "";
        this.eseForm = this.fb.group({
            entreprise: [this.idEse, [forms_1.Validators.required]]
        });
    };
    HeaderComponent.prototype.updatePwd = function () {
        this.errorConfPwd = false;
        this.errorPwd = false;
        this.initForm();
    };
    HeaderComponent.prototype.onSavePwd = function (form) {
        var _this = this;
        var d = form.value;
        var data = {
            ancien: d.ancien,
            newPassword: d.password,
            confPassword: d.confPassword
        };
        this.errorConfPwd = false;
        this.errorPwd = false;
        this.securityServ.showLoadingIndicatior.next(true);
        this.securityServ.changePwd(data).then(function (rep) {
            _this.securityServ.showLoadingIndicatior.next(false);
            _this.showNotification('bg-success', 'Mot de passe modifié', 'top', 'center');
            _this.closePasswordModal.nativeElement.click();
            _this.securityServ.securePwd = true;
        }, function (message) {
            _this.securityServ.showLoadingIndicatior.next(false);
            console.log(message);
            _this.errorPwd = true;
            form.controls["ancien"].setErrors({ ancienMdp: true });
            _this.showNotification('bg-red', message, 'top', 'right');
        });
    };
    HeaderComponent.prototype.onSaveInfo = function (form) {
        var _this = this;
        var data = form.value;
        this.securityServ.showLoadingIndicatior.next(true);
        this.securityServ.changeInfo(data).then(function (rep) {
            _this.securityServ.showLoadingIndicatior.next(false);
            _this.showNotification('bg-success', "Enregistrer", 'top', 'center');
            _this.securityServ.user.nom = data.nom;
            _this.securityServ.user.poste = data.poste;
            _this.closeInfoModal.nativeElement.click();
        }, function (message) {
            console.log(message);
            _this.securityServ.showLoadingIndicatior.next(false);
            _this.showNotification('bg-red', message, 'top', 'right');
        });
    };
    HeaderComponent.prototype.onSaveEse = function (form) {
        var _this = this;
        this.securityServ.showLoadingIndicatior.next(true);
        var id = form.value.entreprise;
        var data = { currentEse: "/api/entreprises/" + id };
        this.securityServ.updateCurentEse(data).then(function (rep) {
            _this.securityServ.showLoadingIndicatior.next(false);
            _this.securityServ.user.currentEse = rep.currentEse;
            _this.showNotification('bg-success', "Enregistrer", 'top', 'center');
            _this.closeEseModal.nativeElement.click();
            localStorage.setItem("currentEse", id);
            setTimeout(function () { window.location.reload(); }, 1000);
        }, function (message) {
            _this.securityServ.showLoadingIndicatior.next(false);
            _this.showNotification('bg-red', message, 'top', 'right');
        });
    };
    HeaderComponent.prototype.showNotification = function (colorName, text, placementFrom, placementAlign) {
        this._snackBar.open(text, '', {
            duration: 2000,
            verticalPosition: placementFrom,
            horizontalPosition: placementAlign,
            panelClass: [colorName, 'color-white']
        });
    };
    HeaderComponent.prototype.setStartupStyles = function () {
        //set theme on startup
        if (localStorage.getItem('theme')) {
            this.renderer.removeClass(this.document.body, 'dark');
            this.renderer.removeClass(this.document.body, 'light');
            this.renderer.addClass(this.document.body, localStorage.getItem('theme'));
        }
        else {
            this.renderer.addClass(this.document.body, 'light');
        }
        // set light sidebar menu on startup
        if (localStorage.getItem('menu_option')) {
            this.renderer.addClass(this.document.body, localStorage.getItem('menu_option'));
        }
        else {
            this.renderer.addClass(this.document.body, 'menu_light');
        }
        // set logo color on startup
        if (localStorage.getItem('choose_logoheader')) {
            this.renderer.addClass(this.document.body, localStorage.getItem('choose_logoheader'));
        }
        else {
            this.renderer.addClass(this.document.body, 'logo-white');
        }
    };
    HeaderComponent.prototype.callFullscreen = function () {
        if (!document.fullscreenElement &&
            !document.mozFullScreenElement &&
            !document.webkitFullscreenElement &&
            !document.msFullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
            else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
            else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            }
            else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            }
        }
        else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    };
    HeaderComponent.prototype.mobileMenuSidebarOpen = function (event, className) {
        var hasClass = event.target.classList.contains(className);
        if (hasClass) {
            this.renderer.removeClass(this.document.body, className);
        }
        else {
            this.renderer.addClass(this.document.body, className);
        }
    };
    HeaderComponent.prototype.callSidemenuCollapse = function () {
        var hasClass = this.document.body.classList.contains('side-closed');
        if (hasClass) {
            this.renderer.removeClass(this.document.body, 'side-closed');
            this.renderer.removeClass(this.document.body, 'submenu-closed');
        }
        else {
            this.renderer.addClass(this.document.body, 'side-closed');
            this.renderer.addClass(this.document.body, 'submenu-closed');
        }
    };
    HeaderComponent.prototype.toggleRightSidebar = function () {
        this.dataService.changeMsg((this.dataService.currentStatus._isScalar = !this.dataService
            .currentStatus._isScalar));
    };
    HeaderComponent.prototype.logOut = function () {
        this.securityServ.logOut();
    };
    HeaderComponent.prototype.getEntite = function () {
        var _a, _b;
        var idEse = localStorage.getItem("currentEse") ? localStorage.getItem("currentEse") : "";
        return (_b = (_a = this.securityServ.user) === null || _a === void 0 ? void 0 : _a.entreprises) === null || _b === void 0 ? void 0 : _b.find(function (e) { return e.id == idEse; });
    };
    HeaderComponent.prototype.realTime = function (type) {
        var _this = this;
        setTimeout(function () {
            var url = new URL('http://localhost:3000/.well-known/mercure');
            url.searchParams.append('topic', 'http://asma-gestion-immo.com/' + type);
            var mercureAuthorization = localStorage.getItem('mercureAuthorization');
            var eventSource = new event_source_polyfill_1.EventSourcePolyfill(url.toString(), { headers: { Authorization: mercureAuthorization } });
            eventSource.onmessage = function (e) {
                if (type == "notification") {
                    _this.getNotif();
                    _this.getCountNew();
                }
            };
        }, 10000);
    };
    HeaderComponent.prototype.getNotif = function () {
        var _this = this;
        var params = "pagination=" + this.paginateN + "&count=" + this.countNotif + "&order[id]=desc";
        this.layouteSev.getNotifs(params).then(function (rep) {
            _this.notifs = rep;
        }, function (message) {
            console.log(message);
        });
    };
    __decorate([
        core_1.ViewChild('roleTemplate', { static: true })
    ], HeaderComponent.prototype, "roleTemplate");
    __decorate([
        core_1.ViewChild('closePasswordModal', { static: false })
    ], HeaderComponent.prototype, "closePasswordModal");
    __decorate([
        core_1.ViewChild('openPasswordModal', { static: true })
    ], HeaderComponent.prototype, "openPasswordModal");
    __decorate([
        core_1.ViewChild('openEseModal', { static: true })
    ], HeaderComponent.prototype, "openEseModal");
    __decorate([
        core_1.ViewChild('closeInfoModal', { static: false })
    ], HeaderComponent.prototype, "closeInfoModal");
    __decorate([
        core_1.ViewChild('closeEseModal', { static: false })
    ], HeaderComponent.prototype, "closeEseModal");
    __decorate([
        core_1.ViewChild('formDirective')
    ], HeaderComponent.prototype, "formDirective");
    __decorate([
        core_1.HostListener('window:scroll', [])
    ], HeaderComponent.prototype, "onWindowScroll");
    HeaderComponent = __decorate([
        core_1.Component({
            selector: 'app-header',
            templateUrl: './header.component.html',
            styleUrls: ['./header.component.sass']
        }),
        __param(0, core_1.Inject(common_1.DOCUMENT)),
        __param(1, core_1.Inject(window_service_1.WINDOW))
    ], HeaderComponent);
    return HeaderComponent;
}());
exports.HeaderComponent = HeaderComponent;
