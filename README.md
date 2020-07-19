# Tumor Antigen Portal

## Purpose

Tumor antigen is an antigenic substance produced in tumor cells, i.e., it triggers an immune response in the host. Tumor antigens are useful tumor markers in identifying tumor cells with diagnostic tests and are potential candidates for use in cancer therapy. The field of cancer immunology studies such topics.

## Components
- The database used for store integrated tumor antigens. Current the used database is MongoDB.
- RESTFUl API used for access MongoDB for CRUD operations
- UI portal is used to access all integration data and searches for new antigens via External Knowledge Sources.

## Start

Pull new version of the docker images. 
```
docker-compose pull
```

Start containers
```
docker-compose up -D
```


Stop containers
```
docker-compose down
```
