import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid, Divider, Typography } from "@material-ui/core";
import { withModulesManager, useTranslations, TextInput, PublishedComponent } from "@openimis/fe-core";

const styles = (theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: "100%",
  },
  sectionHeader: {
    ...theme.paper.item,
    paddingBottom: 0,
  },
  sectionTitle: theme.typography.title,
});

const CenterLocationMasterPanel = (props) => {
  const { classes, edited, readOnly, onEditedChanged, modulesManager } = props;
  const [formdata, setFormdata] = useState({ location: "", name: "", center: "", user: "" });

  const handleChange = (name, value) => {
    setFormdata((prevVal) => ({
      ...prevVal,
      [name]: value,
    }));
    onEditedChanged({ ...edited, ...formdata, [name]: value });
  };

  useEffect(() => {
    if (edited) {
      setFormdata(edited[0]);
    }
  }, [edited]);
  console.log(edited, "edited");
  const iuser = edited[0]?.tgUsersTaskGroup?.map((user) => {
    return user?.user;
  });
  const username = iuser?.map((iUser) => {
    return iUser.iUser;
  });
  const { formatMessage } = useTranslations("admin", modulesManager);
  return (
    <Grid container direction="row">
      <Grid container>
        {/* <Grid item xs={3} className={classes.item}>
                    <TextInput
                        module="admin"
                        type="text"
                        label="task.name"
                        readOnly={readOnly}
                        value={!edited ? null : edited[0]?.name}
                        onChange={(v) => handleChange("name", v)}

                    />
                </Grid> */}
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="location.LocationPicker"
            value={edited[0]?.regions}
            onChange={(regions) => handleChange("regions", regions)}
            readOnly={readOnly}
            withLabel
            label={formatMessage("Regions")}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          {/* <PublishedComponent
                        pubRef="admin.CenterPicker"
                        value={edited[0]?.station}
                        module="admin"
                        label="Center"
                        readOnly={readOnly}
                        onChange={(station) => handleChange("station", station)}
                        stations={edited?.regions?.uuid}
                    /> */}
          <TextInput
            module="location"
            label="Location.center"
            name="center"
            type="text"
            value={edited.center}
            readOnly={readOnly}
            required
            onChange={(v) => handleChange("center", v)}
          />
        </Grid>
        {/* <Grid item xs={6} className={classes.item}>
                    <PublishedComponent
                        pubRef="admin.EmployeePicker"
                        required
                        withNull={true}
                        value={!!edited && iuser}
                        module="admin"
                        readOnly={readOnly}
                        onChange={(v) => handleChange("user", v)}
                        stationId={edited?.station}
                    />
                </Grid> */}
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({});

export default withModulesManager(connect(mapStateToProps)(withTheme(withStyles(styles)(CenterLocationMasterPanel))));
