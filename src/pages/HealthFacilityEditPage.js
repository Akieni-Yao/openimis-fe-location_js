import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { formatMessageWithValues, withModulesManager, withHistory, historyPush } from "@openimis/fe-core";
import { createOrUpdateHealthFacility } from "../actions";
import { RIGHT_HEALTH_FACILITY_ADD, RIGHT_HEALTH_FACILITY_EDIT } from "../constants";
import HealthFacilityForm from "../components/HealthFacilityForm";
import CommonSnackbar from "../components/CommonSnackbar";

const styles = (theme) => ({
  page: theme.page,
  isOpenSnackbar: false,
  fosaCode: null,
  statusInsuree: null,
  snackbarMsg: null,
});

class HealthFacilityEditPage extends Component {
  add = () => {
    historyPush(this.props.modulesManager, this.props.history, "location.route.healthFacilityEdit");
  };

  save = async (hf) => {
    const createHealthFacility = await this.props.createOrUpdateHealthFacility(
      hf,
      formatMessageWithValues(
        this.props.intl,
        "location",
        !hf.uuid ? "CreateHealthFacility.mutationLabel" : "UpdateHealthFacility.mutationLabel",
        { code: hf.code },
      ),
    );
    if (!createHealthFacility.error) {
      this.setState({ isOpenSnackbar: true });
      this.setState({
        snackbarMsg: `Health Facility ${!hf.uuid ? "Created" : "Updated"} with FOSA code `,
      });
      this.setState({
        fosaCode: JSON.parse(createHealthFacility?.healthFacilities[0]?.healthFacility?.jsonExt).f_code,
      });
    }
  };
  handleCloseSnackbar = () => this.setState({ isOpenSnackbar: false });
  render() {
    const { modulesManager, history, classes, rights, healthFacility_uuid } = this.props;
    return (
      <div className={classes.page}>
        <HealthFacilityForm
          healthFacility_uuid={healthFacility_uuid}
          back={(e) => historyPush(modulesManager, history, "location.route.healthFacilities")}
          add={rights.includes(RIGHT_HEALTH_FACILITY_ADD) ? this.add : null}
          save={rights.includes(RIGHT_HEALTH_FACILITY_EDIT) ? this.save : null}
        />
        <CommonSnackbar
          open={this.state?.isOpenSnackbar}
          onClose={this.handleCloseSnackbar}
          message={this.state?.snackbarMsg}
          severity="success"
          copyText={this.state?.fosaCode && this.state?.fosaCode}
          backgroundColor="#00913E"
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  healthFacility_uuid: props.match.params.healthFacility_uuid,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ createOrUpdateHealthFacility }, dispatch);
};

export default withHistory(
  withModulesManager(
    connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(HealthFacilityEditPage)))),
  ),
);
