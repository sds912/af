"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.InventaireService = void 0;
var core_1 = require("@angular/core");
var InventaireService = /** @class */ (function () {
    function InventaireService(sharedService) {
        this.sharedService = sharedService;
    }
    InventaireService.prototype.addLocalite = function (data) {
        if (data.id && data.id != 0) {
            return this.sharedService.putElement(data, "/localites/" + data.id);
        }
        delete data.id;
        return this.sharedService.postElement(data, "/localites");
    };
    InventaireService.prototype.getLocalite = function (id) {
        return this.sharedService.getElement("/localites/" + id);
    };
    InventaireService.prototype.deleteLoc = function (id) {
        return this.sharedService.deleteElement("/localites/" + id);
    };
    InventaireService.prototype.getInventaire = function () {
        return this.sharedService.getElement("/inventaires");
    };
    InventaireService.prototype.getInventaireByEse = function (id) {
        return this.sharedService.getElement("/inventaires?entreprise.id=" + id);
    };
    InventaireService.prototype.addInventaire = function (data) {
        var formData = new FormData();
        formData.append('dateInv', data.dateInv);
        formData.append('debut', data.debut);
        formData.append('fin', data.fin);
        formData.append('lieuReunion', data.lieuReunion);
        formData.append('dateReunion', data.dateReunion);
        var decisionCC = data.decisionCC;
        for (var i = 1; i <= decisionCC.length; i++) {
            formData.append('decisionCC' + i, decisionCC[i - 1]);
        }
        formData.append('countDecisionCC', decisionCC.length);
        formData.append('presiComite', data.presiComite);
        formData.append('membresCom', data.membresCom);
        formData.append('presentsReunion', data.presentsReunion);
        formData.append('presentsReunionOut', data.presentsReunionOut);
        formData.append('entreprise', data.entreprise);
        formData.append('localites', data.localites);
        formData.append('localInstructionPv', data.localInstructionPv);
        var instrucCreer = data.instrucCreer;
        if (data.localInstructionPv[0] == 'creation') {
            formData.append('bloc1e1', instrucCreer.bloc1e1);
            formData.append('bloc1e2', instrucCreer.bloc1e2);
            formData.append('bloc1e3', instrucCreer.bloc1e3);
            formData.append('bloc2e1', instrucCreer.bloc2e1);
            formData.append('bloc2e2', instrucCreer.bloc2e2);
            formData.append('bloc2e3', instrucCreer.bloc2e3);
            formData.append('bloc3e1', instrucCreer.bloc3e1);
            formData.append('bloc3e2', instrucCreer.bloc3e2);
            formData.append('bloc3e3', instrucCreer.bloc3e3);
            formData.append('bloc3e4', instrucCreer.bloc3e4);
            formData.append('signataireInst', instrucCreer.signataire);
        }
        else {
            var instructions = data.instructions;
            for (var i = 1; i <= instructions.length; i++) {
                formData.append('instruction' + i, instructions[i - 1]);
            }
            formData.append('countInstruction', instructions.length);
        }
        var pvReunionCreer = data.pvReunionCreer;
        if (data.localInstructionPv[1] == 'creation') {
            formData.append('pvCB1', pvReunionCreer[0][0]);
            formData.append('pvCB2', pvReunionCreer[0][1]);
            formData.append('pvCB3', pvReunionCreer[0][2]);
            formData.append('pvCB4', pvReunionCreer[0][3]); //signataires
            var tabDel = pvReunionCreer[1];
            for (var i = 1; i <= tabDel.length; i++) {
                formData.append('pvDelTitre' + i, tabDel[i - 1].titre);
                formData.append('pvDelContent' + i, tabDel[i - 1].content);
            }
            formData.append('countPvCreer', tabDel.length);
        }
        else {
            var pvReunion = data.pvReunion;
            for (var i = 1; i <= pvReunion.length; i++) {
                formData.append('pvReunion' + i, pvReunion[i - 1]);
            }
            formData.append('countPvReunion', pvReunion.length);
        }
        if (data.id && data.id != 0) {
            return this.sharedService.postElement(formData, "/inventaires/" + data.id); //si put avec form data tableau
        }
        return this.sharedService.postElement(formData, "/inventaires");
    };
    InventaireService.prototype.getDataForMobile = function (id) {
        return this.sharedService.getElement("/mobile/data/" + id);
    };
    InventaireService.prototype.getStatusInstr = function (id) {
        return this.sharedService.getElement("/approve_insts/status/inventaire/" + id);
    };
    InventaireService.prototype.approvInstr = function (id) {
        return this.sharedService.getElement("/approve_insts/inventaire/" + id);
    };
    InventaireService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], InventaireService);
    return InventaireService;
}());
exports.InventaireService = InventaireService;
