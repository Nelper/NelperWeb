import {Parse} from 'parse';

export default class LocationUtils {
  static kilometersBetween(pointA, pointB) {
    const pfPointA = new Parse.GeoPoint(pointA);
    const pfPointB = new Parse.GeoPoint(pointB);
    return pfPointA.kilometersTo(pfPointB);
  }
}
