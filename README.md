# AppSync RDS ToDo

This is a boilerplate AppSync-aurora project, that is deployed using the serverless framework.


## Highlights 
- Automated creation of resources

    This project handles creation of all resources expect the secret manager, which you will need to create yourself and add the ARN to the environment.
    I've used an ApiKey for authentication for this project but to know more about how to integrate AppSync with cognito take a look at the following implementaions
    - https://github.com/wednesday-solutions/serverless/tree/master/aws/cognito/federated-plus-passwordless-login
    - https://github.com/wednesday-solutions/serverless/tree/master/aws/cognito/federated-signin
    - https://github.com/wednesday-solutions/serverless/tree/master/aws/cognito/passwordless-login
    - https://github.com/wednesday-solutions/serverless/tree/master/aws/cognito/srp

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
- Out of the box CI/CD pipelines with support to innject environment variables using Github Secrets
    - [.github/workflows/ci.yml](.github/workflows/ci.yml)
    - [.github/workflows/cd.yml](.github/workflows/cd.yml)
    