import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { alpha } from "@material-ui/core/styles/colorManipulator";

const styles = (theme) => ({
  primaryHeading: {
    font: 'normal normal medium 20px/22px Roboto',
    color: '#333333'
  },
  subHeading: {
    fontWeight: 'bold'
  },
  primaryButton: {
    backgroundColor: "#FFFFFF 0% 0% no-repeat padding-box",
    border: '1px solid #999999',
    color: "#999999",
    borderRadius: '4px',
    // fontWeight: "bold",
    "&:hover": {
      backgroundColor: '#FF0000',
      border: '1px solid #FF0000',
      color: '#FFFFFF'
    },
  },//theme.dialog.primaryButton,
  secondaryButton: {
    backgroundColor: "#FFFFFF 0% 0% no-repeat padding-box",
    border: '1px solid #999999',
    color: "#999999",
    borderRadius: '4px',
    // fontWeight: "bold",
    "&:hover": {
      backgroundColor: '#FF0000',
      border: '1px solid #FF0000',
      color: '#FFFFFF'
    },
  }
});

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";

import { FormattedMessage } from "@openimis/fe-core";

// import { TaskGroupLabel } from "../pages/Utils/utils";
// import { TaskGroupUserLabel } from "../pages/Utils/Labels";

class DeleteCenterDailog extends Component {
  render() {
    const { classes, task, onCancel, onConfirm, check } = this.props;
    return (
      <Dialog open={!!task} onClose={onCancel}>
        <div style={{padding:"20px 40px"}}>
        <DialogTitle>
          {check ? <FormattedMessage module="admin" id="deleteTaskGroupUser.mutationLabel" values={{ label: TaskGroupUserLabel(task?.user?.username) }} /> : <FormattedMessage module="admin" id="deleteTaskGroup.mutationLabel" values={{ label: 'new' }} />}
        </DialogTitle>
        <DialogContent>
          <DialogContentText className={classes.primaryHeading}>
            {check ? <FormattedMessage
              module="admin"
              id="deleteTaskUserDialog.message"
              values={{ label: TaskGroupUserLabel(task?.user?.username) }}
            /> : <FormattedMessage
              module="admin"
              id="deleteTaskDialog.message"
              values={{ label: 'TaskGroupLabel(task)' }}
              style={{fontWeight: 'bold'}}
            />}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => onConfirm(false)} className={classes.primaryButton}>
            <FormattedMessage module="admin" id="task.deleteDialog" />
          </Button>
          <Button onClick={onCancel} className={classes.secondaryButton}>
            <FormattedMessage module="core" id="cancel" />
          </Button>
        </DialogActions>
        </div>
      </Dialog>

    );
  }
}

export default injectIntl(withTheme(withStyles(styles)(DeleteCenterDailog)));
