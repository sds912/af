import { Component, OnInit } from '@angular/core';
import { InventaireService } from 'src/app/data/services/inventaire/inventaire.service';
import { SecurityService } from 'src/app/shared/service/security.service';
import { IMAGE64 } from 'src/app/modules/administration/components/entreprise/image';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ThemePalette } from '@angular/material/core';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.sass']
})
export class InstructionComponent implements OnInit {
  idCurrentEse=null
  inventaires=[]
  currentInv=null
  idCurrentInv=null
  show=false
  instructions=[]
  creation=false
  entreprise=null
  urlInst=null
  docLink

  color: ThemePalette = 'accent';
  checked = false;
  constructor(private sharedService: SharedService,public securityServ: SecurityService,private inventaireServ: InventaireService) { 
    this.docLink = this.sharedService.baseUrl + "/documents/"
  }
  
  ngOnInit(): void {
    this.idCurrentEse=localStorage.getItem("currentEse")
    this.getInventaireByEse()
  }
  getInventaireByEse() {
    this.inventaireServ.getInventaireByEse(this.idCurrentEse).then(
      rep => {
        this.inventaires = rep
        this.currentInv=rep?rep[0]:null
        this.traitementInst(this.currentInv)
        this.idCurrentInv=this.currentInv?.id
        this.getStatusInstr(this.idCurrentInv)
        this.show=true
      },
      error => {
        this.securityServ.showLoadingIndicatior.next(false)
        console.log(error)
      }
    )
  }

  getStatusInstr(id){
    if(id){
      this.inventaireServ.getStatusInstr(id).then(rep=>this.checked=rep==0?false:true) 
    }
  }

  approvInstr(){
    if(this.idCurrentInv){
      this.inventaireServ.approvInstr(this.idCurrentInv).then(rep=>this.checked=true) 
    }
  }

  traitementInst(inventaire){
    console.log(inventaire);
    this.entreprise=inventaire?.entreprise
    this.creation=inventaire?.localInstructionPv[0]=="creation"
    this.instructions=inventaire?.instruction
    if(this.creation){
      this.generatePdf(this.instructions)
    }
  }

  pageInst(data) {
    const bloc1e1 = data[0][0]
    const bloc1e2 = data[0][1]
    const bloc1e3 = data[0][2]

    const bloc2e1 = data[1][0]
    const bloc2e2 = data[1][1]
    const bloc2e3 = data[1][2]

    const bloc3e1 = data[2][0]
    const bloc3e2 = data[2][1]
    const bloc3e3 = data[2][2]
    const bloc3e4 = data[2][3]
    const signataires = [3] ? data[3] : []
    return [
      ...this.getImage(),
      {
        table: {
          width: ['*'],
          body: [
            ...this.getEntete(),
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
          ]
        }, margin: [0, 10, 0, 0]
      },
      ...this.getSignatairePdf(signataires)
    ]
  }
  getImage() {
    if (this.entreprise?.image && this.entreprise?.image != IMAGE64) return [{ image: this.entreprise?.image, width: 75 }]
    return [{}]
  }
  getEntete() {
    const e = this.entreprise
    return [
      [
        { text: "" + e?.denomination, border: [false, false, false, false], margin: [-5, 0, 0, 0] }
      ],
      [
        { text: "" + e?.republique + "/" + e?.ville, border: [false, false, false, false], margin: [-5, 0, 0, 0] }
      ]
    ]
  }
  getSignatairePdf(signataires) {
    if (!signataires || signataires.length == 0) return [{}]
    if (signataires.length == 2) return this.getOneSignatairePdf(signataires)
    if (signataires.length == 6) return this.get3SignatairePdf(signataires)//modif
    return this.getOtherSignatairePdf(signataires)
  }

  getOneSignatairePdf(signataires) {
    return [
      { text: signataires[0], margin: [0, 20, 0, 0], fontSize: 10, decoration: '' },
      { text: signataires[1], margin: [10, 2, 0, 0], fontSize: 10, decoration: '' },
    ]
  }

  get3SignatairePdf(signataires) {
    return [
      {
        table: {
          widths: ["*", "*"],
          body: [
            [
              { text: signataires[0] + '\n'+signataires[1], fontSize: 10, margin: [0, 20, 0, 0], decoration: '', border: [false, false, false, false] },
              { text: signataires[4]+'\n'+signataires[5], fontSize: 10, margin: [0, 20, 0, 0], decoration: '', border: [false, false, false, false], alignment: 'right' },
            ],
            [
              { text: signataires[2]+'\n'+signataires[3], fontSize: 10, margin: [0, 20, 0, 0], decoration: '', border: [false, false, false, false], alignment: 'center', colSpan: 2 }, {},
            ]
          ]
        }
      }
    ]
  }

  getOtherSignatairePdf(signataires) {
    return [
      {
        table: {
          widths: ["*", "*"],
          body: [
            ...this.lignesSignataires(signataires)
          ]
        }
      }
    ]
  }

  lignesSignataires(signataires) {
    let tab = []
    for (let i = 0; i < signataires.length; i += 4) {
      tab.push(
        [
          { text: signataires[i] + '\n' + signataires[i + 1], fontSize: 10, margin: [0, 20, 0, 70], border: [false, false, false, false] },
          { text: signataires[i + 2] + '\n' + signataires[i + 3], fontSize: 10, margin: [0, 20, 0, 70], alignment: 'right', border: [false, false, false, false] },
        ]
      )
    }
    return tab
  }
  generatePdf(instruction) {
    const documentDefinition = {
      content: [this.pageInst(instruction)], styles: this.getStyle(), pageMargins: [40, 40]
    };
    pdfMake.createPdf(documentDefinition).getBase64((encodedString)=> {
      const v='data:application/pdf;base64, '+encodedString;
      this.urlInst=v
    });
  }
  getStyle() {
    return {
      fsize: {
        fontSize: 6.5,
      },
      enTete: {
        fontSize: 6.5,
        fillColor: '#eeeeee',
      },
      enTete2: {
        fontSize: 6.5,
        bold: true,
        fillColor: '#bcbdbc',
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
    }
  }
}
