import React, { Component } from "react";
import _debounce from "lodash/debounce";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Grid, Checkbox, FormControlLabel } from "@material-ui/core";
import {
  withModulesManager,
  decodeId,
  PublishedComponent,
  ControlledField,
  TextInput,
  formatMessage,
} from "@openimis/fe-core";

const styles = (theme) => ({
  dialogTitle: theme.dialog.title,
  dialogContent: theme.dialog.content,
  form: {
    padding: "0 0 10px 0",
    width: "100%",
  },
  item: {
    padding: theme.spacing(1),
  },
  paperDivider: theme.paper.divider,
});

const extractLocations = (locations) => {
  const locationsArray = Object.values(locations).map((l) => l.value);
  const region = locationsArray.find((l) => !l.parent);
  const district = region && locationsArray.find((l) => l.parent && l.parent.id === region.id);
  const municipality = district && locationsArray.find((l) => l.parent && l.parent.id === district.id);
  const village = municipality && locationsArray.find((l) => l.parent && l.parent.id === municipality.id);

  return { region, district, municipality, village };
};

const getParentLocation = (locations) => {
  const extractedLocations = extractLocations(locations);
  const { region, district, municipality, village } = extractedLocations;
  if (!region) {
    return null;
  }
  let newLocation = {
    key: "regionId",
    id: decodeId(region.id),
    value: region,
  };
  if (district) {
    newLocation = {
      key: "districtId",
      id: decodeId(district.id),
      value: district,
    };
  }
  if (municipality) {
    newLocation = {
      key: "municipalityId",
      id: decodeId(municipality.id),
      value: municipality,
    };
  }
  if (village) {
    newLocation = {
      key: "villageId",
      id: decodeId(village.id),
      value: village,
    };
  }
  return newLocation;
};

class CenterLocationFilter extends Component {
  state = {
    currentUserType: undefined,
    currentUserRoles: undefined,
    locationFilters: {},
    selectedDistrict: {},
    showHistory: false,
  };

  debouncedOnChangeFilter = _debounce(
    this.props.onChangeFilters,
    this.props.modulesManager.getConf("fe-admin", "debounceTime", 800),
  );

  filterValue = (k) => {
    const { filters } = this.props;
    return !!filters && !!filters[k] ? filters[k].value : null;
  };

  filterDistrict = (locations) => {
    const extractedLocations = extractLocations(locations);
    const { district } = extractedLocations;

    return district;
  };

  onChangeShowHistory = () => {
    const filters = [
      {
        id: "showHistory",
        value: !this.state.showHistory,
        filter: `showHistory: ${!this.state.showHistory}`,
      },
    ];
    this.props.onChangeFilters(filters);
    this.setState((state) => ({
      showHistory: !state.showHistory,
    }));
  };

  onChangeUserTypes = (currentUserType) => {
    const { onChangeFilters } = this.props;
    this.setState({ currentUserType });
    onChangeFilters([
      {
        id: "userTypes",
        value: currentUserType,
        filter: currentUserType ? `userTypes: [${currentUserType}]` : null,
      },
    ]);
  };

  onChangeUserRoles = (currentUserRoles) => {
    const { onChangeFilters } = this.props;
    this.setState({ currentUserRoles });
    onChangeFilters([
      {
        id: "roles",
        value: currentUserRoles,
        filter: currentUserRoles ? `roles: [${currentUserRoles.map((ur) => decodeId(ur.id)).join(",")}]` : null,
      },
    ]);
  };

  onChangeLocation = (newLocationFilters) => {
    const { onChangeFilters } = this.props;
    const locationFilters = { ...this.state.locationFilters };
    newLocationFilters.forEach((filter) => {
      if (filter.value === null) {
        delete locationFilters[filter.id];
      } else {
        locationFilters[filter.id] = {
          value: filter.value,
          filter: filter.filter,
        };
      }
    });
    const selectedDistrict = this.filterDistrict(locationFilters);
    this.setState({ locationFilters, selectedDistrict });
    const parentLocation = getParentLocation(locationFilters);
    const filters = [
      {
        id: "parentLocation",
        value: parentLocation.id,
        filter: parentLocation && `${parentLocation.key}: ${parentLocation.id}`,
      },
    ];
    onChangeFilters(filters);
  };
  _filterValue = (k) => {
    const { filters } = this.props;
    return !!filters[k] ? filters[k].value : null;
  };
  render() {
    const { classes, onChangeFilters, filters, intl, edited, readOnly, onChange } = this.props;
    const { locationFilters, currentUserType, currentUserRoles, selectedDistrict } = this.state;
    return (
      <section className={classes.form}>
        <Grid container>
          <Grid container className={classes.form}>
            <ControlledField
              module="location"
              // id="userFilter.username"
              field={
                <Grid item xs={3} className={classes.item}>
                  <TextInput
                    module="location"
                    label="Centers"
                    name="centers"
                    value={this.filterValue("center")}
                    onChange={(v) =>
                      this.debouncedOnChangeFilter([
                        {
                          id: "center",
                          value: v,
                          filter: `name_Icontains: "${v}"`,
                        },
                      ])
                    }
                  />
                </Grid>
              }
            />
            <ControlledField
              module="product"
              id="region"
              field={
                <Grid item xs={3} className={classes.item}>
                  <PublishedComponent
                    label={formatMessage(intl, "location", "location.LocationPicker")}
                    pubRef="location.RegionPicker"
                    value={filters.location?.value?.parent ?? filters.location?.value}
                    withNull={true}
                    onChange={(value) =>
                      onChangeFilters([
                        { id: "location", value: value, filter: value ? `location_Uuid: "${value.uuid}"` : null },
                      ])
                    }
                  />
                </Grid>
              }
            />
          </Grid>
        </Grid>
      </section>
    );
  }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(CenterLocationFilter))));
