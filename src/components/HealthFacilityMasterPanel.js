import React from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
  ControlledField,
  PublishedComponent,
  FormPanel,
  TextInput,
  TextAreaInput,
  withModulesManager,
  ValidatedTextInput,
  formatMessage,
  ConstantBasedPicker,
} from "@openimis/fe-core";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { HFCodeValidationCheck, HFCodeValidationClear, HFCodeSetValid } from "../actions";

const styles = (theme) => ({
  item: theme.paper.item,
});
const CAMU_TYPE = ["public", "private"];
const FOSA_LEVEL_TYPE = ["CSI", "HôpitalDeBase", "hôpitalGeneral", "Autres"];
class HealthFacilityMasterPanel extends FormPanel {
  constructor(props) {
    super(props);
    this.state = { regionSelected: null };
    this.codeMaxLength = props.modulesManager.getConf("fe-location", "healthFacilityForm.codeMaxLength", 8);
    this.accCodeMaxLength = props.modulesManager.getConf("fe-location", "healthFacilityForm.accCodeMaxLength", 25);
    this.accCodeMandatory = props.modulesManager.getConf("fe-location", "healthFacilityForm.accCodeMandatory", false);
  }

  updateRegion = (region) => {
    this.setState({ regionSelected: region && region.parent.parent.parent ? region.parent.parent.parent.code : null });
    // this.updateAttributes({
    //   parentLocation: region,
    //   location: null,
    //   servicesPricelist: null,
    //   itemsPricelist: null,
    // });
  };

  updateDistrict = (district) => {
    this.updateAttributes({
      parentLocation: !!district ? district.parent : null,
      location: district,
      servicesPricelist: null,
      itemsPricelist: null,
    });
  };

  shouldValidate = (inputValue) => {
    const { savedHFCode } = this.props;
    const shouldValidate = inputValue !== savedHFCode;
    return shouldValidate;
  };
  updateAttributes = (updates) => {
    let data = _.merge({}, this.state.data, updates, {
      jsonExt: {
        department_code: this.state.regionSelected && this.state.regionSelected ? this.state.regionSelected : null,
        f_code: "",
      },
    });
    this.props.onEditedChanged(data);
  };
  render() {
    const {
      classes,
      edited,
      reset,
      readOnly = false,
      isHFCodeValid,
      isHFCodeValidating,
      HFCodeValidationError,
    } = this.props;
    return (
      <Grid container>
        <ControlledField
          module="location"
          id="HealthFacility.code"
          field={
            <Grid item xs={2} className={classes.item}>
              {/* <ValidatedTextInput
                itemQueryIdentifier="healthFacilityCode"
                shouldValidate={this.shouldValidate}
                isValid={isHFCodeValid}
                isValidating={isHFCodeValidating}
                validationError={HFCodeValidationError}
                action={HFCodeValidationCheck}
                clearAction={HFCodeValidationClear}
                setValidAction={HFCodeSetValid}
                module="location"
                label="location.HealthFacilityForm.code"
                codeTakenLabel="location.HealthFacilityForm.codeTaken"
                name="code"
                value={edited.code}
                readOnly={readOnly}
                required={true}
                onChange={(code, s) => this.updateAttribute("code", code)}
                inputProps={{
                  "maxLength": this.codeMaxLength,
                }}
              /> */}
              <TextInput
                module="location"
                label="location.HealthFacilityForm.code"
                // inputProps={{ maxLength: MAX_TRADENAME_LENGTH }}
                value={!!edited && !!edited.jsonExt ? edited.jsonExt?.f_code : ""}
                // onChange={(v) => this.updateAttribute("code", v)}
                readOnly={true}
              />
            </Grid>
          }
        />
        {/* <ControlledField
          module="location"
          id="HealthFacility.region"
          field={
            <Grid item xs={2} className={classes.item}>
              <PublishedComponent
                pubRef="location.RegionPicker"
                value={edited.parentLocation}
                withNull={true}
                readOnly={readOnly}
                onChange={(v, s) => this.updateRegion(v)}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.district"
          field={
            <Grid item xs={2} className={classes.item}>
              <PublishedComponent
                pubRef="location.DistrictPicker"
                value={edited.location}
                readOnly={readOnly}
                region={this.state.parentLocation}
                withNull={true}
                required={true}
                onChange={(v, s) => this.updateDistrict(v)}
              />
            </Grid>
          }
          
        /> */}
        <Grid item xs={8} className={classes.item}>
          <PublishedComponent
            pubRef="location.DetailedLocation"
            withNull={true}
            readOnly={readOnly}
            required={true}
            value={!edited ? null : edited.location}
            onChange={(v) => {
              this.updateAttribute("location", v);
              this.updateRegion(v);
            }}
            filterLabels={false}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <TextAreaInput
            module="location"
            label="HealthFacilityForm.address"
            value={edited.address}
            rows="2"
            required
            readOnly={readOnly}
            onChange={(v, s) => this.updateAttribute("address", v)}
          />
        </Grid>
        <ControlledField
          module="location"
          id="HealthFacility.legalForm"
          field={
            <Grid item xs={2} className={classes.item}>
              <PublishedComponent
                pubRef="location.HealthFacilityLegalFormPicker"
                value={!!edited.legalForm ? edited.legalForm.code : null}
                nullLabel="empty"
                reset={reset}
                readOnly={readOnly}
                required={true}
                onChange={(v, s) => this.updateAttribute("legalForm", !!v ? { code: v } : null)}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.level"
          field={
            <Grid item xs={2} className={classes.item}>
              <PublishedComponent
                pubRef="location.HealthFacilityLevelPicker"
                value={edited.level}
                nullLabel="empty"
                reset={reset}
                readOnly={readOnly}
                required={true}
                onChange={(v, s) => this.updateAttribute("level", v)}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.subLevel"
          field={
            <Grid item xs={2} className={classes.item}>
              <PublishedComponent
                pubRef="location.HealthFacilitySubLevelPicker"
                value={!!edited.subLevel ? edited.subLevel.code : null}
                nullLabel="empty"
                reset={reset}
                readOnly={readOnly}
                onChange={(v, s) => this.updateAttribute("subLevel", !!v ? { code: v } : null)}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.careType"
          field={
            <Grid item xs={2} className={classes.item}>
              <PublishedComponent
                pubRef="medical.CareTypePicker"
                value={edited.careType}
                nullLabel="empty"
                reset={reset}
                readOnly={readOnly}
                required={true}
                onChange={(v, s) => this.updateAttribute("careType", v)}
              />
            </Grid>
          }
        />

        <ControlledField
          module="location"
          id="HealthFacility.accCode"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.accCode"
                name="accCode"
                value={edited.accCode}
                readOnly={readOnly}
                required={this.accCodeMandatory}
                onChange={(v, s) => this.updateAttribute("accCode", v)}
                inputProps={{
                  "maxLength": this.accCodeMaxLength,
                }}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.name"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.name"
                name="name"
                value={edited?.name && edited?.name}
                readOnly={readOnly}
                required={true}
                onChange={(v, s) => this.updateAttribute("name", v)}
              />
            </Grid>
          }
        />

        <ControlledField
          module="location"
          id="HealthFacility.phone"
          field={
            <Grid item xs={1} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.phone"
                name="phone"
                value={edited.phone}
                readOnly={readOnly}
                required
                onChange={(v, s) => this.updateAttribute("phone", v)}
              />
            </Grid>
          }
        />
        {/* <ControlledField
          module="location"
          id="HealthFacility.fax"
          field={
            <Grid item xs={1} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.fax"
                name="fax"
                value={edited.fax}
                readOnly={readOnly}
                onChange={(v, s) => this.updateAttribute("fax", v)}
              />
            </Grid>
          }
        /> */}
        <ControlledField
          module="location"
          id="HealthFacility.email"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.email"
                name="email"
                value={edited.email}
                readOnly={readOnly}
                onChange={(v, s) => this.updateAttribute("email", v)}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.fosaLevel"
          field={
            <Grid item xs={2} className={classes.item}>
              {/* <PublishedComponent
                pubRef="medical.CareTypePicker"
                value={edited.careType}
                nullLabel="empty"
                reset={reset}
                readOnly={readOnly}
                required={true}
                onChange={(v, s) => this.updateAttribute("careType", v)}
              /> */}
              <ConstantBasedPicker
                module="location"
                label="HealthFacilityForm.fosaLevel"
                value={!!edited && edited.jsonExt ? edited.jsonExt.fosaLevel : ""}
                readOnly={readOnly}
                required
                onChange={(v) => this.updateAttributes({ jsonExt: { fosaLevel: v } })}
                constants={FOSA_LEVEL_TYPE}
                withNull={false}
              />
            </Grid>
          }
        />
        <Grid item xs={2} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="location"
            label="HealthFacilityForm.authorisationDate"
            required
            value={!!edited && !!edited.jsonExt ? edited.jsonExt.authorisationDate : null}
            onChange={(v) => this.updateAttributes({ jsonExt: { authorisationDate: v } })}
            readOnly={readOnly}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="location"
            label="HealthFacilityForm.creationDate"
            required
            value={!!edited && !!edited.jsonExt ? edited.jsonExt.creationDate : null}
            onChange={(v) => this.updateAttributes({ jsonExt: { creationDate: v } })}
            readOnly={readOnly}
          />
        </Grid>
        <ControlledField
          module="location"
          id="HealthFacility.responsibleName"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.responsibleName"
                name="responsibleName"
                value={!!edited && edited.jsonExt ? edited.jsonExt.responsibleName : ""}
                readOnly={readOnly}
                required={true}
                onChange={(v) => this.updateAttributes({ jsonExt: { responsibleName: v } })}
              />
            </Grid>
          }
        />
        {/* <ControlledField
          module="location"
          id="HealthFacility.managerFirstName"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.managerFirstName"
                name="managerFirstName"
                value={edited.managerFirstName}
                readOnly={readOnly}
                onChange={(v) => this.updateAttributes({ jsonExt: { managerFirstName: v } })}
              />
            </Grid>
          }
        /> */}
        {/* <ControlledField
          module="location"
          id="HealthFacility.socialReason"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.socialReason"
                name="socialReason"
                value={edited.socialReason}
                readOnly={readOnly}
                required
                onChange={(v) => this.updateAttributes({ jsonExt: { socialReason: v } })}
              />
            </Grid>
          }
        /> */}
        <ControlledField
          module="location"
          id="HealthFacility.approvalNumber"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.approvalNumber"
                name="approvalNumber"
                value={!!edited && edited.jsonExt ? edited.jsonExt.approvalNumber : ""}
                readOnly={readOnly}
                required
                onChange={(v) => this.updateAttributes({ jsonExt: { approvalNumber: v } })}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.niuNo"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.niuNo"
                name="niuNo"
                value={!!edited && edited.jsonExt ? edited.jsonExt.niuNo : ""}
                readOnly={readOnly}
                required
                onChange={(v) => this.updateAttributes({ jsonExt: { niuNo: v } })}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.cnssNumber"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.cnssNumber"
                name="cnssNumber"
                value={!!edited && edited.jsonExt ? edited.jsonExt.cnssNumber : ""}
                readOnly={readOnly}
                required={false}
                onChange={(v) => this.updateAttributes({ jsonExt: { cnssNumber: v } })}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.RCCM"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.RCCM"
                name="RCCM"
                value={!!edited && edited.jsonExt ? edited.jsonExt.RCCM : ""}
                readOnly={readOnly}
                required={false}
                onChange={(v) => this.updateAttributes({ jsonExt: { RCCM: v } })}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.NIUM"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.NIUM"
                name="NIUM"
                value={!!edited && edited.jsonExt ? edited.jsonExt.NIUM : ""}
                readOnly={readOnly}
                required={false}
                onChange={(v) => this.updateAttributes({ jsonExt: { NIUM: v } })}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.scien"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.scien"
                name="scien"
                value={!!edited && edited.jsonExt ? edited.jsonExt.scien : ""}
                readOnly={readOnly}
                required={false}
                onChange={(v) => this.updateAttributes({ jsonExt: { scien: v } })}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.taxMoralityCertificate"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.taxMoralityCertificate"
                name="taxMoralityCertificate"
                value={!!edited && edited.jsonExt ? edited.jsonExt.taxMoralityCertificate : ""}
                readOnly={readOnly}
                required={false}
                onChange={(v) => this.updateAttributes({ jsonExt: { taxMoralityCertificate: v } })}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.patentNumber"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.patentNumber"
                name="patentNumber"
                value={!!edited && edited.jsonExt ? edited.jsonExt.patentNumber : ""}
                readOnly={readOnly}
                required={false}
                onChange={(v) => this.updateAttributes({ jsonExt: { patentNumber: v } })}
              />
            </Grid>
          }
        />
        {/* <ControlledField
          module="location"
          id="HealthFacility.legalStatus"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.legalStatus"
                name="legalStatus"
                value={edited.legalStatus}
                readOnly={readOnly}
                required
                onChange={(v) => this.updateAttributes({ jsonExt: { legalStatus: v } })}
              />
            </Grid>
          }
        /> */}
        <ControlledField
          module="location"
          id="HealthFacility.type"
          field={
            <Grid item xs={2} className={classes.item}>
              {/* <TextInput
                module="location"
                label="HealthFacilityForm.type"
                name="type"
                value={edited.type}
                readOnly={readOnly}
                required
                onChange={(v) => this.updateAttributes({ jsonExt: { type: v } })}
              /> */}
              <ConstantBasedPicker
                module="location"
                label="HealthFacilityForm.type"
                value={!!edited && edited.jsonExt ? edited.jsonExt.type : ""}
                readOnly={readOnly}
                required
                onChange={(v) => this.updateAttributes({ jsonExt: { type: v } })}
                constants={CAMU_TYPE}
                withNull={false}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.categoryFosa"
          field={
            <Grid item xs={2} className={classes.item}>
              <PublishedComponent
                pubRef="location.CategoryFosaPicker"
                module="location"
                label="HealthFacilityForm.categoryFosa"
                required
                // nullLabel={formatMessage(this.props.intl, "location", "emptyLabel")}
                nullLabel="empty"
                value={!!edited && edited.jsonExt ? edited.jsonExt.category_fosa : ""}
                onChange={(v) => this.updateAttributes({ jsonExt: { category_fosa: v } })}
                readOnly={readOnly}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.healthDistrict"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.healthDistrict"
                name="healthDistrict"
                value={!!edited && edited.jsonExt ? edited.jsonExt.healthDistrict : ""}
                readOnly={readOnly}
                required={false}
                onChange={(v) => this.updateAttributes({ jsonExt: { healthDistrict: v } })}
              />
            </Grid>
          }
        />
        {/* <ControlledField
          module="location"
          id="HealthFacility.penaltyCoefficient"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.penaltyCoefficient"
                name="penaltyCoefficient"
                value={edited.penaltyCoefficient}
                readOnly={readOnly}
                required={false}
                onChange={(v) => this.updateAttributes({ jsonExt: { penaltyCoefficient: v } })}
              />
            </Grid>
          }
        /> */}
        <ControlledField
          module="location"
          id="HealthFacility.effectiveDateCoefficient"
          field={
            <Grid item xs={2} className={classes.item}>
              <PublishedComponent
                pubRef="core.DatePicker"
                module="location"
                label="HealthFacilityForm.effectiveDateCoefficient"
                value={!!edited && !!edited.jsonExt ? edited.jsonExt.effectiveDateCoefficient : null}
                onChange={(v) => this.updateAttributes({ jsonExt: { effectiveDateCoefficient: v } })}
                readOnly={readOnly}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.channelNumber"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.channelNumber"
                name="channelNumber"
                value={edited.channelNumber}
                readOnly={readOnly}
                required
                onChange={(v) => this.updateAttributes({ jsonExt: { channelNumber: v } })}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.nameofTheAvenue"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.nameofTheAvenue"
                name="nameofTheAvenue"
                value={edited.nameofTheAvenue}
                readOnly={readOnly}
                onChange={(v) => this.updateAttributes({ jsonExt: { nameofTheAvenue: v } })}
              />
            </Grid>
          }
        />
        {/* <ControlledField
          module="location"
          id="HealthFacility.namePath"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.namePath"
                name="namePath"
                value={edited.namePath}
                readOnly={readOnly}
                required
                onChange={(v) => this.updateAttributes({ jsonExt: { namePath: v } })}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.additionalAddress"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.additionalAddress"
                name="additionalAddress"
                value={edited.additionalAddress}
                readOnly={readOnly}
                required={false}
                onChange={(v) => this.updateAttributes({ jsonExt: { additionalAddress: v } })}
              />
            </Grid>
          }
        /> */}
        {/* <ControlledField
          module="location"
          id="HealthFacility.neighborhood"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.neighborhood"
                name="neighborhood"
                value={edited.neighborhood}
                readOnly={readOnly}
                required
                onChange={(v) => this.updateAttributes({ jsonExt: { neighborhood: v } })}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.borough"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.borough"
                name="borough"
                value={edited.borough}
                readOnly={readOnly}
                required
                onChange={(v) => this.updateAttributes({ jsonExt: { borough: v } })}
              />
            </Grid>
          }
        /> */}
        <ControlledField
          module="location"
          id="HealthFacility.latitude"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.latitude"
                name="latitude"
                value={edited.latitude}
                readOnly={readOnly}
                required={false}
                onChange={(v) => this.updateAttributes({ jsonExt: { latitude: v } })}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.longitude"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.longitude"
                name="longitude"
                value={edited.longitude}
                readOnly={readOnly}
                required={false}
                onChange={(v) => this.updateAttributes({ jsonExt: { longitude: v } })}
              />
            </Grid>
          }
        />
        {/* <ControlledField
          module="location"
          id="HealthFacility.phone1"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.phone1"
                name="phone1"
                value={edited.phone1}
                readOnly={readOnly}
                required
                onChange={(v) => this.updateAttributes({ jsonExt: { phone1: v } })}
              />
            </Grid>
          }
        /> */}
        <ControlledField
          module="location"
          id="HealthFacility.phone2"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.phone2"
                name="phone2"
                value={edited.phone2}
                readOnly={readOnly}
                required={false}
                onChange={(v) => this.updateAttributes({ jsonExt: { phone2: v } })}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.bankReferences"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.bankReferences"
                name="bankReferences"
                value={edited.bankReferences}
                readOnly={readOnly}
                required
                onChange={(v) => this.updateAttributes({ jsonExt: { bankReferences: v } })}
              />
            </Grid>
          }
        />

        <ControlledField
          module="location"
          id="HealthFacility.contactName"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.contactName"
                name="contactName"
                value={edited.contactName}
                readOnly={readOnly}
                required
                onChange={(v) => this.updateAttributes({ jsonExt: { contactName: v } })}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.contactFirstNames"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.contactFirstNames"
                name="contactFirstNames"
                value={edited.contactFirstNames}
                readOnly={readOnly}
                required
                onChange={(v) => this.updateAttributes({ jsonExt: { contactFirstNames: v } })}
              />
            </Grid>
          }
        />
        <ControlledField
          module="location"
          id="HealthFacility.contactPhone"
          field={
            <Grid item xs={2} className={classes.item}>
              <TextInput
                module="location"
                label="HealthFacilityForm.contactPhone"
                name="contactPhone"
                value={edited.contactPhone}
                readOnly={readOnly}
                required
                onChange={(v) => this.updateAttributes({ jsonExt: { contactPhone: v } })}
              />
            </Grid>
          }
        />
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  isHFCodeValid: state.loc.validationFields?.HFCode?.isValid,
  isHFCodeValidating: state.loc.validationFields?.HFCode?.isValidating,
  HFCodeValidationError: state.loc.validationFields?.HFCode?.validationError,
  savedHFCode: state.loc?.healthFacility?.code,
});

export default withModulesManager(connect(mapStateToProps)(withTheme(withStyles(styles)(HealthFacilityMasterPanel))));
