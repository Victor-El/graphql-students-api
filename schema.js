const {
    graphql, 
    GraphQLSchema,
    GraphQLNonNull, 
    GraphQLInt, 
    GraphQLString,
    GraphQLObjectType, 
    GraphQLList
} = require('graphql');

const axios = require('axios');

const URL = process.env.DEV_API_URL;


const StudentType = new GraphQLObjectType({
    name: "Student",
    fields: {
        id: {type: GraphQLInt},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        level: {type: GraphQLInt},
        department: {type: GraphQLString},
    }
});


const StudentsListType = new GraphQLList(StudentType);

// Query
const rootQuery = new GraphQLObjectType({
    name: "StudentsRootQuery",
    fields: {
        customer: {
            type: StudentType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: (pv, args) => {
                return axios.get(URL+"/"+args.id).then(res => res.data);
            }
        },

        customers: {
            type: StudentsListType,
            args: {
                level: {type: GraphQLInt}
            },
            resolve: (pv, args) => {
                const level = args.level || "";
                const query =  level ? "?level=" + level : "";
                return axios.get(URL+query).then(res => res.data);
            }
        }
    }
});

// Mutations
const mutation = new GraphQLObjectType({
    name: "StudentsMutation",
    fields: {
        addCustomer: {
            type: StudentType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                department: {type: new GraphQLNonNull(GraphQLString)},
                level: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: (pv, args) => {
                return axios.post(URL, {
                    id: args.id,
                    name: args.name,
                    level: args.level,
                    age: args.age,
                    department: args.department
                }).then(res => res.data);
            }
        },

        removeCustomer: {
            type: StudentType,
            args: {id: {type: new GraphQLNonNull(GraphQLInt)}},
            resolve: (pv, args) => {
                return axios.delete(URL+"/"+args.id).then(res => res.data);
            }
        },

        editCustomer: {
            type: StudentType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                level: {type: new GraphQLNonNull(GraphQLInt)},
                department: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: (pv, args) => {
                return axios.patch(URL+"/"+args.id, args).then(res => res.data);
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: rootQuery,
    mutation
});

module.exports = schema;