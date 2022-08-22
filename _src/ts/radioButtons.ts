import { MapOperatorsIds, MapOperatorsToTest } from "./MapOperatorsToTest";

export const initRadioButtons = 
    (onMapOperatorChange: Function) => {
        const mapOperatorsIds: Array<MapOperatorsIds> = MapOperatorsToTest.mapOperatorsIds;

        const radioGroupContainer = document.querySelector("#MapOperatorsToTestRadioGroupContainer");
        const childrenRadioButtons = radioGroupContainer.querySelectorAll("input[type='radio']");

        let radioButtonLabel: string, radioButtonValue: string;
        let radioButtonChecked: boolean;
        let radioButtonOnChange: () => void;
        childrenRadioButtons.forEach((childRadioButton: HTMLInputElement, radioButtonIndex: number) => {;
            let mapOperatorId: MapOperatorsIds = mapOperatorsIds[radioButtonIndex]; //Le "let" ici sinon dans la lambda ci-dessous ça restera sur la dernière valeur de mapOperatorId !!
            radioButtonValue = `${mapOperatorId}`;
            radioButtonLabel = MapOperatorsToTest.getMapOperatorById(mapOperatorId).name; //Libellé du MapOperator en cours, ex. : "switchMap"
            radioButtonChecked = (radioButtonIndex === 0);
            radioButtonOnChange = 
                () => {
                    onMapOperatorChange(mapOperatorId);
                }; 

            initRadioButton( //Init des attributs et du libellé du radio button en question
                childRadioButton, 
                radioButtonValue, radioButtonLabel, radioButtonChecked, radioButtonOnChange
            );    
        });
    };

const initRadioButton = (
    radioButton: HTMLInputElement, 
    radioButtonValue: string, 
    radioButtonLabel: string, 
    radioButtonChecked: boolean,
    radioButtonOnChange: ()  => void
) => {
    radioButton.setAttribute("value", radioButtonValue);

    let radioButtonLabelTag: HTMLLabelElement = (radioButton.nextSibling as HTMLLabelElement);
    radioButtonLabelTag.innerText = radioButtonLabel;
    
    radioButton.checked = radioButtonChecked;
    radioButton.addEventListener("change", radioButtonOnChange);

    //Juste pour que clic sur libellé équivale à clicker sur bouton radio.
    radioButton.setAttribute("id", radioButtonValue);
    radioButtonLabelTag.setAttribute("for", radioButtonValue); 

};