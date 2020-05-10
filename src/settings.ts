import './settings.scss';

import Q = require('q');
import Contracts = require('TFS/WorkItemTracking/Contracts');
import WIT_Client = require('TFS/WorkItemTracking/RestClient');
import Controls = require('VSS/Controls');
import { Combo, IComboOptions } from 'VSS/Controls/Combos';
import Menus = require('VSS/Controls/Menus');

import { IStoredFieldReferences } from './stored-field-references';

export class Settings {
  selectedFields: IStoredFieldReferences;
  fields: Contracts.WorkItemField[];
  menuBar = null;
  changeMade = false;

  public initialize() {
    const menubarOptions = {
      items: [
        { id: 'save', icon: 'icon-save', title: 'Save the selected field' }
      ],
      executeAction: (args) => {
        const command = args.get_commandName();
        switch (command) {
          case 'save':
            this.save();
            break;
          default:
            console.log('Unhandled action: ' + command);
            break;
        }
      }
    };
    const riceContainer = $('#rice-settings');
    this.menuBar = Controls.create<Menus.MenuBar, any>(Menus.MenuBar, riceContainer, menubarOptions);

    //Ansoff Fields
    const ansoffProductContainer = $('<div />').addClass('settings-control').appendTo(riceContainer);
    $('<label />').text('Ansoff Product Field').appendTo(ansoffProductContainer);

    const ansoffMarketContainer = $('<div />').addClass('settings-control').appendTo(riceContainer);
    $('<label />').text('Ansoff Market Field').appendTo(ansoffMarketContainer);

    const ansoffScoreContainer = $('<div />').addClass('settings-control').appendTo(riceContainer);
    $('<label />').text('Ansoff Score Field').appendTo(ansoffScoreContainer);

    //GE Fields
    const geAttractivenessContainer = $('<div />').addClass('settings-control').appendTo(riceContainer);
    $('<label />').text('GE Attractiveness Field').appendTo(geAttractivenessContainer);

    const geBusinessStrengthContainer = $('<div />').addClass('settings-control').appendTo(riceContainer);
    $('<label />').text('GE Business Strength Field').appendTo(geBusinessStrengthContainer);

    const geScoreContainer = $('<div />').addClass('settings-control').appendTo(riceContainer);
    $('<label />').text('GE Score Field').appendTo(geScoreContainer);

    //Risk Field
    const riskLiklihoodContainer = $('<div />').addClass('settings-control').appendTo(riceContainer);
    $('<label />').text('Risk Liklihood Field').appendTo(riskLiklihoodContainer);

    const riskConsequencesContainer = $('<div />').addClass('settings-control').appendTo(riceContainer);
    $('<label />').text('Risk Consequences Field').appendTo(riskConsequencesContainer);

    const riskScoreContainer = $('<div />').addClass('settings-control').appendTo(riceContainer);
    $('<label />').text('Risk Score Field').appendTo(riskScoreContainer);

    const strategyContainer = $('<div />').addClass('settings-control').appendTo(riceContainer);
    $('<label />').text('Strategically Aligned Field').appendTo(strategyContainer);

    VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData)
      .then((dataService: IExtensionDataService) => {
        dataService.getValue<IStoredFieldReferences>('storedFields')
          .then((storedFields: IStoredFieldReferences) => {
            if (storedFields) {
              this.selectedFields = storedFields;
            } else {
              this.selectedFields = {
                ansoffProductField: null,
                ansoffMarketField: null,
                ansoffScoreField: null,
                geAttractivenessField: null,
                geBusinessStrengthField: null,
                geScoreField: null,
                riskLiklihoodField: null,
                riskConsequencesField: null,
                riskScoreField: null,
                strategyField: null,
                businessValueField: 'Microsoft.VSTS.Common.BusinessValue'
              };
            }

            this.getSortedFieldsList().then((fieldList) => {
              Controls.create(Combo, ansoffProductContainer, this.getComboOptions('ansoffProductValue', fieldList, this.selectedFields.ansoffProductField));
              Controls.create(Combo, ansoffMarketContainer, this.getComboOptions('ansoffMarketValue', fieldList, this.selectedFields.ansoffMarketField));
              Controls.create(Combo, ansoffScoreContainer, this.getComboOptions('ansoffScoreValue', fieldList, this.selectedFields.ansoffScoreField));
              
              Controls.create(Combo, geAttractivenessContainer, this.getComboOptions('geAttractivenessValue', fieldList, this.selectedFields.geAttractivenessField));
              Controls.create(Combo, geBusinessStrengthContainer, this.getComboOptions('geBusinessStrengthValue', fieldList, this.selectedFields.geBusinessStrengthField));
              Controls.create(Combo, geScoreContainer, this.getComboOptions('geScoreValue', fieldList, this.selectedFields.geScoreField));

              Controls.create(Combo, riskLiklihoodContainer, this.getComboOptions('riskLiklihoodValue', fieldList, this.selectedFields.riskLiklihoodField));
              Controls.create(Combo, riskConsequencesContainer, this.getComboOptions('riskConsequencesValue', fieldList, this.selectedFields.riskConsequencesField));
              Controls.create(Combo, riskScoreContainer, this.getComboOptions('riskScoreValue', fieldList, this.selectedFields.riskScoreField));

              Controls.create(Combo, strategyContainer, this.getComboOptions('strategyValue', fieldList, this.selectedFields.strategyField));

              this.updateSaveButton();

              VSS.notifyLoadSucceeded();
            });
          });
      });
  }

  private getSortedFieldsList() {
    const deferred = Q.defer();
    WIT_Client.getClient()
      .getFields()
      .then((fields: Contracts.WorkItemField[]) => {
        this.fields = fields;
        const sortedFields = this.fields.map((f: Contracts.WorkItemField) => f.name).sort((field1, field2) => {
          if (field1 > field2)
            return 1;
          else if (field1 < field2)
            return -1;
          else
            return 0;
        });
        deferred.resolve(sortedFields);
      });

    return deferred.promise;
  }

  private getComboOptions(id, fieldsList, initialField): IComboOptions {
    const that = this;
    return {
      id,
      mode: 'drop',
      source: fieldsList,
      enabled: true,
      value: that.getFieldName(initialField),
      change() {
        that.changeMade = true;
        const fieldName = this.getText();
        const fieldReferenceName: string = (this.getSelectedIndex() < 0) ? null : that.getFieldReferenceName(fieldName);

        switch (this._id) {
          case 'ansoffProductValue':
            that.selectedFields.ansoffProductField = fieldReferenceName;
            break;
          case 'ansoffMarketValue':
            that.selectedFields.ansoffMarketField = fieldReferenceName;
            break;
          case 'ansoffScoreValue':
            that.selectedFields.ansoffScoreField = fieldReferenceName;
          case 'geAttractivenessValue':
            that.selectedFields.geAttractivenessField = fieldReferenceName;
            break;
          case 'geBusinessStrengthValue':
            that.selectedFields.geBusinessStrengthField = fieldReferenceName;
            break;
          case 'geScoreValue':
            that.selectedFields.geScoreField = fieldReferenceName;
            break;
          case 'riskLiklihoodValue':
            that.selectedFields.riskLiklihoodField = fieldReferenceName;
            break;
          case 'riskConsequencesValue':
            that.selectedFields.riskConsequencesField = fieldReferenceName;
            break;
          case 'riskScoreValue':
            that.selectedFields.riskScoreField = fieldReferenceName;
            break;
          case 'strategyValue':
            that.selectedFields.strategyField = fieldReferenceName;
            break;
        }
        that.updateSaveButton();
      }
    };
  }

  private save() {
    VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData)
      .then((dataService: IExtensionDataService) => {
        dataService.setValue<IStoredFieldReferences>('storedFields', this.selectedFields)
          .then((storedFields: IStoredFieldReferences) => {
            this.changeMade = false;
            this.updateSaveButton();
          });
      });
  }

  private getFieldName(fieldReferenceName): string {
    let matchingFields = this.fields.filter((f: Contracts.WorkItemField) => f.referenceName === fieldReferenceName);
    return (matchingFields.length > 0) ? matchingFields[0].name : null;
  }

  private getFieldReferenceName(fieldName): string {
    let matchingFields = this.fields.filter((f: Contracts.WorkItemField) => f.name === fieldName);
    return (matchingFields.length > 0) ? matchingFields[0].referenceName : null;
  }

  private updateSaveButton() {
    const buttonState = (this.selectedFields.ansoffMarketField && this.selectedFields.ansoffProductField && this.selectedFields.ansoffScoreField &&
      this.selectedFields.geAttractivenessField && this.selectedFields.geBusinessStrengthField && this.selectedFields.geScoreField &&
      this.selectedFields.riskConsequencesField && this.selectedFields.riskLiklihoodField && this.selectedFields.riskScoreField &&
      this.selectedFields.strategyField) && this.changeMade
      ? Menus.MenuItemState.None : Menus.MenuItemState.Disabled;

    // Update the disabled state
    this.menuBar.updateCommandStates([
      { id: 'save', disabled: buttonState },
    ]);
  }
}
