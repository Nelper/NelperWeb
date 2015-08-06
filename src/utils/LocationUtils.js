import {Parse} from 'parse';

export default class LocationUtils {
  static kilometersBetween(pointA, pointB) {
    let pfPointA = new Parse.GeoPoint(pointA);
    let pfPointB = new Parse.GeoPoint(pointB);
    return pfPointA.kilometersTo(pfPointB);
  }
}
