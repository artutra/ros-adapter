## Installation

First you must run `docker-compose run ros bash` and then `npm start`. After the server initialize you must look for the `usr/src/app/data/keys/admin.json` file inside the `ros` container to get the admin token.
After that, create a `docker-compose.override.yml` file and configure the enviroment variables:
```
version: '2.0'

services:
  postgres-db:
    environment:
      - POSTGRES_DB=ros_db
      - POSTGRES_USER=ros_user
      - POSTGRES_PASSWORD=ros_example
  ros-adapter:
    environment:
      - ROS_URL=realm://ros:9080
      - ADMIN_TOKEN=<YOUR-ADMIN-TOKEN>
      - FEATURE_TOKEN=<YOUR-FEATURE-TOKEN>
```
And finally you can run `docker-compose up`

Go to `http://localhost:9080` in your browser to see if its working