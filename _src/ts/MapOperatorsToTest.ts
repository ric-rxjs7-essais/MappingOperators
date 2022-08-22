import { interval, Observable, Observer, Subscription } from "rxjs";
import { switchMap, mergeMap, concatMap, exhaustMap, take, map } from "rxjs/operators";

export type Tuple2Numbers = [number, number];

export enum MapOperatorsIds {
    SwitchMap = 1,
    ConcatMap = 2,
    ExhaustMap = 3,
    MergeMap = 4,
}


//** Encapsule la gestion du map Operator RxJs choisi, et la Souscription (subscribe) **
export class MapOperatorsToTest {

    public static readonly mapOperatorsIds = [
        MapOperatorsIds.SwitchMap,
        MapOperatorsIds.ConcatMap,
        MapOperatorsIds.ExhaustMap,
        MapOperatorsIds.MergeMap 
    ];

    //Correspondance un ID => un map Operator de RxJs
    private static readonly mapOperatorsMappings: Map<MapOperatorsIds, Function> = new Map<MapOperatorsIds, Function>([
        [MapOperatorsIds.SwitchMap, switchMap],
        [MapOperatorsIds.ConcatMap, concatMap],
        [MapOperatorsIds.ExhaustMap, exhaustMap],
        [MapOperatorsIds.MergeMap, mergeMap],
    ]);

    private testedMapOperator: Function; //Vaudra switchMap, concatMap, exhaustMap ou mergeMap
    private currentSubscription: Subscription = null;

    public constructor(
        private mainStreamObservable$: Observable<any>, //stream principal sur lequel on fera un pipe( this.testedMapOperator(...)).subscribe(this.fSubscriber)
        private nbInnerEmissionsForEachMainStreamEmittedValue, //nb. de inner émissions (take) pour chaque émission du stream principal
        private fSubscriber: Observer<any>, //Lambda (()=>void) représentant le coprs du subscribe.
    ) {
        this.changeTestedMapOperator(MapOperatorsToTest.mapOperatorsIds[0]);
    }
    
    public changeTestedMapOperator(mapOperatorId: MapOperatorsIds): void {
        //Récup. du map Operator RxJs demandé (mapOperatorId)
        this.testedMapOperator = MapOperatorsToTest.getMapOperatorById(mapOperatorId); //renvoie switchMap, ou concatMap, ou exhaustMap, ou mergeMap

        //Construction de l'Observable final, et subscribe sur celui-ci.
        this.createSubscription(); //Comme on a changé de map operator, on annule la souscription en cours et en recrée une nouvelle.
    }  

    public static getMapOperatorById(mapOperatorId: MapOperatorsIds): Function {
    
        return this.mapOperatorsMappings.get(mapOperatorId);
    }
    
    private createSubscription(): void {
        this.cancelCurrentSubscription(); //Annule l'éventuelle souscription réalisée ici.

        this.currentSubscription = this.getFinalPipedObservable$().subscribe(this.fSubscriber);        
        // console.log(this.fSubscriber);
    }

    private getFinalPipedObservable$(): Observable<any> {
        //Pour transmettre au subscriber l'index de l'émission principale et l'index de l'interval,
        //sous forme de Tuple2Numbers.
        //Pour chaque valeur mainStreamEmissionCount, on inner-émettra
        //this.nbInnerEmissionsForEachMainStreamEmittedValue valeurs (via interval(..))
        return this.mainStreamObservable$
            .pipe(
                this.testedMapOperator //<< vaut switchMap, ou concatMap, ou exhaustMap, ou mergeMap
                (
                    (mainStreamEmissionCount: number) => {  

                        return interval(1000).pipe(
                            map((intervalIndex: number) =>{
                                //Conversion juste pour renvoyer 2 valeurs :
                                //mainStreamEmissionCount et intervalIndex, au lieu de juste intervalIndex.
                                const retour: Tuple2Numbers = [
                                    mainStreamEmissionCount, //No d'émission du main stream
                                    intervalIndex //Data à transmettre également.
                                ];
                                return(retour);
                            }),
                            take(this.nbInnerEmissionsForEachMainStreamEmittedValue) //On n'émettra que les 
                                                        //this.nbInnerEmissionsForEachMainStreamEmittedValue 
                                                        //1ères émissions de interval(...)
                        );

                    }
                )
            );
    }
    
    private cancelCurrentSubscription(): void {
        this.currentSubscription?.unsubscribe(); //Rem. annule l'écoute en cours du flux en question.
        this.currentSubscription = null;
    }
}