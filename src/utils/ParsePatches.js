/*
 *  Copyright (c) 2015, Parse, LLC. All rights reserved.
 *
 *  You are hereby granted a non-exclusive, worldwide, royalty-free license to
 *  use, copy, modify, and distribute this software in source code or binary
 *  form for use in connection with the web services and APIs provided by Parse.
 *
 *  As with any software that integrates with the Parse platform, your use of
 *  this software is subject to the Parse Terms of Service
 *  [https://www.parse.com/about/terms]. This copyright notice shall be
 *  included in all copies or substantial portions of the software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 *  IN THE SOFTWARE.
 *
 */

import {Parse} from 'parse';

/**
 * Id is used internally to provide a unique identifier for a specific Parse
 * Object. It automatically converts to a string for purposes like providing a
 * map key.
 */
class Id {
  className: string;
  objectId: string;

  constructor(className: string, objectId: string) {
    this.className = className;
    this.objectId = objectId;
  }
  toString(): string {
    return this.className + ':' + this.objectId;
  }

  static fromString(str: string) {
    const split = str.split(':');
    if (split.length !== 2) {
      throw new TypeError('Cannot create Id object from this string');
    }
    return new Id(split[0], split[1]);
  }
}

function mappedFlatten(el) {
  if (el instanceof Parse.Object) {
    return {
      __type: 'Pointer',
      className: el.className,
      objectId: el.id,
    };
  }

  return flatten(el); // eslint-disable-line no-use-before-define
}

/**
 * Convert a Parse Object or array of Parse Objects into a plain JS Object.
 */
function flatten(object) {
  if (Array.isArray(object)) {
    return object.map(mappedFlatten);
  }
  if (!(object instanceof Parse.Object)) {
    return object;
  }

  const flat = {
    id: new Id(object.className, object.id),
    className: object.className,
    objectId: object.id,
  };
  if (object.createdAt) {
    flat.createdAt = object.createdAt;
  }
  if (object.updatedAt) {
    flat.updatedAt = object.updatedAt;
  }
  for (const attr in object.attributes) {
    if (object.attributes.hasOwnProperty(attr)) {
      const val = object.attributes[attr];
      if (val instanceof Parse.Object) {
        // We replace it with a pointer
        flat[attr] = mappedFlatten(val);
      } else if (Array.isArray(val)) {
        flat[attr] = val.map(mappedFlatten);
      } else {
        flat[attr] = val;
      }
    }
  }

  return flat;
}


if (!Parse.Object.prototype.toPlainObject) {
  Parse.Object.prototype.toPlainObject = function toPlainObject() {
    return flatten(this);
  };
}
