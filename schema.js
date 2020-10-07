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


const rootQuery = new GraphQLObjectType({
    name: "StudentsRootQuery",
    fields: {
        customer: {
            type: StudentType,
            args: {
                id: {type: GraphQLInt}
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


const schema = new GraphQLSchema({
    query: rootQuery
});

module.exports = schema;