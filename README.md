`docker-compose.override.yml`
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
      - ADMIN_TOKEN=<your-admin-token>
      - FEATURE_TOKEN=<your-feature-token>
```