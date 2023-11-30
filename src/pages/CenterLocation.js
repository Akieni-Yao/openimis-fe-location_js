import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { withModulesManager, combine, withHistory, historyPush, useTranslations } from "@openimis/fe-core";
// import UserForm from "../components/UserForm";
// import { createCentre, updateTaskGroup } from "../actions";
// import { RIGHT_TaskGroup_EDIT, Right_TaskGroup_ADD } from "../constants";
// import TaskGroupForm from "../components/TaskGroupForm";
import CenterLocationForm from "../components/CenterLocationForm";
import { createCentre } from "../actions";

const styles = (theme) => ({
  page: theme.page,
});

const CenterLocation = (props) => {
  const { modulesManager, history, match, classes } = props;
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const [resetKey, setResetKey] = useState(Date.now());
  const { formatMessageWithValues } = useTranslations("admin", modulesManager);
  const [sucess, setIsSucess] = useState(false);
  const [sucessMessage, setIsSucessMessage] = useState("");
  const dispatch = useDispatch();
  const add = () => {
    // setResetKey(Date.now());
    historyPush(modulesManager, history, "admin.taskNew");
  };
  // console.log(match,"match")
  const save = async (task) => {
    if (!task[0]?.uuid) {
      console.log("tskpayload", task);
      const data = await dispatch(
        createCentre(modulesManager, task, formatMessageWithValues("task.createTask.mutationLabel")),
      );
      // console.log(data, "data")
      if (data?.payload) {
        setIsSucess(true);
        setIsSucessMessage("Task Group Sucessfully Created");
      } else {
        setIsSucess(false);
      }
    }
    // else {
    // const data = dispatch(updateTaskGroup(modulesManager, task, formatMessageWithValues("admin.task.updateTask.mutationLabel")));
    // if (data?.payload) {
    //     setIsSucess(true);
    //     setIsSucessMessage("Task Group Sucessfully Updated");
    // }
    //     else {
    //         setIsSucess(false)
    //     }
    // }
  };
  const handleClose = () => {
    setIsSucess(false);
  };
  // console.log(sucessMessage,"sucessMessage")
  return (
    <div className={classes.page}>
      <CenterLocationForm
        key={resetKey}
        // readOnly={match.params.taskGroup_id ? !rights.includes(Right_TaskGroup_ADD) : !rights.includes(RIGHT_TaskGroup_EDIT)}
        taskGroupUUID={match.params.center_uuid}
        back={() => props.history.goBack()}
        // add={rights.includes(Right_TaskGroup_ADD) ? add : null}
        // save={rights.includes(RIGHT_TaskGroup_EDIT) ? save : null}
        save={save}
        sucess={sucess}
        sucessMessage={sucessMessage}
        handleClose={handleClose}
        setIsSucess={setIsSucess}
      />
    </div>
  );
};
const enhance = combine(withHistory, withModulesManager, withTheme, withStyles(styles));

export default enhance(CenterLocation);
