import { fromEvent, map, Observable, Observer } from "rxjs";

const MyConsoleTools = require('@rick.info.dev/console-tools'); //Créé en tant que librairie WebPack ! (I:\__FORMATIONS\TYPESCRIPT\zzToolCode\ConsoleTools)
// console.log(MyConsoleTools.Console);
// console.log(MyConsoleTools.ConsoleCssStyledMessage);
// console.log(MyConsoleTools.ConsoleCssStyledMessages);


import { initRadioButtons } from "./radioButtons";

import { MapOperatorsToTest, MapOperatorsIds, Tuple2Numbers } from "./MapOperatorsToTest";



export class Main {

    private mapOperatorsToTest: MapOperatorsToTest;
    
    private mainStreamButton: HTMLButtonElement;
    private mainStreamButtonClick$: Observable<number>;

    private nbInnerEmissionsForEachMainStreamButtonClick: number;

    private consoleMessagesColorMappings: Map<number, string>;
    private currentClickNumber: number = 0;

    constructor() {

        this.mainStreamButton = document.querySelector("#MainStreamButton");

        //1 Click sur le bouton => comme si une new data était émise depuis un 
        //main stream observable(le bouton en fait).
        this.mainStreamButtonClick$ = fromEvent(this.mainStreamButton, "click").pipe(
            map((event: Event) => ++this.currentClickNumber ) //On transmettra en fait,
                                                              //le No du click.
        );


        this.initConsoleMessagesColorHandling();

        this.nbInnerEmissionsForEachMainStreamButtonClick = 4; //Nb. de inner-émissions par click
        this.createMapOperatorToTestInstance();


        //======= MISE EN PLACE DES RADIO BUTTONS permattant de choisir le map Operator RxJs à tester =======
        initRadioButtons(
            (chosenMapOperatorId: MapOperatorsIds) => { //<<< Sera appelée à chaque chgt (via radio button)
                                                        //    de map Operator RxJs. 
                console.clear();
                console.log("Ci-dessous s'affichera :  No click - Inner observable data", "(1 couleur par click)", "\n\n");
                
                this.mapOperatorsToTest.changeTestedMapOperator(chosenMapOperatorId);

                this.currentClickNumber  = 0; //RAZ du numéro de click sur le bouton émetteur(stream principal).
            }
        );
                 
    }

    private createMapOperatorToTestInstance(): void {
        //Création et donc paramétrage de mon 
        //"gestionnaire de l'Observable pipé (avec l'operator de map choisi par radio button)".
        this.mapOperatorsToTest = new MapOperatorsToTest(
            this.mainStreamButtonClick$,
            this.nbInnerEmissionsForEachMainStreamButtonClick,

            { //Type Observer<any> (interface)
                next: this.getFinalSubscriberFunction(), //Lambda qui sera le contenu du subscribe en fait.
                error: (err: any) => {},
                complete: () => {}
            }
        );
    }

    //Retourne la Function qui sera le corps du subscribe().
    private getFinalSubscriberFunction(): (number)=>void { //Retourne une lambda recevant un number, et ne retournant rien.
        return (emitted: Tuple2Numbers) => {
                // console.log(emitted);

                //Récup. des 2 params, à partir du tuple reçu.
                const mainDataStreamDataIndex: number = emitted[0]; //No de click en fait
                const emissionDataNumber: number = emitted[1]; // La Data (interval(...) (inner observable))
        
                //Calculs pour la mise en forme des messages dans la console.
                const consoleMessageColor: string = this.getConsoleColor(
                    mainDataStreamDataIndex
                );
                const isLastDataEmissionForThisClick: boolean = 
                    (emissionDataNumber === this.nbInnerEmissionsForEachMainStreamButtonClick - 1);
                const fontWeight: string = (isLastDataEmissionForThisClick)? "bold" : "normal";
    
                //Affichage message dans la console.
                MyConsoleTools.Console.writeStyledMessage(
                     new MyConsoleTools.ConsoleCssStyledMessage(
                         `${mainDataStreamDataIndex} - ${emissionDataNumber}`, 
                         `color: ${consoleMessageColor}; font-weight: ${fontWeight}`
                     )
                );
                if (isLastDataEmissionForThisClick) console.log("\n");
        };
    }
                
    private initConsoleMessagesColorHandling(): void {
        //Association entre numéro de click sur bouton, et couleur des messages dans la console,
        //ceci afin de bien visualiser les inner emissions issues d'un même 
        //évènement click (this.mainStreamButtonClick$)
        this.consoleMessagesColorMappings = new Map<number, string>([
            [1, "brown"],
            [2, "blue"],
            [3, "pink"],
            [4, "cyan"],
            [5, "red"],
            [6, "green"],
            [7, "violet"],
            [8, "orange"],
            [9, "purple"],
            [10, "black"]
        ]);
        
    }

    //Renvoie la couleur (des messages dans console) en fonction du numéro de click sur le bouton émetteur.
    private getConsoleColor(clickNumber: number): string {
        clickNumber = (clickNumber % (this.consoleMessagesColorMappings.size));
        // console.log(`${clickNumber}`, this.consoleMessagesColorMappings.size );

        const color: string = this.consoleMessagesColorMappings.get(clickNumber);

        return color;
    }
    

}