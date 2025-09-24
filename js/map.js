(function(window) {
  'use strict';

  var mapElement = document.getElementById('map');
  if (!mapElement) {
    return;
  }

  var i18n = window.OverlapseI18n || null;

  function translate(key, fallbackValue) {
    if (i18n && typeof i18n.t === 'function') {
      var result = i18n.t(key, fallbackValue);
      if (result !== undefined) {
        return result;
      }
    }
    return fallbackValue;
  }

  var locations = [
    {
      title: 'Praia da Barra',
      yearsKey: 'locations.praia.years',
      yearsFallback: '1974 & 2014',
      descriptionKey: 'locations.praia.description',
      descriptionFallback: 'The Atlantic frontage grows from a working shoreline into a promenade beside the Barra lighthouse.',
      coordinates: [40.642360, -8.742569]
    },
    {
      title: 'Aveiro Canal Central',
      yearsKey: 'locations.aveiro.years',
      yearsFallback: '1962 & 2020',
      descriptionKey: 'locations.aveiro.description',
      descriptionFallback: 'Traditional moliceiro boats share the waterway with new pedestrian routes and riverside cafes.',
      coordinates: [40.640161, -8.653907]
    },
    {
      title: 'Rossio Square',
      yearsKey: 'locations.rossio.years',
      yearsFallback: '1955 & 2018',
      descriptionKey: 'locations.rossio.description',
      descriptionFallback: 'A civic plaza that evolves from market stalls to a flexible public space for events and gatherings.',
      coordinates: [40.643678, -8.646293]
    }
  ];

  if (typeof L === 'undefined') {
    renderFallbackMap(mapElement, locations);
    return;
  }

  var defaultCenter = locations.length ? locations[0].coordinates : [40.643, -8.653];

  var map = L.map(mapElement, {
    scrollWheelZoom: false,
    zoomControl: true
  }).setView(defaultCenter, 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(map);

  var bounds = L.latLngBounds();

  locations.forEach(function(location) {
    var marker = L.marker(location.coordinates).addTo(map);
    var popupContent = [
      '<strong>' + escapeHtml(location.title) + '</strong>',
      '<div style="margin-top:4px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">' + escapeHtml(getLocationYears(location)) + '</div>',
      '<p style="margin:8px 0 0;font-size:13px;line-height:20px;">' + escapeHtml(getLocationDescription(location)) + '</p>'
    ].join('');
    marker.bindPopup(popupContent, {
      closeButton: false
    });
    bounds.extend(location.coordinates);
  });

  if (locations.length > 1) {
    map.fitBounds(bounds.pad(0.2));
  }

  repositionZoomControl(mapElement);

  function getLocationYears(location) {
    return translate(location.yearsKey, location.yearsFallback || '');
  }

  function getLocationDescription(location) {
    return translate(location.descriptionKey, location.descriptionFallback || '');
  }

  function renderFallbackMap(container, locationList) {
    container.classList.add('map-container--fallback');
    container.innerHTML = '';

    var width = 720;
    var height = 440;
    var padding = 50;
    var svgNS = 'http://www.w3.org/2000/svg';

    var lats = locationList.map(function(loc) { return loc.coordinates[0]; });
    var lons = locationList.map(function(loc) { return loc.coordinates[1]; });

    var latMin = Math.min.apply(null, lats);
    var latMax = Math.max.apply(null, lats);
    var lonMin = Math.min.apply(null, lons);
    var lonMax = Math.max.apply(null, lons);

    if (latMax === latMin) {
      latMax += 0.01;
      latMin -= 0.01;
    }

    if (lonMax === lonMin) {
      lonMax += 0.01;
      lonMin -= 0.01;
    }

    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Static map showing Overlapse locations');

    var background = document.createElementNS(svgNS, 'rect');
    background.setAttribute('x', '0');
    background.setAttribute('y', '0');
    background.setAttribute('width', width);
    background.setAttribute('height', height);
    background.setAttribute('fill', '#dbe7f1');
    svg.appendChild(background);

    var coastline = document.createElementNS(svgNS, 'path');
    coastline.setAttribute('d', 'M40 120 C220 20 420 40 660 110 L660 440 L40 440 Z');
    coastline.setAttribute('fill', '#b7cfe0');
    coastline.setAttribute('opacity', '0.6');
    svg.appendChild(coastline);

    var gridColor = 'rgba(0, 0, 0, 0.08)';
    for (var i = padding; i < width - padding; i += 80) {
      var vLine = document.createElementNS(svgNS, 'line');
      vLine.setAttribute('x1', i);
      vLine.setAttribute('y1', padding);
      vLine.setAttribute('x2', i);
      vLine.setAttribute('y2', height - padding);
      vLine.setAttribute('stroke', gridColor);
      vLine.setAttribute('stroke-width', '1');
      svg.appendChild(vLine);
    }

    for (var j = padding; j < height - padding; j += 80) {
      var hLine = document.createElementNS(svgNS, 'line');
      hLine.setAttribute('x1', padding);
      hLine.setAttribute('y1', j);
      hLine.setAttribute('x2', width - padding);
      hLine.setAttribute('y2', j);
      hLine.setAttribute('stroke', gridColor);
      hLine.setAttribute('stroke-width', '1');
      svg.appendChild(hLine);
    }

    locationList.forEach(function(location, index) {
      var lat = location.coordinates[0];
      var lon = location.coordinates[1];

      var x = padding + ((lon - lonMin) / (lonMax - lonMin)) * (width - padding * 2);
      var y = padding + ((latMax - lat) / (latMax - latMin)) * (height - padding * 2);

      var marker = document.createElementNS(svgNS, 'circle');
      marker.setAttribute('cx', x);
      marker.setAttribute('cy', y);
      marker.setAttribute('r', 10);
      marker.setAttribute('fill', '#ff6b4a');
      marker.setAttribute('stroke', '#ffffff');
      marker.setAttribute('stroke-width', '3');

      var title = document.createElementNS(svgNS, 'title');
      title.textContent = getLocationYears(location) + ' - ' + location.title;
      marker.appendChild(title);
      svg.appendChild(marker);

      var labelBg = document.createElementNS(svgNS, 'rect');
      var labelWidth = 170;
      var labelHeight = 40;
      var labelX = Math.min(Math.max(x - labelWidth / 2, padding), width - padding - labelWidth);
      var labelY = Math.max(y - 46, padding);
      labelBg.setAttribute('x', labelX);
      labelBg.setAttribute('y', labelY);
      labelBg.setAttribute('width', labelWidth);
      labelBg.setAttribute('height', labelHeight);
      labelBg.setAttribute('rx', 6);
      labelBg.setAttribute('fill', 'rgba(255,255,255,0.92)');
      labelBg.setAttribute('stroke', 'rgba(0,0,0,0.12)');
      svg.appendChild(labelBg);

      var labelTitle = document.createElementNS(svgNS, 'text');
      labelTitle.setAttribute('x', labelX + 12);
      labelTitle.setAttribute('y', labelY + 18);
      labelTitle.setAttribute('fill', 'rgba(0,0,0,0.75)');
      labelTitle.setAttribute('font-size', '13');
      labelTitle.setAttribute('font-family', 'Nunito Sans, sans-serif');
      labelTitle.textContent = location.title;
      svg.appendChild(labelTitle);

      var labelYears = document.createElementNS(svgNS, 'text');
      labelYears.setAttribute('x', labelX + 12);
      labelYears.setAttribute('y', labelY + 32);
      labelYears.setAttribute('fill', 'rgba(0,0,0,0.5)');
      labelYears.setAttribute('font-size', '11');
      labelYears.setAttribute('font-family', 'Nunito Sans, sans-serif');
      labelYears.textContent = getLocationYears(location);
      svg.appendChild(labelYears);

      if (index === 0) {
        var originDot = document.createElementNS(svgNS, 'circle');
        originDot.setAttribute('cx', x);
        originDot.setAttribute('cy', y);
        originDot.setAttribute('r', 4);
        originDot.setAttribute('fill', '#ffffff');
        svg.appendChild(originDot);
      }
    });

    container.appendChild(svg);

    var note = document.createElement('div');
    note.className = 'map-fallback-note';
    note.textContent = translate(
      'map.fallback.note',
      'Connect to the internet to unlock the interactive OpenStreetMap view. This static preview shows the featured locations.'
    );
    container.appendChild(note);
  }

  function escapeHtml(value) {
    return (value || '').replace(/[&<>"']/g, function(character) {
      switch (character) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case '\'':
          return '&#39;';
        default:
          return character;
      }
    });
  }

  function repositionZoomControl(mapElementRef) {
    var legacyContainer = mapElementRef.querySelector('.leaflet-top.leaflet-left');
    var zoomControl = mapElementRef.querySelector('.leaflet-control-zoom');

    if (!zoomControl) {
      return;
    }

    if (legacyContainer && zoomControl.parentNode === legacyContainer) {
      legacyContainer.removeChild(zoomControl);
    }

    if (zoomControl.parentNode !== mapElementRef) {
      mapElementRef.appendChild(zoomControl);
    }
    zoomControl.classList.add('map-zoom-control');

    if (legacyContainer && legacyContainer.childNodes.length === 0) {
      legacyContainer.remove();
    }
  }
})(window);
