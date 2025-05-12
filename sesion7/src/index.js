import * as Cesium from 'cesium';
import "./style.css";
import "cesium/Build/Cesium/Widgets/widgets.css";
import model_url from '../models/model.gltf';
import base_url from '../models/scene.gltf';
import trajectory_points from '../data/points.json';

const viewer = new Cesium.Viewer(document.body, 
    {
    terrain: Cesium.Terrain.fromWorldTerrain()
 });

const osmBuildings = await Cesium.createOsmBuildingsAsync();
viewer.scene.primitives.add(osmBuildings);

const camera_position = Cesium.Cartesian3.fromDegrees(12.510103833224017, 41.90670500722422,300);
viewer.camera.flyTo({
    destination: camera_position,
    orientation: {
      heading: Cesium.Math.toRadians(120),
      pitch: Cesium.Math.toRadians(-15.0),
    }
  });


  const timeStepInSeconds = 30;
  const totalSeconds = timeStepInSeconds * (trajectory_points.length - 1);
  const start = Cesium.JulianDate.fromIso8601("2025-05-10T19:37:00Z");
  const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // Loop at the end
  viewer.timeline.zoomTo(start, stop);
  // Speed up the playback speed 10x.
  viewer.clock.multiplier = 10;
  // Start playing the scene.
  viewer.clock.shouldAnimate = true;

  const positionProperty = new Cesium.SampledPositionProperty();
  const velocityOrientation = new Cesium.VelocityOrientationProperty(positionProperty);
  const manualOrientation = new Cesium.SampledProperty(Cesium.Quaternion);

// Create an entity for each trajectory point
for (let i = 0; i < trajectory_points.length; i++) {
    const current = trajectory_points[i];
    const time = Cesium.JulianDate.addSeconds(start, i * timeStepInSeconds, new Cesium.JulianDate());
    const position = Cesium.Cartesian3.fromDegrees(current.longitude, current.latitude, current.height);

    positionProperty.addSample(time, position);

    const isVertical = (
        i > 0 &&
        trajectory_points[i - 1].latitude === current.latitude &&
        trajectory_points[i - 1].longitude === current.longitude
    );

    if (isVertical) {
        const fixedOrientation = Cesium.Transforms.headingPitchRollQuaternion(
            position,
            new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(90), 0, 0)
        );
        manualOrientation.addSample(time, fixedOrientation);
    }
    else {
        if (i === 0) {
            const fixedOrientation = Cesium.Transforms.headingPitchRollQuaternion(
                position,
                new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(90), 0, 0)
            );
            manualOrientation.addSample(time, fixedOrientation);
        } else {
            // Traiettorie: orientamento dinamico lungo il volo
            const orientation = velocityOrientation.getValue(time);
            if (orientation) {
                manualOrientation.addSample(time, orientation);
            }
        }
    }

    
    viewer.entities.add({
        description: `Location: (${current.longitude}, ${current.latitude}, ${current.height})`,
        position: position,
        point: { pixelSize: 10, color: Cesium.Color.RED }
    });
}

const orientationProperty = {
    getValue: function(time, result) {
        const manual = manualOrientation.getValue(time, result);
        return manual || velocityOrientation.getValue(time, result);
    }
};
  const modelEntity = viewer.entities.add({
    description: 'Drone',  // Textual description
    position: positionProperty,         // Position of the model
    // Load model
    model: {
        uri: model_url,         // URL of the model
        minimumPixelSize: 128,  // Minimum size of the model in the scene
        maximumScale: 2000,      // Maximum scale of the model when zooming out
        scale: 0.01
    },
    orientation: orientationProperty,
    // Define line path
    availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start: start, stop: stop })]),
    path: new Cesium.PathGraphics({ width: 3 })
});

const basePosition = Cesium.Cartesian3.fromDegrees(12.51530,41.90310, 115);  

const baseEntity =   viewer.entities.add({
    description: 'Estación base - control de vuelo',
    position: basePosition,
    model: {
        uri: base_url,
        scale: 1,
        minimumPixelSize: 0,
        maximumScale: 1,
    },
    point: { pixelSize: 12, color: Cesium.Color.YELLOW, outlineColor: Cesium.Color.BLACK, outlineWidth: 2 }
 
});

viewer.trackedEntity = modelEntity;

