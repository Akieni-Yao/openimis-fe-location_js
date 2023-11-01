import React, { Component } from "react";
import { withModulesManager } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import ConfigBasedPicker from "./ConfigBasedPicker";

class CategoryFosaPicker extends Component {
  constructor(props) {
    super(props);
    this.categoryFosaOptions = props.modulesManager.getConf("fe-location", "locationFilter.categoryFosaOptions", [
      {
        "value": "CSI",
        "label": {
          "en": "Integrated health centers",
          "fr": "Les centre de santé intégrés",
        },
      },
      {
        "value": "CLM",
        "label": {
          "en": "Medical offices",
          "fr": "Les cabinets médicaux",
        },
      },
      {
        "value": "HDB",
        "label": {
          "en": "Basic hospitals",
          "fr": "Les hôpitaux de base",
        },
      },
      {
        "value": "HDR",
        "label": {
          "en": "Reference hospitals",
          "fr": "Les hôpitaux de référence",
        },
      },
      {
        "value": "CMC",
        "label": {
          "en": "Medical-surgical clinics ",
          "fr": "Les cliniques médico-chirurgicales",
        },
      },
      {
        "value": "HPG",
        "label": {
          "en": "General hospitals",
          "fr": "Les hôpitaux généraux",
        },
      },
      {
        "value": "LAB",
        "label": {
          "en": "Laboratories Laboratories",
          "fr": "Laboratoires Les laboratoires",
        },
      },
      {
        "value": "CIM",
        "label": {
          "en": "Medical imaging centers",
          "fr": "Les centres d’imageries médicales",
        },
      },
      {
        "value": "PHA",
        "label": {
          "en": "Pharmacies Pharmacies",
          "fr": "Pharmacies Les pharmacies",
        },
      },
      {
        "value": "CAM",
        "label": {
          "en": "Medical device centers",
          "fr": "Les Centres d’appareillage médicale",
        },
      },
    ]);
  }

  render() {
    return <ConfigBasedPicker configOptions={this.categoryFosaOptions} {...this.props} />;
  }
}

export default withModulesManager(injectIntl(CategoryFosaPicker));
