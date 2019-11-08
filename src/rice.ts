import Q = require('q');
import Contracts = require('TFS/WorkItemTracking/Contracts');
import { WorkItemFormService } from 'TFS/WorkItemTracking/Services';

import { IStoredFieldReferences } from './stored-field-references';

function GetStoredFields() {
  const deferred = Q.defer();
  VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData)
    .then((dataService: IExtensionDataService) => {
      dataService.getValue<IStoredFieldReferences>('storedFields')
        .then((storedFields: IStoredFieldReferences) => {
          if (storedFields) {
            deferred.resolve(storedFields);
          } else {
            deferred.reject('Failed to retrieve fields from storage');
          }
        });
    });
  return deferred.promise;
}

function getWorkItemFormService() {
  return WorkItemFormService.getService();
}

function updatePrioritisationScoreOnForm(storedFields: IStoredFieldReferences) {
  getWorkItemFormService()
    .then((service) => {
      service.getFields()
        .then((fields: Contracts.WorkItemField[]) => {
          const matchingAnsoffProcutValueFields = fields.filter((f: Contracts.WorkItemField) => f.referenceName === storedFields.ansoffProductField);
          const matchingAnsoffMarketValueFields = fields.filter((f: Contracts.WorkItemField) => f.referenceName === storedFields.ansoffMarketField);
          const matchingAnsoffScoreValueFields = fields.filter((f: Contracts.WorkItemField) => f.referenceName === storedFields.ansoffScoreField);
          const matchingGEAttrValueFields = fields.filter((f: Contracts.WorkItemField) => f.referenceName === storedFields.geAttractivenessField);
          const matchingGEBusinessStrengthValueFields = fields.filter((f: Contracts.WorkItemField) => f.referenceName === storedFields.geBusinessStrengthField);
          const matchingGEScoreValueFields = fields.filter((f: Contracts.WorkItemField) => f.referenceName === storedFields.geScoreField);
          const matchingRiskLiklihoodValueFields = fields.filter((f: Contracts.WorkItemField) => f.referenceName === storedFields.riskLiklihoodField);
          const matchingRiskConsequencesValueFields = fields.filter((f: Contracts.WorkItemField) => f.referenceName === storedFields.riskConsequencesField);
          const matchingRiskScoreValueFields = fields.filter((f: Contracts.WorkItemField) => f.referenceName === storedFields.riskScoreField);

          if (matchingAnsoffProcutValueFields.length > 0 && matchingAnsoffMarketValueFields.length > 0 && 
            matchingAnsoffScoreValueFields.length > 0 && matchingGEAttrValueFields.length > 0 && 
            matchingGEBusinessStrengthValueFields.length > 0 && matchingGEScoreValueFields.length > 0 &&
            matchingRiskLiklihoodValueFields.length > 0 && matchingRiskConsequencesValueFields.length > 0 &&
            matchingRiskScoreValueFields.length > 0) {
            service.getFieldValues([storedFields.ansoffMarketField, storedFields.ansoffProductField, storedFields.ansoffScoreField, storedFields.geAttractivenessField, storedFields.geBusinessStrengthField, storedFields.geScoreField, storedFields.riskConsequencesField, storedFields.riskLiklihoodField, storedFields.riskScoreField])
              .then((values) => {
                const ansoffMarketValue = values[storedFields.ansoffMarketField];
                const ansoffProductValue = values[storedFields.ansoffProductField];

                var ansoffResult = calculateAnsoff(<string>ansoffMarketValue, <string>ansoffProductValue);
                service.setFieldValue(storedFields.ansoffScoreField, ansoffResult);

                const geAttractivenessValue = +values[storedFields.geAttractivenessField];
                const geBuinessStrengthValue = +values[storedFields.geBusinessStrengthField];
                
                const riskLiklihoodValue = values[storedFields.riskLiklihoodField];
                const riskConsequencesValue = values[storedFields.riskConsequencesField];
                
                var riskResult = calculateRisk(<string>riskLiklihoodValue, <string>riskConsequencesValue);
                service.setFieldValue(storedFields.riskScoreField, riskResult);
                
                let priorityScore = 0;
                // if (effortValue > 0) {
                //   rice = (reachValue * impactValue * confidenceValue) / effortValue;
                // }

                service.setFieldValue(storedFields.businessValueField, priorityScore);
              });
          }
        });
    });
}

function calculateAnsoff(market: string, products: string) {
  var ansoffMatrix = Array(1);
  ansoffMatrix["New"] = [];
  ansoffMatrix["Existing"] = [];

  ansoffMatrix["New"]["New"] = "[1] Diversification";
  ansoffMatrix["New"]["Existing"] = "[3] Market Development";
  ansoffMatrix["Existing"]["New"] = "[2] Product Development";
  ansoffMatrix["Existing"]["Existing"] = "[4] Market Penetration or Stabalisation";

  if (market && products) {
    return ansoffMatrix[market][products];
  }

  return "";
}

function calculateRisk(likelihood: string, consequences: string) {
  var riskMatrix = Array(2);
  riskMatrix["Rare"] = [];
  riskMatrix["Possible"] = [];
  riskMatrix["Certain"] = [];

  riskMatrix["Rare"]["Insignificant"] = "";
  riskMatrix["Rare"]["Moderate"] = "";
  riskMatrix["Rare"]["Catastrophic"] = "";

  riskMatrix["Possible"]["Insignificant"] = "";
  riskMatrix["Possible"]["Moderate"] = "";
  riskMatrix["Possible"]["Catastrophic"] = "";

  riskMatrix["Certain"]["Insignificant"] = "";
  riskMatrix["Certain"]["Moderate"] = "";
  riskMatrix["Certain"]["Catastrophic"] = "";

  if (likelihood && consequences) {
    return riskMatrix[likelihood][consequences];
  }

  return "";
}

const formObserver = () => {
  return {
    onFieldChanged: (args) => {
      GetStoredFields()
        .then((storedFields: IStoredFieldReferences) => {
          if (storedFields && storedFields.ansoffMarketField && storedFields.ansoffProductField && storedFields.ansoffScoreField && 
            storedFields.geAttractivenessField && storedFields.geBusinessStrengthField && storedFields.geScoreField && 
            storedFields.riskLiklihoodField && storedFields.riskConsequencesField && storedFields.riskScoreField) {
            if (!args.changedFields[storedFields.ansoffMarketField] || !args.changedFields[storedFields.ansoffProductField] || !args.changedFields[storedFields.ansoffScoreField] || 
              !args.changedFields[storedFields.geAttractivenessField] || !args.changedFields[storedFields.geBusinessStrengthField] || !args.changedFields[storedFields.geScoreField] ||
                !args.changedFields[storedFields.riskLiklihoodField] || !args.changedFields[storedFields.riskConsequencesField] || !args.changedFields[storedFields.riskScoreField]) {
              updatePrioritisationScoreOnForm(storedFields);
            }
          } else {
            console.log('Unable to calculate Prioritisation Score, please configure fields on the collection settings page.');
          }
        }, (reason) => {
          console.log(reason);
        });
    },

    onLoaded: () => {
      GetStoredFields()
        .then((storedFields: IStoredFieldReferences) => {
          if (storedFields && storedFields.ansoffMarketField && storedFields.ansoffProductField && storedFields.ansoffScoreField && 
            storedFields.geAttractivenessField && storedFields.geBusinessStrengthField && storedFields.geScoreField && 
            storedFields.riskLiklihoodField && storedFields.riskConsequencesField && storedFields.riskScoreField) {
            updatePrioritisationScoreOnForm(storedFields);
          } else {
            console.log('Unable to calculate Prioritisation Score, please configure fields on the collection settings page.');
          }
        }, (reason) => {
          console.log(reason);
        });
    }
  };
};

const extensionContext = VSS.getExtensionContext();
VSS.register(`${extensionContext.publisherId}.${extensionContext.extensionId}.rice-work-item-form-observer`, formObserver);
