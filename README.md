# Bulk Action Service

This project implements a **scalable Bulk Action Service** using **Node.js, Express, MongoDB, and Kafka**. It efficiently handles **CSV-based bulk updates**, ensuring fault tolerance and real-time tracking.

---

## Table of Contents
- [Tech Stack](#️-tech-stack)
- [System Architecture](#️-system-architecture)
- [Loom Video Demo](#-loom-video-demo)
- [API Documentation](#-api-documentation)
- [Postman Collection](#-postman-collection)
- [Setup & Installation](#-setup--installation)
  
---

## Tech Stack
| **Technology** | **Usage** |
|--------------|----------|
| **Node.js & Express** | Backend API |
| **MongoDB** | NoSQL Database for storing bulk actions |
| **Kafka** | Message queue for processing bulk updates |
| **Elasticsearch** | Stores detailed logs (not implemented in current scope) |
| **Postman** | API testing |

---

## System Architecture
![Bulk Action Service Architecture](https://github.com/user-attachments/assets/6772191e-75a1-46a5-91f7-6df2838105d6)

### ***System Overview*** ###
The system is designed to handle bulk actions, such as bulk updates, efficiently by processing large amounts of data asynchronously. It leverages caching, object storage, message queues, and search indexing to track progress and handle failures gracefully.

1. Client Initiation:
   - A web application or mobile client sends a bulk action request to the system via an API Gateway.
   - The request is made using POST /bulk-actions, triggering the bulk operation.
2. API Gateway & Load Balancer:
   - The API Gateway routes incoming requests to the Bulk Action Service, ensuring load balancing and security.
3. Bulk Action Service:
   - Receives the bulk action request and stores metadata about the request (e.g., total records, status, timestamps) in the bulk_actions database.
   - Stores the CSV action file in Object Storage for further processing.
4. Bulk Processing Service:
   - Retrieves the stored action file from Object Storage and begins processing records.
   - Publishes messages in batches to a Kafka queue for asynchronous processing.
   - In case of processing failures, the messages are moved to a Dead Letter Queue (DLQ) for later debugging and retry.
   - Uses Logstash for logging processing failures and updates Elasticsearch with failure logs.
5. Entity Updates:
   - Successfully processed records trigger batch updates to the entity database.
   - The database stores updated entity records with their latest status and action tracking details.
6. Progress Updates & Status Tracking:
   - The Progress Update Service aggregates the count of the processed records, and performs bulk updates to the bulk_actions database.

Clients can query the progress using:
- GET /bulk-actions – Lists all bulk actions.
- GET /bulk-actions/{actionId} – Retrieves details of a specific action.
- GET /bulk-actions/{actionId}/stats – Fetches processing statistics like success/failure counts.

---

## Loom Video Demo



---

## Postman Collection

You can import the Postman collection to test all API endpoints : https://github.com/jeenarachel/bulk-action-service/blob/main/Bulk%20Action%20API.postman_collection.json

---

## API Documentation

### Create Bulk Action
Endpoint: POST /bulk-actions

Body:
```
{
  "actionType": "BULK_UPDATE",
  "entityType": "Contact"
}
```
Response:
```
{
  "message": "Bulk action created successfully",
  "actionId": "67ba088574f9b11946038c7f"
}
```

### Get All Bulk Actions
Endpoint: GET /bulk-actions

Response:
```
[
    {
        "actionId": "67bb2f5f47fd3489bc8ba0c8",
        "actionType": "BULK_UPDATE",
        "entityType": "Contact",
        "status": "COMPLETED",
        "totalCount": 1500,
        "processedCount": 1500,
        "successCount": 0,
        "failureCount": 0,
        "skippedCount": 0,
        "createdAt": "2025-02-23T14:23:27.180Z"
    },
    {
        "actionId": "67bb2ebd47fd3489bc8ba0bd",
        "actionType": "BULK_UPDATE",
        "entityType": "Contact",
        "status": "PROCESSING",
        "totalCount": 2500,
        "processedCount": 1500,
        "successCount": 1500,
        "failureCount": 0,
        "skippedCount": 0,
        "createdAt": "2025-02-23T14:20:45.463Z"
    },
    {
        "actionId": "67bb2be247fd3489bc8ba0b2",
        "actionType": "BULK_UPDATE",
        "entityType": "Contact",
        "status": "QUEUED",
        "totalCount": 1500,
        "processedCount": 0,
        "successCount": 0,
        "failureCount": 0,
        "skippedCount": 0,
        "createdAt": "2025-02-23T14:08:34.089Z"
    }
]
```

### Get Bulk Action by ID
Endpoint: GET /bulk-actions/{actionId}

Response:
```
{
    "actionId": "67bb2f5f47fd3489bc8ba0c8",
    "actionType": "BULK_UPDATE",
    "entityType": "Contact",
    "status": "COMPLETED",
    "totalCount": 1500,
    "processedCount": 1500,
    "successCount": 0,
    "failureCount": 0,
    "skippedCount": 0,
    "createdAt": "2025-02-23T14:23:27.180Z"
}
```

### Get Bulk Action Stats
Endpoint: GET /bulk-actions/{actionId}/stats

Response:
```
{
    "actionId": "67bb2f5f47fd3489bc8ba0c8",
    "totalCount": 1500,
    "processedCount": 1500,
    "successCount": 0,
    "failureCount": 0,
    "skippedCount": 0
}
```

---

## Setup & Installation

Clone the Repository
```
git clone https://github.com/your-username/bulk-action-service.git
cd bulk-action-service
```
Install Dependencies
```
npm install
```
Set Up Environment Variables
Create a .env file in the root folder with the following:
```
MONGO_URI=mongodb+srv://*****:******@cluster41358.0l3r2.mongodb.net/bulk-actions-db?retryWrites=true&w=majority
BATCH_SIZE=500
KAFKA_BROKER=localhost:9092
KAFKA_TOPIC=bulk-update-topic
```
Start the API Server
```
npm run start:dev
```

