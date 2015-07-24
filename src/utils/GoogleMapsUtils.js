export default {
  load(callback) {
    window.initializeGoogleMap = () => {
      callback.call(null);
    };

    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?' +
        'key=AIzaSyDlXnYya1JQG6UFuwGlITHINa-gGYPHvt4&' +
        'callback=initializeGoogleMap';
    document.body.appendChild(script);
  },

  get() {
    return (window.google && window.google.maps) || null;
  },

  LatLng(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  },
};
