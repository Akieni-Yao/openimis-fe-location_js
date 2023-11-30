import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import ReplayIcon from "@material-ui/icons/Replay";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import {
  formatMessageWithValues,
  withModulesManager,
  withHistory,
  historyPush,
  Form,
  ProgressOrError,
  journalize,
  coreConfirm,
  parseData,
  Helmet,
} from "@openimis/fe-core";
import {
  createCentre,
  fetchCenter
  //     createTask,
  //     fetchTaskGroup,
  //     fetchTaskGroupMutation,
  //     fetchFullTaskGroupSummaries,
  //     clearTaskGroup
} from "../actions";
import CenterLocationMasterPanel from "./CenterLocationMasterPanel";

const styles = (theme) => ({
  lockedPage: theme.page.locked,
});

class CenterLocationForm extends Component {
  state = {
    lockNew: false,
    reset: 0,
    taskGroupUser: this._newTaskGroupUser(),
    newTaskGroupUser: true,
    confirmedAction: null,
  };

  _newTaskGroupUser() {
    let taskGroupUser = {};
    // family.jsonExt = {};
    return taskGroupUser;
  }

  componentDidMount() {
    if (this.props.taskGroupUUID) {
      this.setState(
        (state, props) => ({ taskGroupUUID: props.taskGroupUUID }),
        (e) => this.props.fetchCenter(this.props.modulesManager, this.props.taskGroupUUID),
      );
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevProps.fetchedTaskGroup && !!this.props.fetchtaskGroupUsercreatetedTaskGroup) {
      var taskGroupUser = this.props?.taskGroupUser;
      if (taskGroupUser) {
        this.setState({ taskGroupUser, taskGroupUUID: taskGroupUser[0].uuid, lockNew: false, newTaskGroupUser: false });
      }
    } else if (prevProps.taskGroupUUID && !this.props.taskGroupUUID) {
      this.setState({
        taskGroupUser: this._newTaskGroupUser(),
        newTaskGroupUser: true,
        lockNew: false,
        taskGroupUUID: null,
      });
    }
    // else if (prevProps.submittingMutation && !this.props.submittingMutation) {
    //     this.props.journalize(this.props.mutation);
    //     this.setState((state, props) => ({
    //         taskGroupUser: { ...state.taskGroupUser, clientMutationId: props.mutation.clientMutationId },
    //     }));
    // }
    else if (prevProps.confirmed !== this.props.confirmed && !!this.props.confirmed && !!this.state.confirmedAction) {
      this.state.confirmedAction();
    }
  }

  _add = () => {
    this.setState(
      (state) => ({
        taskGroupUser: this._newTaskGroupUser(),
        newTaskGroupUser: true,
        lockNew: false,
        // reset: state.reset + 1,
      }),
      (e) => {
        this.props.add();
        this.forceUpdate();
      },
    );
  };

  reload = () => {};

  canSave = () => {
    // if (!this.state?.taskGroupUser?.name) return false;
    // if (!this.state?.taskGroupUser?.center) return false;
    // if (!this.state?.taskGroupUser?.user) return false;
    // if(!this.state?.taskGroupUser?.department) return false;
    return true;
  };

  _save = (taskGroupUser) => {
    console.log('payload',taskGroupUser);
    this.setState(
      { lockNew: !taskGroupUser[0]?.uuid }, // avoid duplicates
      (e) => this.props.save(taskGroupUser),
    );
  };

  onEditedChanged = (taskGroupUser) => {
    // console.log(taskGroupUser,"taskGroupUser")
    this.setState({ taskGroupUser, newTaskGroupUser: false });
  };

  onActionToConfirm = (title, message, confirmedAction) => {
    this.setState({ confirmedAction }, this.props.coreConfirm(title, message));
  };
  onHandlerClose = () => {
    this.props.setIsSucess(false);
  };
  render() {
    const {
      modulesManager,
      classes,
      state,
      rights,
      taskGroupUUID,
      readOnly = false,
      add,
      save,
      back,
      fetchedTaskGroup,
      fetchingTaskGroup,
      // taskGroupUser,
      errorTaskGroup,
      mutation,
      sucess,
      sucessMessage,
      handleClose,
      setIsSucess,
      intl,
    } = this.props;
    console.log(taskGroupUUID,"taskGroupUUID")
    const { taskGroupUser } = this.state;
    let runningMutation = !!taskGroupUser && !!taskGroupUser.clientMutationId;
    let actions = [];
    if (taskGroupUUID || !!taskGroupUser.clientMutationId) {
      actions.push({
        doIt: this.reload,
        icon: <ReplayIcon />,
        onlyIfDirty: !readOnly && !runningMutation,
      });
    }
    return (
      <div className={!!runningMutation ? classes.lockedPage : null}>
        <ProgressOrError progress={fetchingTaskGroup} error={errorTaskGroup} />
        {((!!fetchedTaskGroup && !!taskGroupUser && taskGroupUser[0]?.uuid === taskGroupUUID) || !taskGroupUUID) && (
          <Form
            module="location"
            title={taskGroupUUID ? "location.task.title" : "location.task.newTitle"}
            edited_id={taskGroupUUID}
            edited={taskGroupUser}
            reset={this.state.reset}
            back={back}
            add={!!add ? this._add : null}
            readOnly={readOnly || runningMutation}
            actions={actions}
            HeadPanel={CenterLocationMasterPanel}
            taskGroupUser={taskGroupUser}
            onEditedChanged={this.onEditedChanged}
            updateAttribute={this.updateAttribute}
            canSave={this.canSave}
            save={!!save ? this._save : null}
            onActionToConfirm={this.onActionToConfirm}
            openDirty={save}
          />
        )}
        {sucess && (
          <Snackbar
            open={sucess}
            anchorOrigin={{ horizontal: "center", vertical: "top" }}
            onClose={this.onHandlerClose}
          >
            <Alert variant="filled" severity="success">
              {sucessMessage}
            </Alert>
          </Snackbar>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  rights: state.core?.user?.i_user?.rights ?? [],
  taskGroupUser: state?.admin?.taskGroups?.items,
  fetchingTaskGroup: state.admin.taskGroups.isFetching,
  errorTaskGroup: state.admin.taskGroups.error,
  fetchedTaskGroup: state.admin.taskGroups.isFetched,
  submittingMutation: state.admin.submittingMutation,
  mutation: state.admin.taskGroups.mutation,
  confirmed: state.core.confirmed,
  state: state,
  // isChfIdValid: state.insuree?.validationFields?.insureeNumber?.isValid,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      createCentre,
      fetchCenter
      // createTask,
      // fetchTaskGroup,
      // fetchTaskGroupMutation,
      // fetchFullTaskGroupSummaries,
    },
    dispatch,
  );
};

export default withHistory(
  withModulesManager(
    connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(CenterLocationForm)))),
  ),
);
