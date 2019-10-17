import React from 'react'
import AutomationStudioContext from '../SystemComponents/AutomationStudioContext';
import DataConnection from '../SystemComponents/DataConnection';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import PropTypes from 'prop-types';
//import classNames from 'classnames';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import SvgIcon from '@material-ui/core/SvgIcon';
import Lens from '@material-ui/icons/Lens';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ContextMenu from '../SystemComponents/ContextMenu';
const styles = theme => ({
  root: {

    display: 'flex',
    flexWrap: 'wrap',


  },
  Button: {

    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',

  }

});

/**
 * The StyledIconIndicator Component is a wrapper on the Material-UI contained SvgIcon component. The SvgIcon component is implemented with zero margins and enabled to grow to the width of its parent container.<br/><br/>
 * The margins and spacing must be controlled from the parent component.<br/><br/>
 * Material-UI SvgIcon Demos:
 * https://material-ui.com/style/icons/<br/><br/>
 * Material-UI SvgIcon API:
 * https://material-ui.com/api/svg-icon/<br/><br/>
 * A custom Icon can used by importing it in the parent and assigning it as a child <br/><br/>
 */
class StyledIconIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state={['value'] : "0",
    ['label']:"Undefined",
    ['pvname']:"Undefined",
    ['intialized']:false,
    ['metadata']:{},
    ['severity']:'',
    openContextMenu: false,
    'open':false,x0:0,y0:0
  }
  this.handleInputValue= this.handleInputValue.bind(this);
  this.handleInputValueLabel= this.handleInputValueLabel.bind(this);
  this.handleMetadata= this.handleMetadata.bind(this);

}


handleInputValue(inputValue,pvname,initialized,severity){
  // console.log("severity: ",severity);

  this.setState({    ['value']	 :inputValue,

  ['pvname']:pvname,
  ['initialized']:initialized,
  ['severity']:severity});


}


handleMetadata(metadata){


  this.setState({['metadata']:metadata});


}



handleInputValueLabel(inputValue){

  this.setState({['label']:inputValue});

}



componentDidMount() {
}


componentWillUnmount() {

}



handleContextMenuClose = (event) => {


  this.setState({ openContextMenu: false });

};

handleToggleContextMenu = (event) => {
  //   console.log(event.type)
  event.persist()
  this.setState(state => ({ openContextMenu: !state.openContextMenu,x0:event.pageX,y0:event.pageY }));

  event.preventDefault();
}













handleButtonClick = name => event => {
  //console.log(event.target.checked)
this.setState({ ['value']: this.state.value==0?1:0});

};


render() {
  const {classes}= this.props;
  const pv = this.props.pv;
  const macros=  this.props.macros;
  const usePvLabel= this.props.usePvLabel;
  const mylabel= this.props.label;
  const usePrecision= this.props.prec;
  const useStringValue=this.props.useStringValue;
  const severity=this.state.severity;
  let units="";
  const initialized=this.state.initialized;
  const value=this.state.value;
  let enum_strings={};
  if(initialized){
    if(this.props.usePvUnits===true){
      if (typeof this.state.metadata !== 'undefined'){
        if (typeof this.state.metadata.units !== 'undefined'){
          units=this.state.metadata.units;
        }
        else{
          units="";
        }
      }
      else {
        units="";
      }

    }
    else {
      units=this.props.units;
    }




  }




  let onColor=this.props.theme.palette.primary.main;
  let offColor=this.props.theme.palette.grey[50];
  if (typeof this.props.onColor !== 'undefined'){
    if(this.props.onColor==='primary'){
      onColor=this.props.theme.palette.primary.main;
    }
    else if(this.props.onColor==='secondary'){
        onColor=this.props.theme.palette.secondary.main;
    }
    else if(this.props.onColor==='default'){
         onColor=this.props.theme.palette.grey[50];
        }
    else
       {
     onColor=this.props.onColor;
   }
  }


  if (typeof this.props.offColor !== 'undefined'){
    if(this.props.offColor==='primary'){
      offColor=this.props.theme.palette.primary.main;
    }
    else if(this.props.offColor==='secondary'){
        offColor=this.props.theme.palette.secondary.main;
    }
    else if(this.props.offColor==='default'){
         offColor=this.props.theme.palette.grey[50];
        }
    else
       {
     offColor=this.props.offColor;
   }
  }






  let write_access=false;
  let read_access=false;
  if(initialized){

    if (typeof this.state.metadata !== 'undefined'){
      if (typeof this.state.metadata.write_access !== 'undefined'){
        write_access=this.state.metadata.write_access;
      }
      if (typeof this.state.metadata.read_access !== 'undefined'){
        read_access=this.state.metadata.read_access;
      }
    }
  }

  let iconStyle={};
  if (typeof this.props.labelPlacement !=='undefined'){
    if(this.props.labelPlacement=="top"){
      iconStyle['marginTop']=this.props.theme.spacing(1);
    }else   if(this.props.labelPlacement=="end"){
      iconStyle['marginRight']=this.props.theme.spacing(1);
    }
    else   if(this.props.labelPlacement=="start"){
      iconStyle['marginLeft']=this.props.theme.spacing(1);
    }
    else   if(this.props.labelPlacement=="bottom"){
      iconStyle['marginBottom']=this.props.theme.spacing(1);
    }
  }
  return (

<React.Fragment>

      <DataConnection
        pv={pv}
        macros={macros}
        usePvLabel={usePvLabel}
        usePrecision={usePrecision}
        handleInputValue={this.handleInputValue}
        handleMetadata={this.handleMetadata}
        outputValue=  {this.state.value}
        useStringValue={useStringValue}
        debug={this.props.debug}
        handleInputValueLabel={this.handleInputValueLabel}
      />
      <ContextMenu
        disableProbe={this.props.disableProbe}
        open={this.state.openContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={{ top: +this.state.y0, left: +this.state.x0 }}
        probeType={'readOnly'}
        pvs={[{pvname:this.state.pvname,initialized:initialized}]}
        handleClose={this.handleContextMenuClose}

        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      />
      {initialized===true &&


        <FormControlLabel style={{margin:0}}
          control={
            <SvgIcon    size='small' style={iconStyle} style={{color:this.state['value']==1? onColor:offColor}}   onContextMenu={this.handleToggleContextMenu}>


              {typeof this.props.children==='undefined'&&<Lens  />}
              {typeof this.props.children!=='undefined'&& this.props.children}



            </SvgIcon>
          }
          label={usePvLabel===true? this.state['label']:this.props.label}
          labelPlacement={typeof this.props.labelPlacement !== 'undefined'? this.props.labelPlacement:"top"}
        />



      }

      {(initialized===false||initialized==='undefined') &&
      <FormControlLabel

        control={
          <SvgIcon   disabled={true} size='small'  style={{color:'default'}}  onContextMenu={this.handleToggleContextMenu} >


            {typeof this.props.children==='undefined'&&<Lens  />}
            {typeof this.props.children!=='undefined'&& this.props.children}


          </SvgIcon>
        }
        label={"Connecting to:"+this.state['pvname']}
        labelPlacement={typeof this.props.labelPlacement !== 'undefined'? this.props.labelPlacement:"top"}
      />

      }

</React.Fragment>


)
}
}

StyledIconIndicator.propTypes = {
  /** Name of the process variable, NB must contain correct prefix ie: pva://  eg. 'pva://$(device):test$(id)'*/
  pv: PropTypes.string.isRequired,
  /** Values of macros that will be substituted in the pv name eg. {{'$(device)':'testIOC','$(id)':'2'}}*/
  macros:PropTypes.object,
  /** Directive to fill the label with the value contained in the  EPICS pv's DESC field. */
  usePvLabel:PropTypes.bool,
  /** Directive to use the EPICS alarm severity status to alter the fields backgorund color  */
  alarmSensitive:PropTypes.bool,
  /** Custom label to be used, if  `usePvLabel` is not defined. */
  label: PropTypes.string,
  /** If defined, then the DataConnection debugging information will be displayed*/
  debug:PropTypes.bool,
  /** If defined, this sets the color of the widget when the value is a 1 or HIGH*/
  onColor: PropTypes.string,
  /** If defined, this sets the color of the widget when the value is a 0 or LOW*/
  offColor: PropTypes.string,
  /** If defined, the position of the label relative to the widget*/
  labelPlacement: PropTypes.oneOf(['start', 'end', 'top', 'bottom']),

};

StyledIconIndicator.defaultProps = {
    labelPlacement: 'top',
    debug:false,
    alarmSensitive:false,
    usePvLabel:false,
    onColor:'theme.palette.primary.main',
    offColor:'theme.palette.grey[50]'

};

StyledIconIndicator.contextType=AutomationStudioContext;
export default withStyles(styles,{withTheme:true})(StyledIconIndicator)
