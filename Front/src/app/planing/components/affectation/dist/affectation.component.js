"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AffectationComponent = void 0;
var core_1 = require("@angular/core");
var ngx_datatable_1 = require("@swimlane/ngx-datatable");
var AffectationComponent = /** @class */ (function () {
    function AffectationComponent(fb, _snackBar, adminServ, sharedService, securityServ, inventaireServ, planingServ) {
        this.fb = fb;
        this._snackBar = _snackBar;
        this.adminServ = adminServ;
        this.sharedService = sharedService;
        this.securityServ = securityServ;
        this.inventaireServ = inventaireServ;
        this.planingServ = planingServ;
        this.colNmbre = 5;
        this.totalMessage = "Total";
        this.data = [];
        this.filteredData = [];
        this.idCurrentEse = "";
        this.inventaires = [];
        this.show = false;
        this.imgLink = "";
        this.currentUser = null;
        this.subdivisions = [];
        this.localites = [];
        this.details = false;
        this.tabLoc = [];
        this.openLocalite = null;
        this.tabOpen = [];
        this.idCurrentInv = null;
        this.currentInv = null;
        this.roles = [
            "Chef d'équipe",
            "Membre inventaire",
            'Superviseur',
            'Superviseur général',
            'Superviseur adjoint',
            'Guest',
            'Président du comité',
            'Membre du comité'
        ];
        this.update = false;
        this.debutPeriodeOctroyer = null;
        this.finPeriodeOctroyer = null;
        this.debut = null;
        this.fin = null;
        this.idAffectation = 0;
        this.myId = '';
        this.curAffectation = null;
        this.myTabLocAffecte = [];
        this.tabObjAffectation = [];
        this.idCurrentAffectation = null;
        this.imgLink = this.sharedService.baseUrl + "/images/";
    }
    AffectationComponent.prototype.ngOnInit = function () {
        this.myId = localStorage.getItem('idUser');
        this.securityServ.showLoadingIndicatior.next(false);
        this.idCurrentEse = localStorage.getItem("currentEse");
        this.getInventaireByEse();
        this.getOneEntreprise(this.idCurrentEse);
    };
    AffectationComponent.prototype.openAffectation = function (id) {
        this.idCurrentAffectation = id;
        var affect = this.tabObjAffectation.find(function (affectation) { var _a; return ((_a = affectation === null || affectation === void 0 ? void 0 : affectation.localite) === null || _a === void 0 ? void 0 : _a.id) == id; });
        if (!affect) {
            affect = { localite: { id: id }, debut: null, fin: null };
            this.tabObjAffectation.push(affect);
        }
        this.debut = affect === null || affect === void 0 ? void 0 : affect.debut;
        this.fin = affect === null || affect === void 0 ? void 0 : affect.fin;
        console.log(this.tabObjAffectation);
    };
    AffectationComponent.prototype.getTabLocAffectation = function () {
        var _this = this;
        this.planingServ.getTabLocAffectation(this.idCurrentInv).then(function (rep) {
            _this.myTabLocAffecte = rep;
            console.log(rep);
        }, function (error) {
            _this.securityServ.showLoadingIndicatior.next(false);
            console.log(error);
        });
    };
    AffectationComponent.prototype.getInventaireByEse = function () {
        var _this = this;
        this.inventaireServ.getInventaireByEse(this.idCurrentEse).then(function (rep) {
            var _a, _b;
            _this.inventaires = rep;
            _this.currentInv = rep ? rep[0] : null;
            _this.idCurrentInv = (_a = _this.currentInv) === null || _a === void 0 ? void 0 : _a.id;
            _this.localites = (_b = _this.currentInv) === null || _b === void 0 ? void 0 : _b.localites;
            _this.getUsers();
            _this.getTabLocAffectation();
        }, function (error) {
            _this.securityServ.showLoadingIndicatior.next(false);
            console.log(error);
        });
    };
    AffectationComponent.prototype.getOneEntreprise = function (id) {
        var _this = this;
        this.adminServ.getOneEntreprise(id).then(function (rep) {
            _this.subdivisions = rep.subdivisions;
        }, function (error) {
            //this.securityServ.showLoadingIndicatior.next(false)
            console.log(error);
        });
    };
    AffectationComponent.prototype.getUsers = function () {
        var _this = this;
        /** voir doctrine/MyUser du Bac pour comprendre comment seul les users de l entreprise s affiche */
        this.adminServ.getUsers().then(function (rep) {
            _this.securityServ.showLoadingIndicatior.next(false);
            _this.data = rep === null || rep === void 0 ? void 0 : rep.filter(function (u) { return _this.isShow(u); });
            _this.filteredData = _this.data;
            var currentUser = _this.data && _this.data.length > 0 ? _this.data[0] : null;
            _this.openOn(currentUser);
            _this.show = true;
        }, function (error) {
            console.log(error);
            _this.securityServ.showLoadingIndicatior.next(false);
        });
    };
    AffectationComponent.prototype.openOn = function (user) {
        var _this = this;
        var _a;
        this.update = false;
        this.currentUser = user;
        this.tabOpen = [];
        (_a = this.subdivisions) === null || _a === void 0 ? void 0 : _a.forEach(function (sub) { return _this.tabOpen.push(0); });
        this.getAffectationOf(user);
    };
    AffectationComponent.prototype.getAffectationOf = function (user) {
        var _this = this;
        var _a;
        /** L'affectation d'un utilisateur */
        this.planingServ.getAffectations("?user.id=" + user.id + "&inventaire.id=" + ((_a = this.currentInv) === null || _a === void 0 ? void 0 : _a.id)).then(function (rep) {
            var _a, _b, _c;
            /** Je l ai modélisé ainsi au cas ou on doive faire une date pour chaque localité pour l instant on utilise juste localites qui est du json */
            /** si change revoir hiddenLoc */
            _this.curAffectation = rep[0];
            _this.idAffectation = _this.curAffectation ? _this.curAffectation.id : 0;
            _this.debut = (_a = _this.curAffectation) === null || _a === void 0 ? void 0 : _a.debut;
            _this.fin = (_b = _this.curAffectation) === null || _b === void 0 ? void 0 : _b.debut;
            /** Bonne pratique */
            _this.tabObjAffectation = rep;
            console.log(_this.tabObjAffectation, _this.localites);
            /** utiliser le user de getAffectationOf(user) car ses infos sont plus nombres */
            var hisLocalite = _this.getLocOpenUser(user, (_c = _this.curAffectation) === null || _c === void 0 ? void 0 : _c.localites);
            _this.tabLoc = [];
            hisLocalite === null || hisLocalite === void 0 ? void 0 : hisLocalite.forEach(function (l) { return _this.checkLoc(l, true); });
        }, function (error) {
            console.log(error);
        });
    };
    AffectationComponent.prototype.getLocOpenUser = function (user, tabIdLocalites) {
        var _this = this;
        var _a;
        /** si on choisi un adjoint charger les localités qu'il a créé */
        if (((_a = user.roles) === null || _a === void 0 ? void 0 : _a.indexOf("ROLE_SuperViseurAdjoint")) >= 0) {
            return this.localites.filter(function (loc) { var _a; return ((_a = loc === null || loc === void 0 ? void 0 : loc.createur) === null || _a === void 0 ? void 0 : _a.id) == user.id; });
        }
        /** Les autres charger les localités ou on les a affecté */
        var tab = [];
        tabIdLocalites === null || tabIdLocalites === void 0 ? void 0 : tabIdLocalites.forEach(function (id) { return tab.push(_this.getOnById(id)); });
        return tab;
    };
    AffectationComponent.prototype.save = function () {
        var _this = this;
        this.securityServ.showLoadingIndicatior.next(true);
        var data = {
            id: this.idAffectation,
            user: "/api/users/" + this.currentUser.id,
            inventaire: "/api/inventaires/" + this.currentInv.id,
            localites: this.tabLoc,
            debut: this.debut,
            fin: this.fin
        };
        this.planingServ.addAfectation(data).then(function (rep) {
            _this.update = false;
            _this.securityServ.showLoadingIndicatior.next(false);
        }, function (error) {
            console.log(error);
            _this.securityServ.showLoadingIndicatior.next(false);
        });
    };
    AffectationComponent.prototype.off = function () {
        this.openOn(this.currentUser);
    };
    AffectationComponent.prototype.hiddenLoc = function (loc) {
        var _a, _b;
        var cas1 = this.securityServ.superviseurAdjoint && ((_a = loc === null || loc === void 0 ? void 0 : loc.createur) === null || _a === void 0 ? void 0 : _a.id) != this.myId;
        /** si chef d equipe et qu on nous y a pas affecter */
        var cas2 = this.securityServ.chefEquipe && ((_b = this.myTabLocAffecte) === null || _b === void 0 ? void 0 : _b.indexOf(loc.id)) <= -1;
        if (cas1 || cas2) {
            return true;
        }
        return false;
    };
    AffectationComponent.prototype.isShow = function (user) {
        var _a, _b, _c, _d, _e, _f;
        var service = this.securityServ;
        /** superviseur general voit sup adjoint, chef equipe et membre inventaire */
        var cas1 = (service.superviseurGene &&
            (((_a = user.roles) === null || _a === void 0 ? void 0 : _a.indexOf("ROLE_SuperViseurAdjoint")) >= 0 ||
                ((_b = user.roles) === null || _b === void 0 ? void 0 : _b.indexOf("ROLE_CE")) >= 0 ||
                ((_c = user.roles) === null || _c === void 0 ? void 0 : _c.indexOf("ROLE_MI")) >= 0));
        /** sup adjoint et sup voit chef equipe et membre inventaire */
        var cas2 = (service.superviseur || service.superviseurAdjoint) && ((((_d = user.roles) === null || _d === void 0 ? void 0 : _d.indexOf("ROLE_CE")) >= 0 ||
            ((_e = user.roles) === null || _e === void 0 ? void 0 : _e.indexOf("ROLE_MI")) >= 0));
        /** chef equipe voit membre inventaire */
        var cas3 = service.chefEquipe && ((_f = user.roles) === null || _f === void 0 ? void 0 : _f.indexOf("ROLE_MI")) >= 0;
        if (cas1 || cas2 || cas3) {
            return true;
        }
        return false;
    };
    AffectationComponent.prototype.styleGree = function (user) {
        var _a, _b, _c;
        var service = this.securityServ;
        var cas1 = service.superviseurGene && ((_a = user.roles) === null || _a === void 0 ? void 0 : _a.indexOf("ROLE_SuperViseurAdjoint")) < 0;
        var cas2 = (service.superviseur || service.superviseurAdjoint) && ((_b = user.roles) === null || _b === void 0 ? void 0 : _b.indexOf("ROLE_CE")) < 0;
        var cas3 = service.chefEquipe && ((_c = user.roles) === null || _c === void 0 ? void 0 : _c.indexOf("ROLE_MI")) < 0;
        if (cas1 || cas2 || cas3) {
            return true;
        }
        return false;
    };
    AffectationComponent.prototype.isEditable = function () {
        var _a, _b, _c;
        var service = this.securityServ;
        var user = this.currentUser;
        /** superviseur general edit sup adjoint */
        var cas1 = service.superviseurGene && ((_a = user.roles) === null || _a === void 0 ? void 0 : _a.indexOf("ROLE_SuperViseurAdjoint")) >= 0;
        /** sup adjoint et sup edit chef equipe */
        var cas2 = (service.superviseur || service.superviseurAdjoint && ((_b = user.roles) === null || _b === void 0 ? void 0 : _b.indexOf("ROLE_CE")) >= 0);
        /** chef equipe edit membre inventaire */
        var cas3 = service.chefEquipe && ((_c = user.roles) === null || _c === void 0 ? void 0 : _c.indexOf("ROLE_MI")) >= 0;
        if (cas1 || cas2 || cas3) {
            return true;
        }
        return false;
    };
    AffectationComponent.prototype.editOne = function () {
        var user = this.currentUser;
        this.update = true;
    };
    AffectationComponent.prototype.inventaireChange = function (id) {
        var _a;
        this.currentInv = this.inventaires.find(function (inv) { return inv.id == id; });
        this.localites = (_a = this.currentInv) === null || _a === void 0 ? void 0 : _a.localites;
    };
    AffectationComponent.prototype.longText = function (text, limit) {
        return this.sharedService.longText(text, limit);
    };
    AffectationComponent.prototype.filterDatatable = function (value) {
        // get the value of the key pressed and make it lowercase
        var val = value.toLowerCase();
        // get the amount of columns in the table
        var colsAmt = this.colNmbre; //this.columns.length;
        // get the key names of each column in the dataset
        var keys = Object.keys(this.filteredData[0]);
        // assign filtered matches to the active datatable
        this.data = this.filteredData.filter(function (item) {
            // iterate through each row's column data
            for (var i = 0; i < colsAmt; i++) {
                // check for a match
                if (item[keys[i]]
                    .toString()
                    .toLowerCase()
                    .indexOf(val) !== -1 ||
                    !val) {
                    // found match, return true to add to result set
                    return true;
                }
            }
        });
        // whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    };
    AffectationComponent.prototype.firstSub = function (localites) {
        return localites === null || localites === void 0 ? void 0 : localites.filter(function (loc) { var _a; return ((_a = loc.position) === null || _a === void 0 ? void 0 : _a.length) > 0; });
    };
    AffectationComponent.prototype.inInvLoc = function (id) {
        var _a;
        /** on ne peut pas utiliser inTab car l un sera chercher sur les localites et l autre sur les subdivisions d une localites */
        return ((_a = this.localites) === null || _a === void 0 ? void 0 : _a.find(function (loc) { return loc.id == id; })) != null;
    };
    AffectationComponent.prototype.inTab = function (valeur, tab) {
        return tab === null || tab === void 0 ? void 0 : tab.find(function (id) { return id == valeur; });
    };
    AffectationComponent.prototype.getOnById = function (id) {
        var _a;
        var l = (_a = this.localites) === null || _a === void 0 ? void 0 : _a.find(function (loc) { return loc.id == id; });
        return l ? l : null;
    };
    AffectationComponent.prototype.openFirst = function (id) {
        this.openLocalite = id;
        this.tabOpen[0] = id;
        this.offUnderSub(1);
    };
    AffectationComponent.prototype.offUnderSub = function (j) {
        for (var i = j; i < this.tabOpen.length; i++) {
            if (this.tabOpen[i])
                this.tabOpen[i] = 0;
        }
    };
    AffectationComponent.prototype.getCurrentSubById = function (id) {
        var _a;
        var l = (_a = this.getOnById(id)) === null || _a === void 0 ? void 0 : _a.subdivisions;
        return l ? l : [];
    };
    AffectationComponent.prototype.openOther = function (i, id) {
        this.tabOpen[i] = id;
        this.offUnderSub(i + 1); //les surdivisions en dessous
    };
    AffectationComponent.prototype.getRole = function (role, show) {
        if (show === void 0) { show = true; }
        var r1 = '', r2 = '';
        if (role && (role == 'Superviseur' || role[0] == "ROLE_Superviseur")) {
            r1 = 'Superviseur';
            r2 = "ROLE_Superviseur";
        }
        else if (role && (role == 'Superviseur général' || role[0] == "ROLE_SuperViseurGene")) {
            r1 = 'Superviseur général';
            r2 = "ROLE_SuperViseurGene";
        }
        else if (role && (role == 'Superviseur adjoint' || role[0] == "ROLE_SuperViseurAdjoint")) {
            r1 = 'Superviseur adjoint';
            r2 = "ROLE_SuperViseurAdjoint";
        }
        else if (role && (role == 'Guest' || role[0] == "ROLE_Guest")) {
            r1 = 'Guest';
            r2 = "ROLE_Guest";
        }
        else if (role && (role == 'Président du comité' || role[0] == "ROLE_PC")) {
            r1 = 'Président du comité';
            r2 = "ROLE_PC";
        }
        else if (role && (role == 'Membre du comité' || role[0] == "ROLE_MC")) {
            r1 = 'Membre du comité';
            r2 = "ROLE_MC";
        }
        else if (role && (role == "Chef d'équipe" || role[0] == "ROLE_CE" || role == "Chef d'équipe de comptage")) {
            r1 = "Chef d'équipe de comptage";
            r2 = "ROLE_CE";
        }
        else if (role && (role == "Membre inventaire" || role[0] == "ROLE_MI" || role == "Membre d'équipe de comptage")) {
            r1 = "Membre d'équipe de comptage";
            r2 = "ROLE_MI";
        }
        if (show)
            return r1;
        return r2;
    };
    AffectationComponent.prototype.checkAllLoc = function () {
        var _this = this;
        var allIsCheck = this.allLocIsChec();
        if (allIsCheck) {
            //ne pas mettre this.tabLoc=[] car si un superviseur adjout enleve tous il doit reste ceux des autres sup adjoints
            this.localites.forEach(function (localite) {
                if (_this.inTab(localite.id, _this.tabLoc))
                    _this.checkLoc(localite);
            });
            return;
        }
        this.localites.forEach(function (localite) {
            if (!_this.inTab(localite.id, _this.tabLoc))
                _this.checkLoc(localite);
        });
    };
    AffectationComponent.prototype.allLocIsChec = function () {
        var _this = this;
        var bool = true;
        this.localites.forEach(function (localite) {
            if (bool)
                bool = _this.inTab(localite.id, _this.tabLoc);
        });
        return bool;
    };
    AffectationComponent.prototype.checkLoc = function (loc, addOnly) {
        if (addOnly === void 0) { addOnly = false; }
        /** revoir car ca doit etre de la forme {localite,debut,fin} */
        var index = this.tabLoc.indexOf(loc.id);
        if (index > -1 && !addOnly) {
            this.tabLoc.splice(index, 1);
        }
        else if (index <= -1) {
            this.tabLoc.push(loc.id);
            var idParent = loc.idParent;
            if (idParent && !this.inTab(idParent, this.tabLoc))
                this.checkLoc(this.getOnById(idParent)); //cocher les parents recursif
        }
    };
    __decorate([
        core_1.ViewChild(ngx_datatable_1.DatatableComponent, { static: false })
    ], AffectationComponent.prototype, "table");
    AffectationComponent = __decorate([
        core_1.Component({
            selector: 'app-affectation',
            templateUrl: './affectation.component.html',
            styleUrls: ['./affectation.component.sass']
        })
    ], AffectationComponent);
    return AffectationComponent;
}());
exports.AffectationComponent = AffectationComponent;
