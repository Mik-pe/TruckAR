var earthOpened = false;
var earth, earthOcclusion, earthIndicators;

arel.sceneReady(function()
{
	console.log("sceneReady");

	//set a listener to tracking to get information about when the image is tracked
	arel.Events.setListener(arel.Scene, trackingHandler);

	// Check initial state of tracking
	arel.Scene.getTrackingValues(function(trackingValues)
	{
		if (trackingValues.length == 0)
		{
			document.getElementById('info').style.display = "block";
		}
	});

	var Scale = new arel.Vector3D(11.0, 11.0, 11.0);
	var Rotation = new arel.Rotation();
	Rotation.setFromEulerAngleDegrees(new arel.Vector3D(90.0, 0.0, 0.0));

	// get earth model reference
	earth = arel.Object.Model3D.create("1", "../Earth.zip");
	earth.setVisibility(true);
	earth.setCoordinateSystemID(1);
	earth.setScale(Scale);
	earth.setRotation(Rotation);
	arel.Scene.addObject(earth);
	earth.setPickingEnabled(true);

	// add a handler for the onTouchStarted event
	earth.onTouchStarted = function( param )
	{
		if (!earthOpened)
		{
			arel.Scene.getObject("1").startAnimation("Open");
			arel.Scene.getObject("3").startAnimation("Grow");
			earthOpened = true;
		}
		else
		{
			arel.Scene.getObject("1").startAnimation("Close");
			arel.Scene.getObject("3").startAnimation("Shrink");
			earthOpened = false;
		}
	}

	// get earth occlusion model reference
	earthOcclusion = arel.Object.Model3D.create("2", "../Earth_Occlusion.zip");
	earthOcclusion.setVisibility(true);
	earthOcclusion.setCoordinateSystemID(1);
	earthOcclusion.setScale(Scale);
	earthOcclusion.setRotation(Rotation);
	earthOcclusion. setOccluding(true);
	arel.Scene.addObject(earthOcclusion);
	earthOcclusion.setPickingEnabled(true);

	// get earth indicators model reference
	earthIndicators = arel.Object.Model3D.create("3", "../EarthIndicators.zip");
	earthIndicators.setVisibility(true);
	earthIndicators.setCoordinateSystemID(1);
	earthIndicators.setScale(Scale);
	earthIndicators.setRotation(Rotation);
	arel.Scene.addObject(earthIndicators);
	earthIndicators.setPickingEnabled(true);
});

function trackingHandler(type, param)
{
	//check if there is tracking information available
	if (param[0] !== undefined)
	{
		//if the pattern is found, hide the information to hold your phone over the pattern
		if (type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_TRACKING)
		{
			document.getElementById('info').style.display = "none";
		}
		//if the pattern is lost tracking, show the information to hold your phone over the pattern
		else if (type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_NOTTRACKING)
		{
			document.getElementById('info').style.display = "block";
		}
	}
};
