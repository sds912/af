"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.InventaireComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var pdfmake_1 = require("pdfmake/build/pdfmake");
var vfs_fonts_1 = require("pdfmake/build/vfs_fonts");
var image_1 = require("src/app/administration/components/entreprise/image");
var keycodes_1 = require("@angular/cdk/keycodes");
var fonction_sign_component_1 = require("../fonction-sign/fonction-sign.component");
pdfmake_1["default"].vfs = vfs_fonts_1["default"].pdfMake.vfs;
var InventaireComponent = /** @class */ (function () {
    function InventaireComponent(fb, _snackBar, dialog, adminServ, sharedService, securityServ, modalService, inventaireServ) {
        this.fb = fb;
        this._snackBar = _snackBar;
        this.dialog = dialog;
        this.adminServ = adminServ;
        this.sharedService = sharedService;
        this.securityServ = securityServ;
        this.modalService = modalService;
        this.inventaireServ = inventaireServ;
        this.fonctionIns = '';
        this.nomIns = '';
        this.isLinear = false;
        this.imgLink = "";
        this.docLink = "";
        this.inventaires = [];
        this.idCurrentInv = 0;
        this.show = false;
        this.idPresiComite = 0;
        this.instructions = [];
        this.docsPv = [];
        this.docsDc = [];
        this.tabComite = new forms_1.FormArray([]);
        this.tabPresents = new forms_1.FormArray([]);
        this.tabOtherPresent = new forms_1.FormArray([]);
        this.presidents = [];
        this.membresComite = [];
        this.users = [];
        this.myId = "";
        this.entreprises = [];
        this.localites = [];
        this.idCurrentEse = 0;
        this.showForm = false; //remettre à false
        this.tabLoc = [];
        this.comments = [];
        this.commentsPv = [];
        this.invCreer = false;
        this.pvCreer = false;
        this.tabDeliberation = new forms_1.FormArray([]);
        this.urlInst = '';
        this.urlPv = '';
        this.locHover = null;
        this.zoneHover = null;
        this.szHover = null;
        this.entreprise = null;
        this.signatairesPv = [];
        this.signPvCtrl = new forms_1.FormControl();
        this.separatorKeysCodes = [keycodes_1.ENTER, keycodes_1.COMMA];
        this.signatairesInst = [];
        this.signInstCtrl = new forms_1.FormControl();
        this.signInstFunctionCtrl = new forms_1.FormControl();
        this.subdivisions = []; //leurs libelles
        this.tabOpen = [];
        this.openLocalite = null;
        this.titleAdd = "Ajouter un inventaire";
        this.titleAdd = this.securityServ.superviseurAdjoint ? "Demandez au superviseur général de créer l'inventaire" : "Ajouter un inventaire";
        this.imgLink = this.sharedService.baseUrl + "/images/";
        this.docLink = this.sharedService.baseUrl + "/documents/";
    } //afficher que la 1ere sub et modifier Localite par sub[0]
    InventaireComponent.prototype.ngOnInit = function () {
        this.myId = localStorage.getItem('idUser');
        this.securityServ.showLoadingIndicatior.next(true);
        this.initForm();
        this.initInstrucForm();
        this.comments = this.getCommentInst();
        this.initPvForm();
        this.commentsPv = this.getCommentPv();
        this.getOneEntreprise();
        this.addFuctionSign = this.fb.group({
            functionSign: ['', [forms_1.Validators.required]]
        });
    };
    InventaireComponent.prototype.openDialog = function () {
        var dialogRef = this.dialog.open(fonction_sign_component_1.FonctionSignComponent, {
            data: { name: 'Papa Laye Kane' }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('The dialog was closed');
        });
    };
    InventaireComponent.prototype.getOneEntreprise = function () {
        var _this = this;
        var idEse = localStorage.getItem("currentEse");
        this.adminServ.getOneEntreprise(idEse).then(function (rep) {
            var _a, _b;
            var e = rep;
            if (e) {
                _this.idCurrentEse = e.id;
                _this.localites = rep.localites;
                _this.getUsers(rep.users);
                _this.getInventaireByEse();
                _this.subdivisions = (e === null || e === void 0 ? void 0 : e.subdivisions) ? e === null || e === void 0 ? void 0 : e.subdivisions : [];
                if (((_a = _this.tabOpen) === null || _a === void 0 ? void 0 : _a.length) == 0)
                    (_b = _this.subdivisions) === null || _b === void 0 ? void 0 : _b.forEach(function (sub) { return _this.tabOpen.push(0); });
            }
            _this.entreprise = rep;
            //this.securityServ.showLoadingIndicatior.next(false)
        }, function (error) {
            _this.securityServ.showLoadingIndicatior.next(false);
            console.log(error);
        });
    };
    InventaireComponent.prototype.getInventaireByEse = function (add) {
        var _this = this;
        if (add === void 0) { add = false; }
        this.inventaireServ.getInventaireByEse(this.idCurrentEse).then(function (rep) {
            _this.securityServ.showLoadingIndicatior.next(false); //ne pas sup sinon revoir celui de onEditSave
            var inv = rep;
            if (inv && inv.length > 0) {
                inv = rep.reverse();
                if (add)
                    _this.idCurrentInv = inv[0].id;
            }
            _this.inventaires = inv;
            _this.show = true;
        }, function (error) {
            _this.securityServ.showLoadingIndicatior.next(false);
            console.log(error);
        });
    };
    InventaireComponent.prototype.addNew = function () {
        var _this = this;
        var _a;
        this.showForm = true;
        this.idPresiComite = 0;
        this.instructions = [];
        this.docsPv = [];
        this.docsDc = [];
        this.tabComite = new forms_1.FormArray([]);
        this.tabPresents = new forms_1.FormArray([]);
        this.tabOtherPresent = new forms_1.FormArray([]);
        this.tabLoc = [];
        this.tabDeliberation = new forms_1.FormArray([]);
        this.pvCreer = false;
        this.invCreer = false;
        this.signatairesPv = [];
        this.signatairesInst = [];
        this.tabOpen = [];
        (_a = this.subdivisions) === null || _a === void 0 ? void 0 : _a.forEach(function (sub) { return _this.tabOpen.push(0); });
        this.initForm();
    };
    InventaireComponent.prototype.updateOne = function (inventaire) {
        var _this = this;
        var _a;
        this.showForm = true;
        this.idPresiComite = (_a = inventaire.presiComite) === null || _a === void 0 ? void 0 : _a.id;
        this.instructions = inventaire.instruction;
        this.docsPv = inventaire.pvReunion;
        this.docsDc = inventaire.decisionCC;
        this.tabComite = new forms_1.FormArray([]);
        inventaire.membresCom.forEach(function (membre) { return _this.addComMembre(membre.id); });
        if (this.tabComite.length == 0)
            this.addComMembre();
        this.tabPresents = new forms_1.FormArray([]);
        inventaire.presentsReunion.forEach(function (membre) { return _this.addPresentMembre(membre.id); });
        if (this.tabPresents.length == 0)
            this.addPresentMembre();
        this.tabOtherPresent = new forms_1.FormArray([]);
        inventaire.presentsReunionOut.forEach(function (nom) { return _this.addOtherPres(nom); });
        if (this.tabOtherPresent.length == 0)
            this.addOtherPres();
        this.tabLoc = [];
        inventaire.localites.forEach(function (loc) { return _this.checkLoc(_this.getOneLocById(loc.id)); }); //this.getOneLocById a cause de la serialisation
        this.invCreer = false;
        if (inventaire.localInstructionPv[0] == 'creation') {
            this.invCreer = true;
            this.initInstrucForm(inventaire.instruction);
        }
        this.pvCreer = false;
        if (inventaire.localInstructionPv[1] == 'creation') {
            this.pvCreer = true;
            var data = inventaire.pvReunion;
            this.tabDeliberation = new forms_1.FormArray([]);
            data[1].forEach(function (del) { return _this.addDeliberation(del[0], del[1]); });
            this.initPvForm([
                data[0][0], data[0][1], data[0][2],
                data[0][3] ? data[0][3] : []
            ]);
            if (this.tabDeliberation.length == 0)
                this.addDeliberation();
        }
        this.initForm(inventaire);
    };
    InventaireComponent.prototype.initForm = function (data) {
        if (data === void 0) { data = { id: 0, dateInv: new Date().getFullYear() + '-12-31T00:00:00+00:00', debut: '', fin: '', lieuReunion: '', dateReunion: '' }; }
        this.editForm = this.fb.group({
            id: [data.id],
            dateInv: [data.dateInv],
            debut: [data.debut],
            fin: [data.fin],
            lieuReunion: [data.lieuReunion],
            dateReunion: [data.dateReunion]
        }, {
            validator: this.valideDif('debut', 'fin')
        });
        if (this.formDirective)
            this.formDirective.resetForm();
    };
    InventaireComponent.prototype.initInstrucForm = function (data) {
        if (data === void 0) { data = [["", "", ""], ["", "", ""], ["", "", "", ""], []]; }
        this.instForm = this.fb.group({
            bloc1e1: [data[0][0]],
            bloc1e2: [data[0][1]],
            bloc1e3: [data[0][2]],
            bloc2e1: [data[1][0]],
            bloc2e2: [data[1][1]],
            bloc2e3: [data[1][2]],
            bloc3e1: [data[2][0]],
            bloc3e2: [data[2][1]],
            bloc3e3: [data[2][2]],
            bloc3e4: [data[2][3]]
        });
        this.signatairesInst = data[3] ? data[3] : [];
    };
    InventaireComponent.prototype.detailsLoc = function (inventaire) {
        var _this = this;
        var _a;
        this.tabLoc = [];
        this.tabOpen = [];
        inventaire.localites.forEach(function (localite) { return _this.tabLoc.push(_this.getOneLocById(localite.id)); }); //this.getOneLocById car serialisation fait que l objet n est pas complet
        (_a = this.subdivisions) === null || _a === void 0 ? void 0 : _a.forEach(function (sub) { return _this.tabOpen.push(0); });
    };
    InventaireComponent.prototype.initPvForm = function (data) {
        if (data === void 0) { data = ["", "", "", []]; }
        this.pvForm = this.fb.group({
            bloc1: [data[0]],
            bloc2: [data[1]],
            bloc3: [data[2]]
        });
        this.signatairesPv = this.getSignatairePv(data[3]);
    };
    InventaireComponent.prototype.getSignatairePv = function (data) {
        if ((data === null || data === void 0 ? void 0 : data.length) > 0)
            return data;
        return [];
    };
    InventaireComponent.prototype.getInstValDef = function () {
        return [
            [
                "La réunion de lancement de l'inventaire sera tenue le 20/12. Les points suivants seront abordés:\n - la composition des équipes;\n  - la méthode de comptage…",
                "ACQUISITIONS\nPour l'acquisition d'immobilisations, une demande d'achat initiée par le service demandeur. Cette demande est validée par le Chef comptable. Ensuite, un Bon de Commande est établi et sera signé par le DAF et le DG. Après réception de l'immobilisation, un code barre est généré et apposé sur l'immobilisation.\n\nCESSIONS\nToutes les sorties doivent faire l'objet d'un bon validé par le Chef du magasin, le DAF et le DG.",
                "Il faudra:\n - Editer le fichier des immobilisations\n - Faire une revue des postes  \n - Procéder aux régularisations nécessaires devant permettre de s'assurer de l'exactitude des mouvements de l'année",
            ],
            [
                "Le Comité d'inventaire est mis en place sera composé de:\n- M. Pathé Ndiaye (Président);\n- Mme Isabelle Diouf (membre);\n- M. Saliou Ba (membre)\n\nIl devra:\n  - mettre en place toute la logistique nécessaire pour le démarrage effectif de l'inventaire physique à la date prévue ( constitution et formation des équipes, matériel nécessaire etc..);\n  - prendre toutes les dispositions pour l'organisation et la supervision de l'inventaire;\n  - valider les résultats de l'inventaire et élaborer un rapport d'inventaire.",
                "1. MAGASIN\nLe rangement des magasins avec vérification des CODES se fera effectué avant le 09/10. Le magasin est composé de 2 dépôts.\n1.1. Dépôt 01\nLe dépôt 01 sera divisé en 02 sous-zones de stockage :\n    - Sous-zone A : salle 1 et 2 (Equipe A)\n    - Sous-zone B : Cour extérieure (Equipe A).\n1.2. Dépôt 02 \nLe dépôt 02 sera divisé en 02 Sous-zones de stockage :\n - Sous-zone A : Showroom (Equipe B)\n    - Sous-zone B : salle des pièces de rechange (Equipe B)\n\n2. ENTREPOT\nLe comptage sera effectué par l'équipe C.",
                "ORGANISATION\nLe rangement des magasins sera effectué à partir du Mercredi 09/12.\nIl faudra s’assurer que les étiquettes à code barre ont été apposées sur toutes les immobilisations.\n\nCOMPTAGE\nLe fichier des immobilisations sera remis à chaque équipe. Des étiquettes (gommettes) de couleur bleue et un lecteur de codes seront aussi transmis à chaque chef d’équipe. \n\nCONTROLE\nAprès le comptage, une autre équipe  passe pour le contrôle en utilisant des étiquettes (gommettes) de couleur verte.\n\nANOMALIES\nEn cas de désaccord entre l’équipe de comptage et de contrôle, un comptage contradictoire sera piloté par le comité d’inventaire (Etiquettes de couleur rouge)."
            ],
            [
                "Cette phase consistera à effectuer un rapprochement entre le fichier des immobilisations et les résultats de l'inventaire et afin d'identifier:\n  - les immobilisations inscrites au fichier mais non inventoriées (manquants d'inventaire);\n  - et les immobilisations inventoriées mais non inscrites au fichier (sans numéro d'immatriculation et/ou sans étiquettes).\n\nLes écarts constatés doivent faire l'objet de recherches complémentaires, par les équipes de comptage, en vue de leur résorption. S'agissant des articles recensés au cours de cet inventaire, mais non inscrits au fichier des immobilisations, il conviendra de les répertorier sur un tableau séparé. En outre, des dispositions devront être prises pour veiller à leur immatriculation diligente au fichier des immoblisations.",
                "Les anomalies retracées devront être analysées et corrigées, au plus le 15 janvier.",
                "L'inventaire sera appouvé par le comité d'inventaire.",
                "Le dossier à constituer devra comporter les documents ci-après:\n- un procès-verbal d'inventaire;\n- les annexes avant et après corrections"
            ]
        ];
    };
    InventaireComponent.prototype.getPvValDef = function () {
        return [
            "L’AN DEUX MILLE VINGT \nET LE 09 JUILLET A 08 HEURES 10 MINUTES",
            "La réunion de lancement de l'inventaire a été tenue au siège social sis à l'avenue Bourgui pour délibérer sur l’ordre du jour suivant :  \n1.	Instructions d'inventaire\n2.	Planning de l'inventaire\n3.	Questions diverses.",
            "Une feuille de présence a été émargée en début de séance par chaque participant. \nEtaient présent : \n-	M. Pathé Ndiaye (Président du comité),…",
            "Les instructions d'inventaire ont été transmises à tous les intervenants. Ces derniers ont attesté avoir pris connaissance de celles-ci."
        ];
    };
    InventaireComponent.prototype.getCommentInst = function () {
        return [
            [
                "Commentaire :\n - Indiquer la date de réunion\n - Préciser les points qui seront traités lors de la réunion\n-  S'assurer de la disponibilité du planning des inventaires",
                "Commentaire :\n - Rappeler la procédure d'acquisition des immobilisations\n - Rappeler la procédure de sorties des immobilisations",
                "Commentaire :\n - Décrire les différentes étapes liées à l'édition et au contrôle du fichier des immoblisations\n - Identifier les intervenants"
            ],
            [
                "Commentaire :\n -Indiquer les missions du comité\n -lister les membres du comité",
                "Commentaire :\n -Lister zones à inventorier et les équipes affectées à chaque zone",
                "Commentaire :\n - Lister les biens à inventorier\n - Décrire la procédure de comptage\n- Décrire la procédure de controle"
            ],
            [
                "Commentaire :\n - Décrire la prodédure de rapprochement",
                "Commentaire :\nDécrire la procédure de correction des anomalies",
                "Commentaire :\nIndiquer la procédure d'approbation de l'inventaire",
                "Commentaire :\nIndiquer les composants du dossier d'inventaire"
            ]
        ];
    };
    InventaireComponent.prototype.getCommentPv = function () {
        return [
            "Commentaire :\nMettre la date et l'heure",
            "Commentaire :\nindiquer les points à l'ordre du jour",
            "Commentaire :\nLister les personnes présentes à la réunion"
        ];
    };
    InventaireComponent.prototype.getCommentDel = function (i) {
        var mot = 'eme';
        if (i == 0)
            mot = 'er';
        i++; // car commence par 0
        return "Commentaire :\n" + i + mot + " point à l'ordre du jour";
    };
    InventaireComponent.prototype.addDeliberation = function (titre, content) {
        if (titre === void 0) { titre = 'DÉLIBERATION ' + (this.tabDeliberation.length + 1) + " :"; }
        if (content === void 0) { content = ''; }
        this.tabDeliberation.push(new forms_1.FormGroup({
            titre: new forms_1.FormControl(titre),
            content: new forms_1.FormControl(content)
        }));
    };
    InventaireComponent.prototype.valideDif = function (controlName, matchingControlName) {
        return function (formGroup) {
            var control = formGroup.controls[controlName];
            var matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors.diffDate) {
                // return if another validator has already found an error on the matchingControl
                return;
            }
            // set error on matchingControl if validation fails
            if (new Date(control.value) > new Date(matchingControl.value)) {
                setTimeout(function () { return matchingControl.setErrors({ diffDate: true }); }, 1); //pour eviter l erreur: Expression has changed after it was checked
            }
            else {
                matchingControl.setErrors(null);
            }
        };
    };
    InventaireComponent.prototype.getUsers = function (users) {
        users = users.filter(function (u) { return u.status == "actif"; });
        this.presidents = users.filter(function (u) { return u.roles && u.roles[0] == "ROLE_PC"; });
        this.membresComite = users.filter(function (u) { return u.roles && u.roles[0] == "ROLE_MC"; });
        this.users = users; //.filter(u=>u.id!=this.myId) ne pas mettre sinon si present il n y sera ps
    };
    InventaireComponent.prototype.getUserById = function (id) {
        return this.users.find(function (u) { return u.id == id; });
    };
    InventaireComponent.prototype.onEditSave = function (form) {
        var _this = this;
        this.securityServ.showLoadingIndicatior.next(true);
        var data = this.getAllDataToSend(form);
        this.inventaireServ.addInventaire(data).then(function (rep) {
            //this.securityServ.showLoadingIndicatior.next(false) gerer par getInventaire
            _this.showNotification('bg-success', rep.message, 'top', 'center');
            var add = data.id == 0 ? true : false;
            _this.getInventaireByEse(add);
            _this.showForm = false;
        }, function (message) {
            console.log(message);
            _this.securityServ.showLoadingIndicatior.next(false);
            _this.showNotification('bg-red', message, 'top', 'right');
        });
    };
    InventaireComponent.prototype.getAllDataToSend = function (form) {
        var data = this.getData(form.value);
        data.instructions = this.getOnlyFile(this.instructions);
        data.instrucCreer = this.getDataInstCreer();
        data.decisionCC = this.getOnlyFile(this.docsDc);
        data.presiComite = this.idPresiComite;
        data.membresCom = this.tabComite.value;
        data.presentsReunion = this.tabPresents.value;
        data.presentsReunionOut = this.tabOtherPresent.value;
        data.pvReunion = this.getOnlyFile(this.docsPv);
        data.pvReunionCreer = this.getDataPvCreer();
        data.entreprise = this.idCurrentEse;
        data.localites = this.getOneLyId(this.tabLoc);
        data.localInstructionPv = [this.invCreer ? 'creation' : 'download', this.pvCreer ? 'creation' : 'download'];
        console.log(data);
        return data;
    };
    InventaireComponent.prototype.getOneLyId = function (localites) {
        var l = [];
        localites.forEach(function (loc) { return l.push(loc.id); });
        return l;
    };
    InventaireComponent.prototype.getDataInstCreer = function () {
        var d = this.instForm.value;
        d.signataire = this.signatairesInst; //on y ajoute les signataires
        return d;
    };
    InventaireComponent.prototype.getDataPvCreer = function () {
        var val = this.pvForm.value;
        var data1 = [val.bloc1, val.bloc2, val.bloc3, this.signatairesPv];
        var data2 = [];
        this.tabDeliberation.value.forEach(function (del) {
            var titre = del.titre.trim();
            var content = del.content.trim();
            if (titre != '' || content != '') {
                data2.push({ titre: titre, content: content });
            }
        });
        return [data1, data2];
    };
    InventaireComponent.prototype.getOnlyFile = function (tab) {
        var t = [];
        tab.forEach(function (element) { return t.push(element[1]); }); //0 c est le nom
        return t;
    };
    InventaireComponent.prototype.handleFileInput = function (files) {
        for (var i = 0; i < files.length; i++) {
            this.instructions.push([files.item(i).name, files.item(i)]);
        }
    };
    InventaireComponent.prototype.handleFileInputPv = function (files) {
        for (var i = 0; i < files.length; i++) {
            this.docsPv.push([files.item(i).name, files.item(i)]);
        }
    };
    InventaireComponent.prototype.handleFileInputDc = function (files) {
        for (var i = 0; i < files.length; i++) {
            this.docsDc.push([files.item(i).name, files.item(i)]);
        }
    };
    InventaireComponent.prototype.addComMembre = function (valeur) {
        if (valeur === void 0) { valeur = 0; }
        this.tabComite.push(new forms_1.FormControl(valeur));
    };
    InventaireComponent.prototype.addPresentMembre = function (valeur) {
        if (valeur === void 0) { valeur = 0; }
        this.tabPresents.push(new forms_1.FormControl(valeur));
    };
    InventaireComponent.prototype.addOtherPres = function (nom) {
        if (nom === void 0) { nom = ""; }
        this.tabOtherPresent.push(new forms_1.FormControl(nom));
    };
    InventaireComponent.prototype.closeComite = function () {
        this.closeComiteModal.nativeElement.click();
    };
    InventaireComponent.prototype.closePresent = function () {
        this.closePresentModal.nativeElement.click();
    };
    InventaireComponent.prototype.closeLoc = function () {
        this.closeLocaliteModal.nativeElement.click();
    };
    InventaireComponent.prototype.noNull = function (tab) {
        var t = [];
        tab.forEach(function (element) {
            if (element)
                t.push(element);
        });
        return t;
    };
    InventaireComponent.prototype.openComModal = function () {
        if (this.tabComite.length == 0)
            this.addComMembre();
    };
    InventaireComponent.prototype.openPresModal = function () {
        if (this.tabPresents.length == 0)
            this.addPresentMembre(parseInt(this.myId));
        if (this.tabOtherPresent.length == 0)
            this.addOtherPres();
    };
    InventaireComponent.prototype.openLocModal = function () {
    };
    InventaireComponent.prototype.inTab = function (valeur, tab) {
        return tab.find(function (id) { return id == valeur; });
    };
    InventaireComponent.prototype.deleteInst = function (index) {
        this.instructions.splice(index, 1);
    };
    InventaireComponent.prototype.deletePv = function (index) {
        this.docsPv.splice(index, 1);
    };
    InventaireComponent.prototype.deleteDc = function (index) {
        this.docsDc.splice(index, 1);
    };
    InventaireComponent.prototype.getData = function (data) {
        if (data.dateInv) {
            data.dateInv = this.formattedDate(data.dateInv);
        }
        if (data.debut) {
            data.debut = this.formattedDate(data.debut);
        }
        if (data.fin) {
            data.fin = this.formattedDate(data.fin);
        }
        if (data.dateReunion) {
            data.dateReunion = this.formattedDate(data.dateReunion);
        }
        return data;
    };
    InventaireComponent.prototype.formattedDate = function (d) {
        if (d === void 0) { d = new Date; }
        d = new Date(d);
        return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map(function (n) { return n < 10 ? "0" + n : "" + n; }).join('-');
    };
    InventaireComponent.prototype.openSnackBar = function (message) {
        this._snackBar.open(message, '', {
            duration: 2000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            panelClass: ['bg-red']
        });
    };
    InventaireComponent.prototype.showNotification = function (colorName, text, placementFrom, placementAlign) {
        this._snackBar.open(text, '', {
            duration: 2000,
            verticalPosition: placementFrom,
            horizontalPosition: placementAlign,
            panelClass: [colorName, 'color-white']
        });
    };
    InventaireComponent.prototype.rev = function (tab, rev) {
        if (rev === void 0) { rev = -1; }
        var t = [];
        if (tab && tab.length > 0) {
            t = tab;
            t = this.sharedService.uniq(t, 'id');
            this.sharedService.trier(t, 'id', rev);
        }
        return t;
    };
    InventaireComponent.prototype.deletCreationInst = function () {
        this.invCreer = false;
        this.instructions = [];
        this.initInstrucForm();
    };
    InventaireComponent.prototype.deletCreationPv = function () {
        this.pvCreer = false;
        this.docsPv = [];
        this.initPvForm();
        this.tabDeliberation = new forms_1.FormArray([]);
    };
    InventaireComponent.prototype.createNewInv = function () {
        this.invCreer = true;
        var valInstruction = this.getInstValDef();
        this.initInstrucForm(valInstruction);
    };
    InventaireComponent.prototype.createNewPv = function () {
        this.pvCreer = true;
        this.tabDeliberation = new forms_1.FormArray([]);
        var valPv = this.getPvValDef();
        this.initPvForm([valPv[0], valPv[1], valPv[2], []]);
        this.tabDeliberation = new forms_1.FormArray([]);
        var content = "Les instructions d'inventaire ont été transmises à tous les intervenants. Ces derniers ont attesté avoir pris connaissance de celles-ci.";
        var title = "DÉLIBERATION 1: INSTRUCTIONS D'INVENTAIRE";
        this.addDeliberation(title, content);
    };
    InventaireComponent.prototype.generatePdf = function (data, numero) {
        var content = [];
        if (numero == 0)
            content = [this.pageInst(data)];
        else if (numero == 1)
            content = [this.pagePv(data)];
        var documentDefinition = {
            content: content, styles: this.getStyle(), pageMargins: [40, 40]
        };
        // pdfMake.createPdf(documentDefinition).getBase64((encodedString)=> {
        //   const v='data:application/pdf;base64, '+encodedString;
        //   if(numero==0)
        //     this.urlInst=v
        //   else if(numero==1)
        //     this.urlPv=v
        //   console.log(this.urlInst);
        // });
        pdfmake_1["default"].createPdf(documentDefinition).open();
    };
    InventaireComponent.prototype.getStyle = function () {
        return {
            fsize: {
                fontSize: 6.5
            },
            enTete: {
                fontSize: 6.5,
                fillColor: '#eeeeee'
            },
            enTete2: {
                fontSize: 6.5,
                bold: true,
                fillColor: '#bcbdbc'
            },
            gris: {
                fillColor: '#bcbdbc'
            },
            grasGris: {
                bold: true,
                fillColor: '#e6e6e6'
            },
            grasGrisF: {
                bold: true,
                fillColor: '#b5b3b3'
            },
            gras: {
                bold: true
            },
            centerGG: {
                bold: true,
                fillColor: '#e6e6e6',
                alignment: 'center'
            },
            no_border: {
                border: false
            }
        };
    };
    InventaireComponent.prototype.pageInst = function (data) {
        var bloc1e1 = data[0][0];
        var bloc1e2 = data[0][1];
        var bloc1e3 = data[0][2];
        var bloc2e1 = data[1][0];
        var bloc2e2 = data[1][1];
        var bloc2e3 = data[1][2];
        var bloc3e1 = data[2][0];
        var bloc3e2 = data[2][1];
        var bloc3e3 = data[2][2];
        var bloc3e4 = data[2][3];
        var signataires = [3] ? data[3] : [];
        console.log(signataires);
        return __spreadArrays(this.getImage(), [
            {
                table: {
                    width: ['*'],
                    body: __spreadArrays(this.getEntete(), [
                        [
                            { text: '', margin: [2, 7], border: [false, false, false, false] }
                        ],
                        [
                            { text: "INSTRUCTIONS D'INVENTAIRE", style: 'grasGris', alignment: 'center' }
                        ],
                        [
                            { text: '', margin: [2, 7], border: [false, false, false, false] }
                        ],
                        [
                            { text: '1.TRAVAUX PREPARATOIRES', style: 'grasGrisF', alignment: 'center', fontSize: 12 }
                        ],
                        [
                            { text: "1.1. REUNION DE LANCEMENT DE L'INVENTAIRE", style: 'grasGris', alignment: 'center' }
                        ],
                        [
                            { text: bloc1e1, margin: [2, 7], fontSize: 10 }
                        ],
                        [
                            { text: '1.2. RAPPEL DE LA PROCEDURES SUR LES IMMOBILISATIONS', style: 'grasGris', alignment: 'center' }
                        ],
                        [
                            { text: bloc1e2, margin: [2, 7], fontSize: 10 }
                        ],
                        [
                            { text: '1.3. EDITION ET CONTRÔLE DU FICHIER DES IMMOBILISATIONS', style: 'grasGris', alignment: 'center' }
                        ],
                        [
                            { text: bloc1e3, margin: [2, 7], fontSize: 10 }
                        ],
                        [
                            { text: "2.TRAVAUX D'INVENTAIRE", style: 'grasGrisF', alignment: 'center' }
                        ],
                        [
                            { text: "2.1. MISE EN PLACE DU COMITE D'INVENTAIRE", style: 'grasGris', alignment: 'center' }
                        ],
                        [
                            { text: bloc2e1, margin: [2, 7], fontSize: 10 }
                        ],
                        [
                            { text: "2.2. AFFECTATION DES EQUIPES D'INVENTAIRE", style: 'grasGris', alignment: 'center' }
                        ],
                        [
                            { text: bloc2e2, margin: [2, 7], fontSize: 10 }
                        ],
                        [
                            { text: "2.3. DEROULEMENT DE L'INVENTAIRE", style: 'grasGris', alignment: 'center' }
                        ],
                        [
                            { text: bloc2e3, margin: [2, 7], fontSize: 10 }
                        ],
                        [
                            { text: "3.TRAVAUX POST-INVENTAIRE", style: 'grasGrisF', alignment: 'center' }
                        ],
                        [
                            { text: "3.1. RAPPROCHEMENT FICHIER D'IMMOBILISATIONS ET RESULTATS DE L'INVENTAIRE", style: 'grasGris', alignment: 'center' }
                        ],
                        [
                            { text: bloc3e1, margin: [2, 7], fontSize: 10 }
                        ],
                        [
                            { text: "3.2. CORRECTION DES ANOMALIES", style: 'grasGris', alignment: 'center' }
                        ],
                        [
                            { text: bloc3e2, margin: [2, 7], fontSize: 10 }
                        ],
                        [
                            { text: "3.3. APPROBATION D'INVENTAIRE", style: 'grasGris', alignment: 'center' }
                        ],
                        [
                            { text: bloc3e3, margin: [2, 7], fontSize: 10 }
                        ],
                        [
                            { text: "3.4. TRANSMISSION DU DOSSIER D'INVENTAIRE", style: 'grasGris', alignment: 'center' }
                        ],
                        [
                            { text: bloc3e4, margin: [2, 7], fontSize: 10 }
                        ]
                    ])
                },
                margin: [0, 10, 0, 0]
            }
        ], this.getSignatairePdf(signataires));
    };
    InventaireComponent.prototype.pagePv = function (data) {
        var bloc1 = data[0][0];
        var bloc2 = data[0][1];
        var bloc3 = data[0][2];
        var signataires = data[0][3] ? data[0][3] : [];
        return __spreadArrays(this.getImage(), [
            {
                table: {
                    width: ["*"],
                    body: __spreadArrays(this.getEntete(), [
                        [
                            { text: '', margin: [2, 7], border: [false, false, false, false] }
                        ],
                        [
                            { text: "PROCES-VERBAL DE REUNION DE LANCEMENT DE L'INVENTAIRE", style: 'grasGris', alignment: 'center' }
                        ],
                        [
                            { text: '', margin: [2, 7], border: [false, false, false, false] }
                        ],
                        [
                            { text: bloc1 + "\n\n" + bloc2 + "\n\n" + bloc3, margin: [2, 7], fontSize: 10 }
                        ]
                    ], this.getPdfDel(data[1]))
                },
                margin: [0, 10, 0, 0]
            }
        ], this.getSignatairePdf(signataires));
    };
    InventaireComponent.prototype.getImage = function () {
        if (this.entreprise.image && this.entreprise.image != image_1.IMAGE64)
            return [{ image: this.entreprise.image, width: 75 }];
        return [{}];
    };
    InventaireComponent.prototype.getEntete = function () {
        var e = this.entreprise;
        var k = e.capital ? this.sharedService.numStr(e.capital, ' ') + " FCFA" : "";
        return [
            [
                { text: "" + e.denomination, border: [false, false, false, false], margin: [-5, 0, 0, 0] }
            ],
            [
                { text: "Capital: " + k, border: [false, false, false, false], margin: [-5, 0, 0, 0] }
            ],
            [
                { text: "" + e.republique + "/" + e.ville, border: [false, false, false, false], margin: [-5, 0, 0, 0] }
            ]
        ];
    };
    InventaireComponent.prototype.getPdfDel = function (table) {
        var element = [];
        table.forEach(function (cel) {
            var _a, _b;
            if (((_a = cel[0]) === null || _a === void 0 ? void 0 : _a.trim()) != "" && ((_b = cel[1]) === null || _b === void 0 ? void 0 : _b.trim()) != "")
                element.push([
                    { text: cel[0], fontSize: 12, style: 'grasGris', alignment: 'center' },
                ], [
                    { text: cel[1], fontSize: 10, margin: [2, 7] },
                ]);
        });
        return element;
    };
    InventaireComponent.prototype.getSignatairePdf = function (signataires) {
        if (!signataires || signataires.length == 0)
            return [{}];
        if (signataires.length == 1)
            return this.getOneSignatairePdf(signataires);
        if (signataires.length == 3)
            return this.get3SignatairePdf(signataires); //modif
        return this.getOtherSignatairePdf(signataires);
    };
    InventaireComponent.prototype.getOneSignatairePdf = function (signataires) {
        return [{ text: signataires[0], margin: [0, 20, 0, 0], fontSize: 10, decoration: 'underline' }];
    };
    InventaireComponent.prototype.get3SignatairePdf = function (signataires) {
        return [
            {
                table: {
                    widths: ["*", "*"],
                    body: [
                        [
                            { text: signataires[0], fontSize: 10, margin: [0, 20, 0, 0], decoration: 'underline', border: [false, false, false, false] },
                            { text: signataires[2], fontSize: 10, margin: [0, 20, 0, 0], decoration: 'underline', border: [false, false, false, false], alignment: 'right' }
                        ],
                        [
                            { text: signataires[1], fontSize: 10, margin: [0, 0, 0, 0], decoration: 'underline', border: [false, false, false, false], alignment: 'center', colSpan: 2 }, {}
                        ]
                    ]
                }
            }
        ];
    };
    InventaireComponent.prototype.getOtherSignatairePdf = function (signataires) {
        return [
            {
                table: {
                    widths: ["*", "*"],
                    body: __spreadArrays(this.lignesSignataires(signataires))
                }
            }
        ];
    };
    InventaireComponent.prototype.lignesSignataires = function (signataires) {
        var tab = [];
        var a = 0;
        for (var i = 0; i < signataires.length; i += 2) {
            var nom1 = signataires[i];
            var nom2 = signataires[i + 1] ? signataires[i + 1] : "";
            tab.push([
                { text: nom1, fontSize: 10, margin: [0, 20, 0, 70], decoration: 'underline', border: [false, false, false, false] },
                { text: nom2, fontSize: 10, margin: [0, 20, 0, 70], decoration: 'underline', alignment: 'right', border: [false, false, false, false] }
            ]);
        }
        return tab;
    };
    InventaireComponent.prototype.overLoc = function (localite) {
        console.log(localite);
        this.locHover = localite;
    };
    InventaireComponent.prototype.overZone = function (zone) {
        console.log(zone);
        this.zoneHover = zone;
    };
    InventaireComponent.prototype.overSz = function (sz) {
        console.log(sz);
        this.szHover = sz;
    };
    InventaireComponent.prototype.outHoverLZS = function () {
        this.locHover = null;
        this.zoneHover = null;
        this.szHover = null;
    };
    InventaireComponent.prototype.longText = function (text, limit) {
        return this.sharedService.longText(text, limit);
    };
    InventaireComponent.prototype.addSignPv = function (event) {
        var input = event.input;
        var value = event.value;
        // Add our fruit
        if ((value || '').trim()) {
            this.signatairesPv.push(value.trim());
        }
        // Reset the input value
        if (input) {
            input.value = '';
        }
        this.signPvCtrl.setValue(null);
    };
    InventaireComponent.prototype.removeSignPv = function (fruit) {
        var index = this.signatairesPv.indexOf(fruit);
        if (index >= 0) {
            this.signatairesPv.splice(index, 1);
        }
    };
    InventaireComponent.prototype.addSignInst = function (event) {
        var input = event.input;
        var value = event.value;
        // Add our fruit
        if ((value || '').trim()) {
            this.signatairesInst.push(value.trim());
        }
        // Reset the input value
        if (input) {
            input.value = '';
        }
        this.signInstCtrl.setValue(null);
    };
    InventaireComponent.prototype.addSignInstFunction = function (content) {
        this.modalService.open(content);
    };
    InventaireComponent.prototype.addSignInstFunctionChange = function () {
        this.openFunctionSigndModal.nativeElement.click();
    };
    InventaireComponent.prototype.addFunctionSignSave = function (form) {
        console.log(form);
    };
    InventaireComponent.prototype.addSignInstFunctionClick = function () {
        console.log('its click');
    };
    InventaireComponent.prototype.removeSignInst = function (fruit) {
        var index = this.signatairesInst.indexOf(fruit);
        if (index >= 0) {
            this.signatairesInst.splice(index, 1);
        }
    };
    InventaireComponent.prototype.firstSub = function (localites) {
        return localites === null || localites === void 0 ? void 0 : localites.filter(function (loc) { var _a; return ((_a = loc.position) === null || _a === void 0 ? void 0 : _a.length) > 0; });
    };
    InventaireComponent.prototype.checkLoc = function (loc) {
        var index = this.tabLoc.indexOf(loc);
        if (index > -1) {
            this.tabLoc.splice(index, 1);
        }
        else {
            this.tabLoc.push(loc);
            var idParent = loc.idParent;
            if (idParent && !this.isChecked(idParent))
                this.checkLoc(this.getOneLocById(idParent)); //cocher les parents recursif
        }
    };
    InventaireComponent.prototype.checkAllLoc = function () {
        var _this = this;
        var allIsCheck = this.allLocIsChec();
        if (allIsCheck) {
            this.tabLoc = [];
            return;
        }
        this.localites.forEach(function (localite) {
            if (!_this.isChecked(localite.id))
                _this.checkLoc(localite);
        });
    };
    InventaireComponent.prototype.allLocIsChec = function () {
        var _this = this;
        var bool = true;
        this.localites.forEach(function (localite) {
            if (bool)
                bool = _this.isChecked(localite.id);
        });
        return bool;
    };
    InventaireComponent.prototype.openFirst = function (id) {
        this.openLocalite = id;
        this.tabOpen[0] = id;
        this.offUnderSub(1);
    };
    InventaireComponent.prototype.getOneLocById = function (id) {
        var _a;
        var l = (_a = this.localites) === null || _a === void 0 ? void 0 : _a.find(function (loc) { return loc.id == id; });
        return l ? l : null;
    };
    InventaireComponent.prototype.getCurrentSubById = function (id) {
        var _a;
        var l = (_a = this.getOneLocById(id)) === null || _a === void 0 ? void 0 : _a.subdivisions;
        return l ? l : [];
    };
    InventaireComponent.prototype.openOther = function (i, id) {
        this.tabOpen[i] = id;
        this.offUnderSub(i + 1); //les surdivisions en dessous
    };
    InventaireComponent.prototype.offUnderSub = function (j) {
        for (var i = j; i < this.tabOpen.length; i++) {
            if (this.tabOpen[i])
                this.tabOpen[i] = 0;
        }
    };
    InventaireComponent.prototype.isChecked = function (id) {
        return this.tabLoc.find(function (loc) { return loc.id == id; });
    };
    __decorate([
        core_1.ViewChild('closeComiteModal', { static: false })
    ], InventaireComponent.prototype, "closeComiteModal");
    __decorate([
        core_1.ViewChild('closePresentModal', { static: false })
    ], InventaireComponent.prototype, "closePresentModal");
    __decorate([
        core_1.ViewChild('closeLocaliteModal', { static: false })
    ], InventaireComponent.prototype, "closeLocaliteModal");
    __decorate([
        core_1.ViewChild('closeFunctionSigndModal', { static: false })
    ], InventaireComponent.prototype, "closeFunctionSigndModal");
    __decorate([
        core_1.ViewChild('openFunctionSigndModal', { static: true })
    ], InventaireComponent.prototype, "openFunctionSigndModal");
    __decorate([
        core_1.ViewChild('formDirective')
    ], InventaireComponent.prototype, "formDirective");
    InventaireComponent = __decorate([
        core_1.Component({
            selector: 'app-inventaire',
            templateUrl: './inventaire.component.html',
            styleUrls: ['./inventaire.component.sass']
        })
    ], InventaireComponent);
    return InventaireComponent;
}());
exports.InventaireComponent = InventaireComponent;
