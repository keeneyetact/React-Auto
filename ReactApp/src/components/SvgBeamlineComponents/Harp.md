 ``` js
import BeamLineCanvas from './BeamLineCanvas';
import HorizontalBeamline from './HorizontalBeamline';


<BeamLineCanvas width={600} height={300} >
       <HorizontalBeamline 
          x={0}
          y={50}
          width={'300px'}
     
        />
       
        <Harp

          pv={'$(IOC):$(actuatorName):put-outIn'}
          isMovingPv = {'$(IOC):$(actuatorName):get-status.B5'}
          inLimitPv = {'$(IOC):$(actuatorName):get-status.B6'}
          outLimitPv = {'$(IOC):$(actuatorName):get-status.B7'}
          inLimitValue={1}
          outLimitValue={1}
          isMovingValue={1}
          maxHarpsReached={false}
   
          label= {'$(actuatorName)'}

          macros= {{
              '$(IOC)': 'testIOC',
              '$(actuatorName)': 'Harp2',
             
          }
          }
          x={50}
          y={50}
          
          alarmSensitive={true}
         
        
          componentGradient={true}
        />
      
      
        </BeamLineCanvas>

```