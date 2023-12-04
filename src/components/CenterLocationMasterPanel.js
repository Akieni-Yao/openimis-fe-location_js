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
      setFormdata(edited);
    }
  }, [edited]);
  // const iuser = edited[0]?.tgUsersTaskGroup?.map((user) => {
  //   return user?.user;
  // });
  // const username = iuser?.map((iUser) => {
  //   return iUser.iUser;
  // });
  const { formatMessage } = useTranslations("location", modulesManager);
  return (
    <Grid container direction="row">
      <Grid container>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            module="location"
            pubRef="location.RegionPicker"
            value={edited[0]?.location}
            onChange={(location) => handleChange("location", location)}
            readOnly={readOnly}
            withLabel
            label={formatMessage("location.LocationPicker")}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput
            module="location"
            label="Location.center"
            name="name"
            type="text"
            value={!!edited ? edited[0]?.name : ""}
            // readOnly={readOnly}
            required
            onChange={(v) => handleChange("name", v)}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({});

export default withModulesManager(connect(mapStateToProps)(withTheme(withStyles(styles)(CenterLocationMasterPanel))));
