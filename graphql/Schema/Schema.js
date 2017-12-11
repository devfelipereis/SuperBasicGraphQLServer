import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql/type';

import ToDoMongo from '../../mongoose/todo';

/**
 * generate projection object for mongoose
 * @param  {Object} fieldASTs
 * @return {Project}
 */
export function getProjection(fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = true;
    return projections;
  }, {});
};

const todoType = new GraphQLObjectType({
  name: 'todo',
  description: 'todo description',
  fields: () => ({
    id: {
      type: (GraphQLInt),
      description: 'The id of the todo.',
    },
    description: {
      type: GraphQLString,
      description: 'The description of the todo.',
    },
    completed: {
      type: GraphQLBoolean,
      description: 'Completed todo? '
    }
  })
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      todo: {
        type: new GraphQLList(todoType),
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve: async (root, {id}, source, fieldASTs) => {
          const projections = getProjection(fieldASTs);
          try {
            const items = await ToDoMongo.find({ id }, projections);
            return items;
          } catch (error) {
            console.log('error', error)
            throw new Error(error)
          }
        }
      }
    }
  })
});

export default schema;