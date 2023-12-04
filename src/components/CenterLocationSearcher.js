import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Grid, IconButton, Tooltip } from "@material-ui/core";
import { Search as SearchIcon, People as PeopleIcon, Tab as TabIcon, Delete as DeleteIcon } from "@material-ui/icons";
import {
  withModulesManager,
  formatMessageWithValues,
  formatDateFromISO,
  formatMessage,
  withHistory,
  historyPush,
  coreConfirm,
  journalize,
  Searcher,
  PublishedComponent,
  ConfirmDialog,
} from "@openimis/fe-core";
import EditIcon from "@material-ui/icons/Edit";
import { fetchCentersSummaries, deleteCentre } from "../actions";
import CenterLocationFilter from "./CenterLocationFilter";
import DeleteCenterDailog from "./DeleteCenterDailog";
// import DeleteTaskGroupDailog from "./DeleteTaskGroupDailog";

// const INSUREE_SEARCHER_CONTRIBUTION_KEY = "insuree.InsureeSearcher";
const getAligns = () => {
  const aligns = getHeaders().map(() => null);
  aligns.splice(-1, 1, "right");
  return aligns;
};

const styles = (theme) => ({
  horizontalButtonContainer: theme.buttonContainer.horizontal,
});
class CenterLocationSearcher extends Component {
  state = {
    open: false,
    chfid: null,
    confirmedAction: null,
    reset: 0,
    deleteUser: null,
    params: {},
    defaultParams: {},
  };

  constructor(props) {
    super(props);
    this.rowsPerPageOptions = props.modulesManager.getConf(
      "fe-insuree",
      "insureeFilter.rowsPerPageOptions",
      [10, 20, 50, 100],
    );
    this.defaultPageSize = props.modulesManager.getConf("fe-insuree", "insureeFilter.defaultPageSize", 10);
    this.locationLevels = this.props.modulesManager.getConf("fe-location", "location.Location.MaxLevels", 4);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.submittingMutation && !this.props.submittingMutation) {
      this.props.journalize(this.props.mutation);
      this.setState({ reset: this.state.reset + 1 });
    } else if (!prevProps.confirmed && this.props.confirmed && !!this.state.confirmedAction) {
      this.state.confirmedAction();
    }
  }

  fetch = (prms) => {
    this.props.fetchCentersSummaries(prms);
  };

  rowIdentifier = (r) => r.uuid;

  filtersToQueryParams = (state) => {
    let prms = Object.keys(state.filters)
      .filter((f) => !!state.filters[f]["filter"])
      .map((f) => state.filters[f]["filter"]);
    if (!state.beforeCursor && !state.afterCursor) {
      prms.push(`first: ${state.pageSize}`);
    }
    if (!!state.afterCursor) {
      prms.push(`after: "${state.afterCursor}"`);
      prms.push(`first: ${state.pageSize}`);
    }
    if (!!state.beforeCursor) {
      prms.push(`before: "${state.beforeCursor}"`);
      prms.push(`last: ${state.pageSize}`);
    }
    // if (!!state.orderBy) {
    //   prms.push(`orderBy: ["${state.orderBy}"]`);
    // }
    return prms;
  };

  headers = (filters) => {
    var h = [
      "Location.center",
      "Location.location",
      // ...Array.from(Array(this.locationLevels)).map((_, i) => `location.locationType.${i}`),
      " ",
      " ",
    ];
    return h.filter(Boolean);
  };

  sorts = () => {
    var results = [
      ["center", true],
      ["location", true],
    ];
    // _.times(this.locationLevels, () => results.push(null));
    // results.push(["validityFrom", false], ["validityTo", false]);
    return results;
  };
  getAligns = () => {
    const aligns = this.headers().map(() => null);
    aligns.splice(-1, 1, "right");
    return aligns;
  };
  styles = (theme) => ({
    horizontalButtonContainer: theme.buttonContainer.horizontal,
  });
  
  deleteUser = (isConfirmed) => {
    if (!!isConfirmed) {
      this.setState({ deleteUser: null });
    } else {
      const user = this.state.deleteUser;
      this.setState({ deleteUser: null }, async () => {
        await this.props.deleteCentre(
          this.props.modulesManager,
          user,
          formatMessage(this.props.intl, "admin.user", "deleteDialog.title"),
        );
        this.fetch(["first: 10", 'orderBy: ["name"]']);
      });
    }
  };
  onTaskGroupUser = (u) => {
    historyPush(this.props.modulesManager, this.props.history, "location.centerNew", [u.uuid]);
  };
  itemFormatters = (filters) => {
    var formatters = [(taskgroup) => taskgroup.name, (taskgroup) => taskgroup.location.name];
    formatters.push((taskgroup) => (
      <div>
        <Grid container wrap="wrap" spacing="1">
          <Grid item>
            <IconButton
              onClick={(e) => {
                this.onTaskGroupUser(taskgroup);
              }}
              styles={{ marginTop: "10px" }}
            >
              <EditIcon />
            </IconButton>
          </Grid>
          {/* {this.props.rights.includes(RIGHT_taskgroup_DELETE) && !taskgroup.validityTo && ( */}
          <Grid item>
            <Tooltip title={formatMessage(this.props.intl, "admin.user", "deleteUser.tooltip")}>
              <IconButton onClick={() => this.setState({ deleteUser: taskgroup })}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </div>
    ));
    return formatters.filter(Boolean);
  };

  rowDisabled = (selection, i) => !!i.validityTo;
  rowLocked = (selection, i) => !!i.clientMutationId;

  render() {
    const {
      intl,
      cacheFiltersKey,
      onDoubleClick,
      centerGroupPageInfo,
      errorCentersList,
      fetchedCenters,
      fetchingCenters,
      CentersList,
    } = this.props;
    let count = !!centerGroupPageInfo && centerGroupPageInfo.totalCount;
    // let count =
    //   !!centerGroupPageInfo && centerGroupPageInfo.totalCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (
      <>
        {this.state.deleteUser && (
          <DeleteCenterDailog
            task={this.state.deleteUser}
            onConfirm={this.deleteUser}
            onCancel={(e) => this.setState({ deleteUser: null })}
          />
        )}
        <Searcher
          module="location"
          cacheFiltersKey={cacheFiltersKey}
          FilterPane={CenterLocationFilter}
          items={CentersList}
          itemsPageInfo={!!centerGroupPageInfo ? centerGroupPageInfo : []}
          fetchingItems={fetchingCenters}
          fetchedItems={fetchedCenters}
          errorItems={errorCentersList}
          tableTitle={formatMessageWithValues(intl, "location", "Location.centerTitile", { count })}
          fetch={this.fetch}
          rowIdentifier={(r) => r.uuid}
          filtersToQueryParams={this.filtersToQueryParams}
          defaultOrderBy="name"
          headers={this.headers}
          // aligns={this.getAligns}
          itemFormatters={this.itemFormatters}
          // sorts={this.sorts}
          rowDisabled={(_, i) => i.validityTo || i.clientMutationId}
          rowLocked={(_, i) => i.clientMutationId}
          onDoubleClick={onDoubleClick}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  submittingMutation: state.insuree.submittingMutation,
  mutation: state.insuree.mutation,
  confirmed: state.core.confirmed,
  taskGroup: state.admin.taskGroupSummary.items,
  centerGroupPageInfo: state.loc.centerPageInfo,
  fetchingTaskGroup: state.admin.taskGroupSummary.isFetching,
  fetchedTaskGroup: state.admin.taskGroupSummary.fetched,
  errorTaskGroup: state.admin.taskGroupSummary.error,
  fetchingCenters: state.loc.fetchingCenters,
  fetchedCenters: state.loc.fetchedCenters,
  CentersList: state.loc.CentersList,
  errorCentersList: state.loc.errorCentersList,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ journalize, coreConfirm, fetchCentersSummaries, deleteCentre }, dispatch);
};

export default withModulesManager(
  withHistory(connect(mapStateToProps, mapDispatchToProps)(injectIntl(CenterLocationSearcher))),
);