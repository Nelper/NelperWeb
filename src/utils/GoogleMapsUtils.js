export default {
  load(callback) {
    if (this.get()) {
      // Simulate async, this is useful to be able to access refs in componentDidMount.
      setTimeout(() => callback.call(null, this.get()), 0);
      return;
    }
    window.initializeGoogleMap = () => {
      callback.call(null, this.get());
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?' +
      'libraries=places&' +
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
