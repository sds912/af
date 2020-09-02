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
exports.InstructionComponent = void 0;
var core_1 = require("@angular/core");
var image_1 = require("src/app/administration/components/entreprise/image");
var pdfmake_1 = require("pdfmake/build/pdfmake");
var vfs_fonts_1 = require("pdfmake/build/vfs_fonts");
pdfmake_1["default"].vfs = vfs_fonts_1["default"].pdfMake.vfs;
var InstructionComponent = /** @class */ (function () {
    function InstructionComponent(sharedService, securityServ, inventaireServ) {
        this.sharedService = sharedService;
        this.securityServ = securityServ;
        this.inventaireServ = inventaireServ;
        this.idCurrentEse = null;
        this.inventaires = [];
        this.currentInv = null;
        this.idCurrentInv = null;
        this.show = false;
        this.instructions = [];
        this.creation = false;
        this.entreprise = null;
        this.urlInst = null;
        this.color = 'accent';
        this.checked = false;
        this.docLink = this.sharedService.baseUrl + "/documents/";
    }
    InstructionComponent.prototype.ngOnInit = function () {
        this.idCurrentEse = localStorage.getItem("currentEse");
        this.getInventaireByEse();
    };
    InstructionComponent.prototype.getInventaireByEse = function () {
        var _this = this;
        this.inventaireServ.getInventaireByEse(this.idCurrentEse).then(function (rep) {
            var _a;
            _this.inventaires = rep;
            _this.currentInv = rep ? rep[0] : null;
            _this.traitementInst(_this.currentInv);
            _this.idCurrentInv = (_a = _this.currentInv) === null || _a === void 0 ? void 0 : _a.id;
            _this.getStatusInstr(_this.idCurrentInv);
            _this.show = true;
        }, function (error) {
            _this.securityServ.showLoadingIndicatior.next(false);
            console.log(error);
        });
    };
    InstructionComponent.prototype.getStatusInstr = function (id) {
        var _this = this;
        if (id) {
            this.inventaireServ.getStatusInstr(id).then(function (rep) { return _this.checked = rep == 0 ? false : true; });
        }
    };
    InstructionComponent.prototype.approvInstr = function () {
        var _this = this;
        if (this.idCurrentInv) {
            this.inventaireServ.approvInstr(this.idCurrentInv).then(function (rep) { return _this.checked = true; });
        }
    };
    InstructionComponent.prototype.traitementInst = function (inventaire) {
        console.log(inventaire);
        this.entreprise = inventaire === null || inventaire === void 0 ? void 0 : inventaire.entreprise;
        this.creation = (inventaire === null || inventaire === void 0 ? void 0 : inventaire.localInstructionPv[0]) == "creation";
        this.instructions = inventaire === null || inventaire === void 0 ? void 0 : inventaire.instruction;
        if (this.creation) {
            this.generatePdf(this.instructions);
        }
    };
    InstructionComponent.prototype.inventaireChange = function (id) {
        this.currentInv = this.inventaires.find(function (inv) { return inv.id == id; });
        this.traitementInst(this.currentInv);
    };
    InstructionComponent.prototype.pageInst = function (data) {
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
    InstructionComponent.prototype.getImage = function () {
        var _a, _b, _c;
        if (((_a = this.entreprise) === null || _a === void 0 ? void 0 : _a.image) && ((_b = this.entreprise) === null || _b === void 0 ? void 0 : _b.image) != image_1.IMAGE64)
            return [{ image: (_c = this.entreprise) === null || _c === void 0 ? void 0 : _c.image, width: 75 }];
        return [{}];
    };
    InstructionComponent.prototype.getEntete = function () {
        var e = this.entreprise;
        return [
            [
                { text: "" + (e === null || e === void 0 ? void 0 : e.denomination), border: [false, false, false, false], margin: [-5, 0, 0, 0] }
            ],
            [
                { text: "" + (e === null || e === void 0 ? void 0 : e.republique) + "/" + (e === null || e === void 0 ? void 0 : e.ville), border: [false, false, false, false], margin: [-5, 0, 0, 0] }
            ]
        ];
    };
    InstructionComponent.prototype.getSignatairePdf = function (signataires) {
        if (!signataires || signataires.length == 0)
            return [{}];
        if (signataires.length == 2)
            return this.getOneSignatairePdf(signataires);
        if (signataires.length == 6)
            return this.get3SignatairePdf(signataires); //modif
        return this.getOtherSignatairePdf(signataires);
    };
    InstructionComponent.prototype.getOneSignatairePdf = function (signataires) {
        return [
            { text: signataires[0], margin: [0, 20, 0, 0], fontSize: 10, decoration: '' },
            { text: signataires[1], margin: [10, 2, 0, 0], fontSize: 10, decoration: '' },
        ];
    };
    InstructionComponent.prototype.get3SignatairePdf = function (signataires) {
        return [
            {
                table: {
                    widths: ["*", "*"],
                    body: [
                        [
                            { text: signataires[0] + '\n' + signataires[1], fontSize: 10, margin: [0, 20, 0, 0], decoration: '', border: [false, false, false, false] },
                            { text: signataires[4] + '\n' + signataires[5], fontSize: 10, margin: [0, 20, 0, 0], decoration: '', border: [false, false, false, false], alignment: 'right' },
                        ],
                        [
                            { text: signataires[2] + '\n' + signataires[3], fontSize: 10, margin: [0, 20, 0, 0], decoration: '', border: [false, false, false, false], alignment: 'center', colSpan: 2 }, {},
                        ]
                    ]
                }
            }
        ];
    };
    InstructionComponent.prototype.getOtherSignatairePdf = function (signataires) {
        return [
            {
                table: {
                    widths: ["*", "*"],
                    body: __spreadArrays(this.lignesSignataires(signataires))
                }
            }
        ];
    };
    InstructionComponent.prototype.lignesSignataires = function (signataires) {
        var tab = [];
        for (var i = 0; i < signataires.length; i += 4) {
            tab.push([
                { text: signataires[i] + '\n' + signataires[i + 1], fontSize: 10, margin: [0, 20, 0, 70], border: [false, false, false, false] },
                { text: signataires[i + 2] + '\n' + signataires[i + 3], fontSize: 10, margin: [0, 20, 0, 70], alignment: 'right', border: [false, false, false, false] },
            ]);
        }
        return tab;
    };
    InstructionComponent.prototype.generatePdf = function (instruction) {
        var _this = this;
        var documentDefinition = {
            content: [this.pageInst(instruction)], styles: this.getStyle(), pageMargins: [40, 40]
        };
        pdfmake_1["default"].createPdf(documentDefinition).getBase64(function (encodedString) {
            var v = 'data:application/pdf;base64, ' + encodedString;
            _this.urlInst = v;
        });
    };
    InstructionComponent.prototype.getStyle = function () {
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
    InstructionComponent = __decorate([
        core_1.Component({
            selector: 'app-instruction',
            templateUrl: './instruction.component.html',
            styleUrls: ['./instruction.component.sass']
        })
    ], InstructionComponent);
    return InstructionComponent;
}());
exports.InstructionComponent = InstructionComponent;
