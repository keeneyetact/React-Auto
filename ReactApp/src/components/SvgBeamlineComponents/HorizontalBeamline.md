Active beam line example

 ``` js
import BeamLineCanvas from './BeamLineCanvas';

<BeamLineCanvas 
  width={600}
  height={300}
  //debugBorder={true}
  >
       <HorizontalBeamline 
          x={0}
          y={50}
          pv={'testIOC:BeamlineA:BeamOn'}
          width={'113px'}
      //    debugBorder={true}
        />
        <HorizontalBeamline 
          x={'113px'}
          y={50}
          pv={'testIOC:BeamlineB:BeamOn'}
          width={'148px'}
     //     debugBorder={true}
        />
        <HorizontalBeamline 
          x={'261px'}
          y={50}
          pv={'testIOC:BeamlineC:BeamOn'}
          width={'150px'}
    //      debugBorder={true}
        />
        </BeamLineCanvas>

```
Inactive Beam line example
 ``` js
import BeamLineCanvas from './BeamLineCanvas';

<BeamLineCanvas 
  width={600}
  height={300}
  //debugBorder={true}
  >
       <HorizontalBeamline 
          x={0}
          y={50}
       
         // pv={'testIOC:BeamlineA:BeamOn'}
          width={'113px'}
      //    debugBorder={true}
        />
        <HorizontalBeamline 
          x={'113px'}
          y={50}
        //  pv={'testIOC:BeamlineB:BeamOn'}
          width={'148px'}
     //     debugBorder={true}
        />
        <HorizontalBeamline 
          x={'261px'}
          y={50}
        //  pv={'testIOC:BeamlineC:BeamOn'}
          width={'150px'}
    //      debugBorder={true}
        />
        </BeamLineCanvas>

```