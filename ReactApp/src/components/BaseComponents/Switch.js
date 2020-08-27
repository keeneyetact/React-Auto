import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FormControlLabel} from "@material-ui/core";
import MuiSwitch from "@material-ui/core/Switch";
import Widget from "../SystemComponents/Widgets/Widget";
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  FormControl: {
    width: "100%",
    height: "100%",
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

/* eslint-disable eqeqeq */
const SwitchInternalComponent = (props) => {
  
  const classes = useStyles();

  /**
   * Save switch state.
   * @param {Event} event
   */
 const handleButtonChange=(event)=> {
    let value = event.target.checked ? 1 : 0;
    props.handleImmediateChange(value);
  }

 
    return (
      <FormControlLabel
        key={props.pvName}
        className={classes.FormControl}
        disabled={props.disabled}
        label={props.formControlLabel}
        labelPlacement={props.labelPlacement}
        control={
          <MuiSwitch
            onChange={handleButtonChange}
            checked={props.value == 1}
            color={props.onColor}
            {... props.muiSwitchProps}
          />
        }
      />
    );
  }
  /* eslint-disable eqeqeq */
/**
 * The Switch component is a wrapper on a Material-UI Switch component.
 * The Switch component is implemented with zero margins and enabled to grow to the width of its parent container.<br/><br/>
 * The margins and spacing must be controlled from the parent component.<br/><br/>
 * Material-UI Switch Demos:
 * https://material-ui.com/components/switches/#switch<br/><br/>
 * Material-UI Switch API:
 * https://material-ui.com/api/switch/
 */
const Switch =(props)=>{
  return (
    <Widget {...props} component={SwitchInternalComponent} usePvMinMax={false} usePvPrecision={false} min={undefined} max={undefined} prec={undefined} />
       
    
  )
}

Switch.propTypes = {
  /** Name of the process variable, NB must contain correct prefix ie: pva://  eg. 'pva://$(device):test$(id)'*/
  pv: PropTypes.string.isRequired,
  /** Values of macros that will be substituted in the pv name eg. {{'$(device)':'testIOC','$(id)':'2'}}*/
  macros: PropTypes.object,

  /** local variable initialization value*/
  initialLocalVariableValue: PropTypes.string,
  /** If defined, then the DataConnection debugging information will be displayed*/
  debug: PropTypes.bool,
  /** label placement*/
  labelPlacement: PropTypes.oneOf(['start', 'top', 'bottom', 'end']),
  /** Custom label to be used, if  `usePvLabel` is not defined. */
  label: PropTypes.string,
  /**
 * Custom on color to be used, must be derived from Material UI theme color's.
 */
  onColor: PropTypes.string,
  /**
   * Directive to fill the component's label with
   * the value contained in the  pv metadata's DESC field or the labelPv value.
   * If not defined it uses the custom label as defined by the label prop.
   */
  usePvLabel: PropTypes.bool,
   /**
  * Custom PV to define the units to be used, usePvLabel must be set to `true` and useMetadata to `false`, NB must contain correct prefix ie: pva:// eg. 'pva://$(device):test$(id)'.
  */
 labelPv: PropTypes.string,
 /** Any of the MUI Switch Props can applied by defining them as an object
   * 
   */
  muiSwitchProps: PropTypes.object,
   /**
   * Tooltip Text
   */
  tooltip:PropTypes.string,
  /**
   * Directive to show the tooltip
   */
  showTooltip:PropTypes.bool,
  /**
   *  Any of the MUI Tooltip props can applied by defining them as an object
   */

  tooltipProps:PropTypes.object,
  /**
   * When receiving a PV storing an array of values users can choose a subset of these value.
   * Registers accept the indexes of the registers to effectively show.
   * Order does count!
   */
  registers: PropTypes.arrayOf(PropTypes.number),
  /**
   * When receiving a PV storing an array of values users can assign a label to each register
   * or a subset of them.
   */
  registersLabel: PropTypes.arrayOf(PropTypes.string),
  /**
   * When receiving a PV storing an array of values users can set the label position for each register,
   * or a subset of them, if the receiving components allows it.
   */
  registersLabelPlacement: PropTypes.oneOf(["top", "bottom", "start", "end"]),
  /**
   * Directive to display array elements horizontal aligned.
   */
  alignHorizontal: PropTypes.bool,
  /**
   * When alignHorizontal is true, if stretch is true
   * all the elements are aligned into one row, otherwise
   * they have their standard width.
   */
  stretch: PropTypes.bool,
}

Switch.defaultProps = {
  onColor: 'primary',
  debug: false,
  showTooltip:false,
  alignHorizontal: false,
  stretch: true,
}

SwitchInternalComponent.defaultProps = Switch.defaultProps;

export default Switch;
export { Switch, SwitchInternalComponent as SwitchComponent };

