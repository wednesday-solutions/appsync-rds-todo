# AppSync RDS ToDo

This is a boilerplate AppSync-aurora project, that is deployed using the serverless framework with out of the box support for automated creation of a Serverless database cluster, lambdas, vpcs, security groups, nat gateways, etc. 


This project exposes the following queries and mutations
## Queries

```
type Query {
  notes(pagination: PaginationInput!, where: AWSJSON): PaginatedNotes!
  lists(pagination: PaginationInput!, where: AWSJSON): PaginatedLists!
  users(pagination: PaginationInput!, where: AWSJSON): PaginatedUsers!
}
```

## Mutations

```
type Mutation {
  # create mutations
  createNote(input: CreateNoteRequest!): MutatedNote!
  createList(input: CreateListRequest!): MutatedList!
  createUser(input: CreateUserRequest!): MutatedUser!

  # update mutations
  updateList(input: UpdateListRequest!): MutatedList!
  updateNote(input: UpdateNoteRequest!): MutatedNote!
  updateUser(input: UpdateUserRequest!): MutatedUser!

  # delete mutations
  deleteList(id: ID!): MutatedList!
  deleteNote(id: ID!): MutatedNote!
  deleteUser(id: ID!): MutatedUser!
}
```

You can find the complete postman collection here: [Collection](postman/collection.json)

## Highlights 
- Automated creation of resources

    This project handles creation of all resources expect the secret manager, which you will need to create yourself and add the ARN to the environment.
    I've used an ApiKey for authentication for this project but to know more about how to integrate AppSync with cognito take a look at the following implementaions
    - [Federated and passwordless login](https://github.com/wednesday-solutions/serverless/tree/master/aws/cognito/federated-plus-passwordless-login)
    - [Federated Sign in](https://github.com/wednesday-solutions/serverless/tree/master/aws/cognito/federated-signin)
    - [Passwordless login](https://github.com/wednesday-solutions/serverless/tree/master/aws/cognito/passwordless-login)
    - [SRP](https://github.com/wednesday-solutions/serverless/tree/master/aws/cognito/srp)

    Creation of the following resources is automated
    - [Serverless Aurora cluster](resources/rds/resources.yml)
    - [Subnets](resources/config/subnet.yml)
    - [Route Tables](resources/config/route-public.yml)
    - [Security Groups]((resources/config/security-groups.yml))
    - [VPC](resources/config/vpc.yml)
    - [NAT Gateway](resources/config/vpc.yml)
    - [Internet Gateway](resources/config/internet-gateway.yml)
    - [IAM Roles](resources/config/roles.yml)
    - [Lambdas](resources/rds/resources.yml)
    - [Lambdas as datasources](resources/lambas/datasources.yml)
    - [RDS as a datasource](resources/rds/datasources.yml)
- Support for running database migrations in the CD pipeline. 
    If you've used a serverless cluster before you know how problematic this is. Take a look at the following files to get a better idea about how we did it
    - [webpack.config.js](webpack.config.js)
    - [functions/database/migrate/index.js](functions/database/migrate/index.js)
    - [scripts/post-deployment.js](scripts/post-deployment.js)
- All queries support a sequelizedWhere, which allows a highly-configurable queries
- All mutations are resolved directly off of the database
    This project has out of the support for a camelCased GraphQL interface, whereas the database layer has snake_case table and column names. So how do we resolve mutations directly off of the database?
    - [resolvers/mutations/createNote.request.vtl](resolvers/mutations/createNote.request.vtl)
    - [resolvers/mutations/response.vtl](resolvers/mutations/response.vtl)
- Max depth for GraphQL queries is restricted to 4
- Support for paginated queries
    Nested pagination and fulfilling of deeply-nested queries is exhausting and overwhelming, take a look at how we've simplified this
    - [utils/dbUtils.js](utils/dbUtils.js)
    - [functions/queries/Notes/index.js](functions/queries/Notes/index.js)
- Support for serverless-webpack, which allows you to use the latest JavaScript functionality in your lambdas
- Support for serverless-dotenv, which allows you to deploy easily to multiple environments
- Out of the box support for sequelize
- Out of the box CI/CD pipelines with support to innject environment variables using Github Secrets
    - [.github/workflows/ci.yml](.github/workflows/ci.yml)
    - [.github/workflows/cd.yml](.github/workflows/cd.yml)

## Adding features on top of the template

What we've done here is built a base on top of which we can incrementally add new features easily. 
### Adding a new table
- Create a new migration file
- Increment the version in `migrations/resources/` and add the necessary .sql
- Create the sequelize model in the `models/` folder


### Adding a new query
- Create a Lambda
Take a look at the following lambda, you just need to change the model that you're passing to findAll
[functions/queries/Notes/index.js](functions/queries/Notes/index.js)
    ```
    exports.handler = async (event, context, callback) =>
      logHandler(event, callback, async () => {
        try {
          return success(context.done || callback, await findAll(db[<new-model-you-created>], event));
        } catch (err) {
          return failure(context.fail || callback, err);
        }
      });

    ```
- Add the Lambda in the `resources/lambdas/functions.yml`
    ```
    <name-of-function>:
      handler: <path-to-newly-created-function>.handler
      role: <either use `LambdaServiceRole` or create a new role as required>
      vpc:
        securityGroupIds:
          - !Ref ServerlessSecurityGroup
        subnetIds:
          - Ref: ServerlessPrivateSubnetA
          - Ref: ServerlessPrivateSubnetB
          - Ref: ServerlessPrivateSubnetC
    ```
- Add the Lambda as a datasource in the `resources/lambdas/datasources.yml`
    ```
    - type: AWS_LAMBDA
      name: Lambda_<name-of-function>
      description: "<Proper description>"
      config:
        functionName: <name-of-the-function-as-in-the-functions.yml>
    ```
- Add the query in resources/mapping-templates/queries.yml

    ```
    - type: Query
      field: <name-of-field-in-graphql-schema>
      request: "queries/query.req.vtl"
      response: "response.vtl"
      dataSource: <name-as-mentioned-in-the-lambdas/datasources.yml>
    ```

###  Adding a mutation
- Create a new request resolver, based on the type of the mutation you can use one of the following templates

    - Create

        ```
            #set( $cols = [] )
            #set( $vals = [] )
            #foreach( $entry in $ctx.args.input.keySet() )
              #set( $regex = "([a-z])([A-Z]+)")
              #set( $replacement = "$1_$2")
              #set( $toSnake = $entry.replaceAll($regex, $replacement).toLowerCase() )
              #set( $discard = $cols.add("$toSnake") )
              #if( $util.isBoolean($ctx.args.input[$entry]) )
                  #if( $ctx.args.input[$entry] )
                    #set( $discard = $vals.add("1") )
                  #else
                    #set( $discard = $vals.add("0") )
                  #end
              #else
                  #set( $discard = $vals.add("'$ctx.args.input[$entry]'") )
              #end
            #end

            #set( $valStr = $vals.toString().replace("[","(").replace("]",")") )
            #set( $colStr = $cols.toString().replace("[","(").replace("]",")") )
            #if ( $valStr.substring(0, 1) != '(' )
              #set( $valStr = "($valStr)" )
            #end
            #if ( $colStr.substring(0, 1) != '(' )
              #set( $colStr = "($colStr)" )
            #end
            {
              "version": "2018-05-29",
              "statements":   ["INSERT INTO <name-of-table> $colStr VALUES $valStr", "SELECT * FROM <name-of-table> ORDER BY id DESC LIMIT 1"]
            }
        ```

    - Update

        ```
            #set( $update = "" )
            #set( $equals = "=" )
            #foreach( $entry in $ctx.args.input.keySet() )
               #set( $cur = $ctx.args.input[$entry] )
               #if( $util.isBoolean($cur) )
                   #if( $cur )
                     #set ( $cur = "1" )
                   #else
                     #set ( $cur = "0" )
                   #end
               #end
               #if ( $util.isNullOrEmpty($update) )
                  #set($update = "$entry$equals'$cur'" )
               #else
                  #set($update = "$update,$entry$equals'$cur'" )
               #end
            #end
            {
              "version": "2018-05-29",
              "statements":   ["UPDATE <name-of-table> SET $update WHERE id=$ctx.args.input.id", "SELECT * FROM <name-of-table> WHERE id=$ctx.args.input.id"]
            }
        ```
        
    - Delete

        ```
            {
              "version": "2018-05-29",
              "statements":   ["UPDATE <name-of-table> set deleted_at=NOW() WHERE id=$ctx.args.id", "SELECT * FROM <name-of-table> WHERE id=$ctx.args.id"]
            }
        ```

- Add a mutation in `resources/mapping-templates/mutations.yml`

    ```
    - type: Mutation
      field: createNote
      request: "mutations/createNote.req.vtl"
      response: "mutations/response.vtl"
      dataSource: POSTGRES_RDS
    ```
