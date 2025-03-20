<template>
  <div class="map-container">
    <div id="map" ref="mapRef" style="width: 100%; height: 600px" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

export default {
  name: "GermanyStoreMap",
  props: {
    stores: {
      type: Array,
      required: true,
    },
    // Optional prop to indicate which numbering system to use
    numberingSystem: {
      type: String,
      default: "index", // 'index', 'custom'
      validator: (value) => ["index", "custom"].includes(value),
    },
    // Optional prop to specify a custom numbering field
    numberField: {
      type: String,
      default: "storeId",
    },
  },
  setup(props) {
    const mapRef = ref(null);

    onMounted(async () => {
      // Dynamically import Leaflet to avoid SSR issues
      const L = await import("leaflet");

      // Create map centered on Germany with selective controls enabled
      const map = L.map(mapRef.value, {
        zoomControl: true, // Enable zoom controls
        dragging: false, // Enable dragging/panning
        touchZoom: true, // Enable touch zoom
        scrollWheelZoom: true, // Enable scroll wheel zoom
        doubleClickZoom: true, // Enable double click zoom
        boxZoom: true, // Enable box zoom
        keyboard: true, // Enable keyboard navigation
        tap: true, // Enable tap handler
        attributionControl: false,
        minZoom: 6, // Set minimum zoom level
        maxZoom: 10, // Set maximum zoom level
        maxBounds: [
          // Set map boundaries
          [47.0, 5.0], // Southwest corner
          [55.5, 16.0], // Northeast corner
        ],
        maxBoundsViscosity: 1.0, // Make bounds completely solid
      }).setView([51.1657, 10.4515], 6);

      map.on("zoomend", () => {
        if (map.getZoom() > 6) {
          map.dragging.enable();
        } else {
          map.dragging.disable();
        }

        if (map.getZoom() === 6) {
          map.setView([51.1657, 10.4515], 6);
        }
      });

      map.on("moveend", () => {
        if (map.getZoom() === 6 && !map.getBounds().contains([51.1657, 10.4515])) {
          map.flyTo([51.1657, 10.4515], 6);
        }
      });

      // Add a minimal tile layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap, CARTO",
      }).addTo(map);

      // Add attribution text
      const attributionText = L.control({ position: "bottomright" });
      attributionText.onAdd = function () {
        const div = L.DomUtil.create("div", "attribution-text");
        div.innerHTML = "&copy; Map: CARTO/OSM";
        return div;
      };
      attributionText.addTo(map);

      // Load Germany boundaries
      fetch(
        "https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/1_deutschland/3_mittel.geo.json"
      )
        .then((response) => response.json())
        .then((data) => {
          // Create Germany boundary
          L.geoJSON(data, {
            style: {
              color: "#333",
              weight: 2.5,
              fillColor: "#f8f8f8",
              fillOpacity: 0.4,
            },
          }).addTo(map);

          // Load states
          fetch(
            "https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/4_niedrig.geo.json"
          )
            .then((response) => response.json())
            .then((statesData) => {
              L.geoJSON(statesData, {
                style: {
                  color: "#999",
                  weight: 1,
                  fillColor: "transparent",
                  fillOpacity: 0,
                },
              }).addTo(map);
            })
            .catch((err) => console.error("Error loading German states", err));
        })
        .catch((err) => console.error("Error loading Germany boundary", err));

      // Filter for German stores
      const germanStores = props.stores.filter(
        (store) => store.country === "Germany" || store.country === "Deutschland"
      );

      // Add numbered markers for each store
      germanStores.forEach((store, index) => {
        if (store.latitude && store.longitude) {
          // Determine the marker number based on the numbering system
          let markerNumber;
          if (props.numberingSystem === "index") {
            markerNumber = index + 1; // Start from 1 instead of 0
          } else if (props.numberingSystem === "custom" && store[props.numberField]) {
            markerNumber = store[props.numberField];
          } else {
            markerNumber = index + 1; // Fallback to index if custom field is not available
          }

          // Create a custom numbered marker
          const numberedIcon = L.divIcon({
            className: "numbered-marker",
            html: `<div>${markerNumber}</div>`,
            iconSize: [30, 30],
          });

          // Create marker with numbered icon
          const marker = L.marker([store.latitude, store.longitude], {
            icon: numberedIcon,
            interactive: true, // Enable interaction for tooltips
          });

          // Add tooltip with store information
          if (store.name) {
            marker.bindTooltip(store.name);
          }

          // Add marker directly to the map (no clusters)
          marker.addTo(map);
        }
      });
    });

    return {
      mapRef,
    };
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Numbered marker style */
:global(.numbered-marker) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:global(.numbered-marker div) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 26px;
  height: 26px;
  background-color: #3388ff;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 14px;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Attribution style */
:global(.attribution-text) {
  font-size: 9px;
  color: #666;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 1px 4px;
  border-radius: 2px;
  pointer-events: none;
}
</style>
