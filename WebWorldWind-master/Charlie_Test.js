requirejs(['./src/WorldWind',
        './TestLayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        // Tell World Wind to log only warnings.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the World Window.
        var wwd = new WorldWind.WorldWindow("canvasOne");


        // Add imagery layers.
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true},
            //{layer: new WorldWind.RenderableLayer(wwd), enabled: true, displayName: "PlacemarkC"}
        ];

        /*
        var LayerN = [
            {layer:[0] = "0"},
            {layer:[1] = "1"},
            {layer:[2] = "2"},
            {layer:[3] = "3"},
            {layer:[4] = "4"}
        ];
        */
        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
           // if (wwd.addLayer(layers[l].layer)){
           //         layers[l].layer = "layers.[l]"
           // }
        }



        var placemark,
            placemarkAttributes = new WorldWind.PlacemarkAttributes(null),
            highlightAttributes,
            placemarkLayer = new WorldWind.RenderableLayer("PlacemarkC"),
            latitude = 41.451822,
            longitude = -74.438558;

        // Set up the common placemark attributes.
        placemarkAttributes.imageScale = 1;
        placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 0.5);
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;

        // Create the custom image for the placemark.

        var canvas = document.createElement("canvas"),
            ctx2d = canvas.getContext("2d"),
            size = 64, c = size / 2  - 0.5, innerRadius = 5, outerRadius = 20;

        canvas.width = size;
        canvas.height = size;

        var gradient = ctx2d.createRadialGradient(c, c, innerRadius, c, c, outerRadius);
        gradient.addColorStop(0, 'rgb(0, 0, 255)');
        gradient.addColorStop(0.5, 'rgb(0, 255, 0)');
        gradient.addColorStop(1, 'rgb(0, 0, 255)');

        ctx2d.fillStyle = gradient;
        ctx2d.arc(c, c, outerRadius, 0, 2 * Math.PI, false);
        ctx2d.fill();

        // Create the placemark.
        placemark = new WorldWind.Placemark(new WorldWind.Position(latitude, longitude, 1e2), false, null);
        //placemark.label = "This is a school" + SitesPL[i].SiteID; // NA,USA,1234
        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

        // Create the placemark attributes for the placemark.
        placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        // Wrap the canvas created above in an ImageSource object to specify it as the placemark image source.
        placemarkAttributes.imageSource = new WorldWind.ImageSource(canvas);
        placemark.attributes = placemarkAttributes;

        // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
        // the default highlight attributes so that all properties are identical except the image scale. You could
        // instead vary the color, image, or other property to control the highlight representation.
        highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        highlightAttributes.imageScale = 1.2;
        placemark.highlightAttributes = highlightAttributes;

        // Add the placemark to the layer.
        placemarkLayer.addRenderable(placemark);

        // Add the placemarks layer to the World Window's layer list.
        wwd.addLayer(placemarkLayer);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        // Now set up to handle highlighting.
        var highlightController = new WorldWind.HighlightController(wwd);

        // Now setup a pick handler.

        /*
        var sitePopUp = function(sitelabel) {
            // Locate JSON file
            var tokens = sitelabel.split(",");
            //var continentCode = tokens[0];
            //var countryCode = tokens[1];
            var siteid = tokens[2];
            var popupjsonpath = '//aworldbridgelabs.com:9083/popup';
            var sitename, picpath, sitedesc, siteurl;

            $.getJSON(popupjsonpath,function (res) {
                //Get site information.
                for (var n = 0; n < res.length; n++) {
                    if (res[n].SiteID === siteid) {
                        sitename = res[n].SiteName;
                        picpath = res[n].PicPath;
                        sitedesc = res[n].SiteDescription;
                        siteurl = res[n].SiteURL;
                        break;
                    }
                }

                //Insert site information into indexTest.html.
                var popupBodyItem = $("#popupBody");
                popupBodyItem.children().remove();

                var popupBodyName = $('<p class="site-name"><h4>' + sitename + '</h4></p>');
                var popupBodyDesc = $('<p class="site-description">' + sitedesc + '</p><br>');
                var popupBodyImg = $('<img class="site-img" src="' + picpath + '" /><br>');
                var popupBodyURL = $('<p class="site-URL">Please click <a href="' + siteurl + '" target="_blank"><span id="href"><b>here</b></span></a> for more detailed information</p>');

                popupBodyItem.append(popupBodyName);
                popupBodyItem.append(popupBodyDesc);
                popupBodyItem.append(popupBodyImg);
                popupBodyItem.append(popupBodyURL);

            });
        };
        */


        var handleMouseCLK = function (o) {

            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var x = o.clientX,
                y = o.clientY;

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.

            var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
            for (var q = 0; q < pickList.objects.length; q++) {
                var pickedPL = pickList.objects[q].userObject;
                console.log ("True or F: " + pickedPL instanceof WorldWind.Placemark);
                alert("Ian");
                if (pickedPL instanceof WorldWind.Placemark) {

                    //sitePopUp(pickedPL.label);
                    alert("It Worked");
                    // $(document).ready(function () {
                    //     // Make a popup Box after insert popup list items.
                    //
                    //     var modal = document.getElementById('PlacemarkC');// Get the modal
                    //     var span = document.getElementByClassName('closeIt');// Get the <span> element that closes the modal
                    //
                    //     // When the user double clicks the placemark, open the modal
                    //     modal.style.display = "block";
                    //
                    //     // When the user clicks on <span> (x), close the modal
                    //     span.onclick = function () {
                    //         modal.style.display = "none";
                    //     };
                    //
                    //     // When the user clicks anywhere outside of the modal, close it
                    //     window.onclick = function (event) {
                    //         if (event.target == modal) {
                    //             modal.style.display = "none";
                    //         }
                    //     }
                    //
                    // })
                }
            }

            pickList = [];

            // Listen for mouse double clicks placemarks and then pop up a new dialog box.
            wwd.addEventListener("click", handleMouseCLK);

            // Listen for taps on mobile devices and then pop up a new dialog box.
            var tapRecognizer = new WorldWind.TapRecognizer(wwd, handleMouseCLK);
        };



        /*
        // Get the modal
        var modal = document.getElementById('PlacemarkC');

        // Get the button that opens the modal
        var btn = document.getElementById("myBtn");

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("closeIt")[0];

        // When the user clicks the button, open the modal
        btn.onclick = function() {
            modal.style.display = "block";
            placemarkLayer = "block";
        };

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        };

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == placemarkLayer && modal) {
                modal.style.display = "none";
            }
        }
        */
    });