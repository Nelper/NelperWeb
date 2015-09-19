export default class GoogleMapsUtils {
  static load() {
    return new Promise((resolve) => {
      if (__SERVER__) {
        resolve(null);
      }
      if (this.get()) {
        // Simulate async, this is useful to be able to access refs in componentDidMount.
        setTimeout(() => resolve(this.get()), 0);
        return;
      }
      window.initializeGoogleMap = () => {
        setTimeout(() => resolve(this.get()), 0);
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
    if (__SERVER__) {
      return null;
    }
    return (window.google && window.google.maps) || null;
  }
}

export class LatLng {
  constructor(latOrObj, lng) {
    if (typeof latOrObj === 'object') {
      this.lat = latOrObj.latitude;
      this.lng = latOrObj.longitude;
    } else {
      this.lat = latOrObj;
      this.lng = lng;
    }
  }
}
