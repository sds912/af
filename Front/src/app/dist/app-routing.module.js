"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var auth_guard_1 = require("./core/guard/auth.guard");
var routes = [
    {
        path: 'dashboard', canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () {
            return Promise.resolve().then(function () { return require('./dashboard/dashboard.module'); }).then(function (m) { return m.DashboardModule; });
        }
    },
    {
        path: 'email', canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () { return Promise.resolve().then(function () { return require('./email/email.module'); }).then(function (m) { return m.EmailModule; }); }
    },
    {
        path: 'apps', canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () { return Promise.resolve().then(function () { return require('./apps/apps.module'); }).then(function (m) { return m.AppsModule; }); }
    },
    {
        path: 'widget', canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () {
            return Promise.resolve().then(function () { return require('./widget/widget.module'); }).then(function (m) { return m.WidgetModule; });
        }
    },
    {
        path: 'ui', canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () { return Promise.resolve().then(function () { return require('./ui/ui.module'); }).then(function (m) { return m.UiModule; }); }
    },
    {
        path: 'forms', canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () { return Promise.resolve().then(function () { return require('./forms/forms.module'); }).then(function (m) { return m.FormModule; }); }
    },
    {
        path: 'tables', canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () {
            return Promise.resolve().then(function () { return require('./tables/tables.module'); }).then(function (m) { return m.TablesModule; });
        }
    },
    {
        path: 'media', canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () { return Promise.resolve().then(function () { return require('./media/media.module'); }).then(function (m) { return m.MediaModule; }); }
    },
    {
        path: 'charts', canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () {
            return Promise.resolve().then(function () { return require('./charts/charts.module'); }).then(function (m) { return m.ChartsModule; });
        }
    },
    {
        path: 'timeline', canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () {
            return Promise.resolve().then(function () { return require('./timeline/timeline.module'); }).then(function (m) { return m.TimelineModule; });
        }
    },
    {
        path: 'icons', canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () { return Promise.resolve().then(function () { return require('./icons/icons.module'); }).then(function (m) { return m.IconsModule; }); }
    },
    {
        path: '',
        loadChildren: function () {
            return Promise.resolve().then(function () { return require('./authentication/authentication.module'); }).then(function (m) { return m.AuthenticationModule; });
        }
    },
    {
        path: 'extra-pages', canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () {
            return Promise.resolve().then(function () { return require('./extra-pages/extra-pages.module'); }).then(function (m) { return m.ExtraPagesModule; });
        }
    },
    {
        path: 'maps', canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () { return Promise.resolve().then(function () { return require('./maps/maps.module'); }).then(function (m) { return m.MapsModule; }); }
    },
    {
        path: 'admin', canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () { return Promise.resolve().then(function () { return require('./administration/administration.module'); }).then(function (m) { return m.AdministrationModule; }); }
    },
    {
        path: '', canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () { return Promise.resolve().then(function () { return require('./inventaire/inventaire.module'); }).then(function (m) { return m.InventaireModule; }); }
    },
    {
        path: '', canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () { return Promise.resolve().then(function () { return require('./immobilisation/immobilisation.module'); }).then(function (m) { return m.ImmobilisationModule; }); }
    },
    {
        path: '', canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () { return Promise.resolve().then(function () { return require('./planing/planing.module'); }).then(function (m) { return m.PlaningModule; }); }
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes)],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
