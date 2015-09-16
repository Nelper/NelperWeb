import {Parse} from 'parse';

export default class LocationUtils {
  /**
   * Returns the distance in kilometers between 2 points.
   * @param  {GeoPoint} pointA First point
   * @param  {GeoPoint} pointB Second point
   * @return {number} The distance
   */
  static kilometersBetween(pointA, pointB) {
    const pfPointA = new Parse.GeoPoint(pointA);
    const pfPointB = new Parse.GeoPoint(pointB);
    return pfPointA.kilometersTo(pfPointB);
  }
}
