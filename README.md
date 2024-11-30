# Events Shuffle API

## 1. Project Overview

A lightweight backend for scheduling events with friends. Features include creating events, adding votes, and finding dates suitable for all participants. Built with scalability in mind to accommodate future extensions.

### Built with

Events Shuffle API is a scheduling backend built with **NestJS**, allowing users to create events, vote on proposed dates, and determine the most suitable date based on participants' preferences.
The API is secured with **JWT authentication** to ensure that users are authenticated before accessing protected routes.

## Key Features

- **JWT Authentication**: User authentication and authorization.
- **User-Friendly Voting**: Automatically uses the username from the JWT token in creating events and voting.
- **Robust Event Management**: Create, list, and determine suitable event dates based on votes.
- **Scalable Design**: Built with modularity in mind for future enhancements.
- **Containerized Deployment**: Docker support for consistent deployment environments.

---

## **Tech Stack**

- **Framework**: [NestJS](https://nestjs.com/) (MVC architecture)
- **Database**: MongoDB (hosted on MongoDB Atlas) with **Mongoose ODM**
- **Testing**: Jest for integration and unit tests
- **Documentation**: Postman (for API documentation and testing)
- **Authentication**: JWT (JSON Web Token) with `AuthGuard` for route protection
- **Package Manager**: Yarn
- **Containerization**: Docker

---

## **Installation and Setup**

### **Local Setup**

1. Clone the repository:

   ```bash
   git clone https://github.com/bvenceslas/events-shuffle.git
   cd events-shuffle
   ```

2. Install dependencies

   ```bash
     yarn
   ```

3. Set up the environment variables: Create a `.env` file in the project root based on the provided `.env.example` file with the following content:

   ```
   DATABASE_USER=<your_database_user>
   DATABASE_PASSWORD=<your_database_password>
   DATABASE_NAME=<your_database_name>
   JWT_SECRET=<your_jwt_secret>
   ```

   **Note**: The actual values should be kept secret and not shared publicly.

4. Run the app:

   ```bash
   yarn start
   ```

### **Docker Setup**

1. Ensure Docker is installed on your system.
2. Clone the repository:

   ```bash
   git clone https://github.com/bvenceslas/events-shuffle.git
   cd events-shuffle
   ```

3. Build and run the Docker container:
   ```bash
   yarn docker:build
   yarn docker:run
   ```

---

## Connecting to MongoDB

The application uses a hosted MongoDB Atlas cluster. You can connect to it using MongoDB Compass or your preferred MongoDB client.

**Connection String**:

    mongodb+srv://shu_test_user_ffle:hpbGf5KEFoo6AZhl@braincluster.iyj68qh.mongodb.net/events-shuffle

Once connected, browse the `events-shuffle` database to view the data.

---

## API Documentation and Testing

Here is the [Documentation URL](https://documenter.getpostman.com/view/11414441/2sAYBYeVTi)

Initially, we need to sign up a new user and then login using the same username and password used to sign up.
When logging in, The returned token is saved in the **Postman Collection Variables** under the key `authToken` for subsequent API calls, and immediately included under Authorization of protected routes.

Before creating new users, you can test the api using the seeding data.
Here is the summary about seeding data:

#### **Users**

| Username   | Password     |
| ---------- | ------------ |
| brainkss   | H@kM3!fUK3n  |
| chris      | S1RhChR1S    |
| josh       | J!0@-\*&s#h  |
| bvenceslas | $@L$3Cn3VB0  |
| richard    | 20D_r@4C!R24 |

#### **Events**

| Event Name            | Dates                                                      |
| --------------------- | ---------------------------------------------------------- |
| December Marathon     | 2024-12-22, 2024-12-24, 2024-12-26, 2024-12-28, 2024-12-30 |
| Meeting Evaluation    | 2024-12-05, 2024-12-15, 2024-12-25                         |
| New Year Back to Work | 2025-01-02, 2025-01-05, 2025-01-07, 2025-01-09             |

---

#### **Voting Suggestions**

##### **1. December Marathon** (ID: `67483f6ab8db44fa48859a7f`)

| Username   | Voting Dates                       |
| ---------- | ---------------------------------- |
| brainkss   | 2024-12-22, 2024-12-26, 2024-12-30 |
| chris      | 2024-12-22, 2024-12-24, 2024-12-26 |
| josh       | 2024-12-24, 2024-12-26, 2024-12-30 |
| bvenceslas | 2024-12-26, 2024-12-30             |
| richard    | 2024-12-30                         |

##### **2. Meeting Evaluation** (ID: `6748442782da917937f879be`)

| Username   | Voting Dates                       |
| ---------- | ---------------------------------- |
| brainkss   | 2024-12-05                         |
| chris      | 2024-12-15, 2024-12-25             |
| josh       | 2024-12-15, 2024-12-25             |
| bvenceslas | 2024-12-05                         |
| richard    | 2024-12-05, 2024-12-15, 2024-12-25 |

##### **3. New Year Back to Work** (ID: `6748447282da917937f879c5`)

| Username   | Voting Dates           |
| ---------- | ---------------------- |
| brainkss   | 2025-01-05, 2025-01-09 |
| chris      | 2025-01-09             |
| josh       | 2025-01-09             |
| bvenceslas | 2025-01-05, 2025-01-09 |
| richard    | 2025-01-09             |

## Postman Collection

To test the API endpoints, you can use the provided Postman collection.

### Steps to Use the Postman Collection

1. Download the Postman collection file:
   - [Download Postman Collection](https://github.com/events-shuffle/Events-Shuffle.postman_collection.json)
2. Open Postman and import the collection:
   - Go to **File** > **Import** > **Upload Files** and select the downloaded JSON file.
3. Set up your environment variables:
   - Ensure the `baseUrl` variable is set to your API's base URL (e.g., `http://localhost:3000`).
   - The `Authorization` token will automatically be saved in the collection variables after logging in.

Once imported, you can test all API endpoints easily.

---

## Testing

To run the tests, use the following command:

```bash
   yarn test
```

**Test Coverage**:

- Unit tests for event services and controllers.
- Unit tests for user services and controllers.

---

## Design Choices

- Architecture: NestJS's default design (MVC).
- Dependency Injection: For modularity and testability.
- Data Validation: Leveraged `class-validator` for input validation.
- Versioning: Implemented `NestJS URI versioning` for API endpoints (e.g., /api/v1/...).

---

## Future Improvements

### Potential Improvements

1. **Voting Logic**:

- Separate votes into its own resource (e.g., `/votes` endpoint) to improve scalability for large datasets.

2. **Pagination for Event Listing**:

- Add query parameters like `?page` and `?limit` to /list for scalability.

3. **Improved Date Validation**:

- Enhance error handling for invalid dates or overlapping votes.

4. Filtering and Querying:

- Add query parameters for filtering events by name or date range.

---

## Closing Note

Thank you for taking the time to review my solution! I'm happy to discuss my implementation, design decisions, and any areas of potential improvement during the interview.

## Stay in touch

- Author - [Josh Venceslas Burongu](https://x.com/bvenceslas)
- GitHub - [bvenceslas](https://github.com/bvenceslas)
- Linkedin - [Venceslas Burongu](https://linkedin.com/in/venceslas-burongu)

## License

This project is UNLICENSED.
