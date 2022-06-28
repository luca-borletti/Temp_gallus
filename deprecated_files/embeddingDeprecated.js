// Import ThoughtSpot SDK
import {
  init,
  LiveboardEmbed,
  Action,
  RuntimeFilterOp,
  EmbedEvent,
  AuthType
} from 'https://cdn.jsdelivr.net/npm/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

// Initialize embed configuration
init({
  thoughtSpotHost:
    /*param-start-hosturl*/"https://try-everywhere.thoughtspot.cloud"/*param-end-hosturl*/,
  authType: AuthType.None
});

// Instantiate class for embedding a Liveboard
const embed = new LiveboardEmbed("#embed", {
    frameParams: {},
    /*param-start-liveboardFullHeight*/
     fullHeight: true,
/*param-end-liveboardFullHeight*/
    /*param-start-modifyActions*//*param-end-modifyActions*/
    /*param-start-liveboardId*/
     liveboardId: "00ea9cf2-d1fc-4530-807b-370fad849543",
/*param-end-liveboardId*/
    /*param-start-runtimeFilters*//*param-end-runtimeFilters*/
});

hideNoDataImage();

embed
    // Register event listeners
    .on(EmbedEvent.Init, showLoader)
    .on(EmbedEvent.Load, hideLoader)
    .on(EmbedEvent.AuthExpire, showAuthExpired)
    /*param-start-customActionHandle*//*param-end-customActionHandle*/
    .on(EmbedEvent.Error, () => {
        showNoDataImage();
        hideLoader();
    })
    // Render Liveboard
    .render();

// Functions to show and hide a loader while iframe loads
function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

function showAuthExpired() {
  document.getElementById("authExpiredBanner").style.display = "flex";
}

// Functions to show or hide No data images

function showNoDataImage() {
  document.getElementById("no-data").style.display = "block";
}
function hideNoDataImage() {
  document.getElementById("no-data").style.display = "none";
}
