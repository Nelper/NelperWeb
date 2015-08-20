export default class GoogleMapsUtils {
  static load() {
    return new Promise((resolve) => {
      if (this.get()) {
        // Simulate async, this is useful to be able to access refs in componentDidMount.
        setTimeout(() => resolve(this.get()), 0);
        return;
      }
      window.initializeGoogleMap = () => {
        resolve(this.get());
      };

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?' +
        'libraries=places&' +
        'key=AIzaSyDlXnYya1JQG6UFuwGlITHINa-gGYPHvt4&' +
        'callback=initializeGoogleMap';
      document.body.appendChild(script);
    });
  }

  static get() {
    return (window.google && window.google.maps) || null;
  }
}

export class LatLng {
  constructor(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }
}
