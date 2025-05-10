import * as Cesium from 'cesium';
import "./style.css";
import "cesium/Build/Cesium/Widgets/widgets.css";
import model_url from '../models/model.gltf';
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

// Create an entity for each trajectory point
  for (let i = 0; i < trajectory_points.length; i++) {
    const dataPoint = trajectory_points[i];
    const position = Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height);

    // Declare the time for this individual sample and store it in a new JulianDate instance.
    const time = Cesium.JulianDate.addSeconds(start, i * timeStepInSeconds, new Cesium.JulianDate());  // 'i' is the point index

    // Store the position along with its timestamp.
    positionProperty.addSample(time, position); // 'position' is the Carterian3 position of the point

    viewer.entities.add({
        description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
        position: position,
        point: { pixelSize: 10, color: Cesium.Color.RED }
    });
}

  const modelEntity = viewer.entities.add({
    description: 'Model description',  // Textual description
    position: positionProperty,         // Position of the model
    // Load model
    model: {
        uri: model_url,         // URL of the model
        minimumPixelSize: 128,  // Minimum size of the model in the scene
        maximumScale: 2000,      // Maximum scale of the model when zooming out
        scale: 0.02 
    },
    // Automatically compute the orientation from the position.
    orientation: new Cesium.VelocityOrientationProperty(positionProperty),
    // Define line path
    availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start: start, stop: stop })]),
    path: new Cesium.PathGraphics({ width: 3 })
});

viewer.trackedEntity = modelEntity;

