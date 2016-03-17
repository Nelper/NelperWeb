import {
  nodeDefinitions,
  fromGlobalId,
} from 'graphql-relay';

const _resolvers = [];

export const {nodeInterface, nodeField} = nodeDefinitions(
  async (globalId, info) => {
    const {type, id} = fromGlobalId(globalId);
    for (const resolver of _resolvers) {
      const res = await resolver.idFetcher(type, id, info);
      if (res) {
        return res;
      }
    }
    console.warn('Unknown type ' + type);
  },
  (obj) => {
    for (const resolver of _resolvers) {
      const res = resolver.typeResolver(obj);
      if (res) {
        return res;
      }
    }
    console.warn('Unknown object ' + obj);
  },
);

/**
 * Adds a resolver.
 * Every type must add a resolver to return an object by id
 * and return a type for an object. Wrapper around nodeDefinitions.
 * @see nodeDefinitions
 * @param {Function} idFetcher    Returns an object by id
 * @param {Function} typeResolver Returns a type for an object
 */
export function addResolver(idFetcher, typeResolver) {
  _resolvers.push({
    idFetcher,
    typeResolver,
  });
}
