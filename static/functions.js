function getDistance(layer) {
	trees_fc = trees.toGeoJSON();
		layer_fc = turf.featurecollection([trees.getLayer(layer).toGeoJSON()]);
		buffer_fc = turf.featurecollection([personBuffer.toGeoJSON()]);
		within = turf.within(layer_fc, buffer_fc);
		nearest = turf.nearest(person.toGeoJSON(),trees_fc);
		treeCoords = trees.getLayer(layer).toGeoJSON().geometry.coordinates;
		nearestCoords = nearest.geometry.coordinates;

		if (treeCoords[0] == nearestCoords[0] & treeCoords[1] == nearestCoords[1]) {
			return 'nearest';
		}
		else if (within.features.length == 1) {
			return 'within';
		}
		else {
			return 'outside';
		};
};

function resizeBuffer(buffer,lat,lng,bufferSize) {
	buffer.clearLayers();
	personBuffer = LGeo.circle([lat,lng], bufferSize, {
		stroke: false,
		fillColor: "#514e4e"
	})
	buffer.addLayer(personBuffer);
};

function updateTreeMarkers() {
	person.setZIndexOffset(1000);

	for (layer in trees._layers) {
		layerDistance = getDistance(layer);

		if (layerDistance == 'nearest') {
			trees.getLayer(layer).setIcon(nearestIcon)
		}
		else if (layerDistance == 'within') {
			trees.getLayer(layer).setIcon(treeIcon)
		}
		else {
			trees.getLayer(layer).setIcon(backgroundIcon)
		};
	};
}

// Add popups to tree layer
function onEachFeature(feature, layer) {
	if (feature.properties.species_nm) {
		var popup = L.popup({closeButton: false}).setContent('<i>' + feature.properties.species_nm + '</i>');
		layer.bindPopup(popup);
	};
};

function openTreePopup(e) {
	plot.highlight(0,getPosition(e.layer.feature.properties.species_nm));

	map.addControl(sidebarControl());

	if (e.layer.feature.properties.tree_photo === null) {
		treePhoto = 'static/data/images/Tree.jpg';
	}
	else {
		treePhoto = e.layer.feature.properties.tree_photo;
	};

	controlDiv.innerHTML = '<center><img src="' + treePhoto + '"style="width:200px"></center>' + '</br>' +
		'<b>' + e.layer.feature.properties.species_nm + '</b>' + '</br>' + '</br>' +
		'<b>' + 'Date: ' + '</b>'+ e.layer.feature.properties.date + '</br>' +
		'<b>' + 'Site Type: ' + '</b>' + e.layer.feature.properties.site_type + '</br>' +
		'<b>' + 'Health: ' + '</b>' + e.layer.feature.properties.health + '</br>' +
		'<b>' + 'Height: ' + '</b>' + e.layer.feature.properties.height + '</br>' +
		'<b>' + 'Crown Diameter: ' + '</b>' + e.layer.feature.properties.crown_diam + 'm' + '</br>' +
		'<b>' + 'Leaf Cover: ' + '</b>' + e.layer.feature.properties.leaf_cover + '</br>' +
		'<b>' + 'Tree Size: ' + '</b>' + e.layer.feature.properties.tree_size + '</br>';

	layerDistance = getDistance(e.layer._leaflet_id);

	if (layerDistance == 'nearest') {
		e.layer.setIcon(nearestIconLarge);
	}
	else if (layerDistance == 'within') {
		e.layer.setIcon(treeIconLarge);
	}
	else {
		e.layer.setIcon(backgroundIconLarge);
	};
};

function closeTreePopup(e) {
	plot.unhighlight();

	map.removeControl(controlSidebar);

	controlDiv.innerHTML = '';

	layerDistance = getDistance(e.layer._leaflet_id);

	if (layerDistance == 'nearest') {
		e.layer.setIcon(nearestIcon);
	}
	else if (layerDistance == 'within') {
		e.layer.setIcon(treeIcon);
	}
	else {
		e.layer.setIcon(backgroundIcon);
	};
};

function filterSpecies(speciesName) {
	var filtered = turf.filter(st_trees, "species_nm", speciesName);
	trees.clearLayers();

	if (speciesName == '') {
		trees.addData(st_trees);
	}
	else {
		trees.addData(filtered);
	};

	updateTreeMarkers();
};

function getCount(species) {
	var count = 0;
	for (var i = 0; i < st_trees.features.length; i++) {
		if (st_trees.features[i].properties.species_nm == species) {
 			count++;
		}
	}
	return count;
};

function getPosition(species_nm) {
	for (var i = 0; i < chartData.length; i++) {
		if (species_nm == chartData[i+1][0]) {
			return i;
		}
		else {
			return -1;
		};
	};
};