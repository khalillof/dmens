This is dynamic RESTful api server, using nodejs expressjs and mongodb.
It does exactly what the name imply, dynamiclly construct mongodb schemas, db models, routes Create CRUD operations dynamically just though json files on the fly.

Fully functional api server just need to create your json files eithir upload them or post them as json content or file, which will be mapped to and create mongoose schema then to db model then we  use the model names to create routes populated them  with prebuild functions to create the basic cread read write update and delete operations.
