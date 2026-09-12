# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:
```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: updating an existing book
Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

Swagger Documentation
Swagger must document every book route.

Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at /api-docs must allow someone to test every book route from the browser.

Feature 2: Author CRUD Operations
Goal
Implement full CRUD operations for author resources. Author documents will store author details and serve as referenced targets for books. Every author route must be documented and testable in Swagger.

### Data model
Author documents will be stored in the "author" collection.

Required author fields:
-Id: String required, custom id such as a1
-name string, required
-Birthyear: number, required
-Nationality: string, required
Authors will use custom string ids (e.g., a1, a2) instead of MongoDB _id values for route parameters.
### Relationship to books
An author can be referenced by multiple books via the book's authorId field.

To maintain referential integrity, when attempting to delete an author using DELETE /authors/:id, the API must check if any book document currently references that author's id:

If one or more books reference the author, the deletion request must be rejected with a 400 status code and an appropriate error message indicating that the author cannot be deleted while linked to existing books.

If no books reference the author, the deletion should proceed and return a 204 status code.

Routes
GET /authors
Purpose: Return all authors.

Success:

Status code: 200

Response body: an array of author objects

Errors:

500 if an unexpected server or database error occurs

GET /authors/:id
Purpose: Return one author by their custom id.

Success:

Status code: 200

Response body: the matching author object

Errors:

404 if no author exists with that id

500 if an unexpected server or database error occurs

POST /authors
Purpose: Create a new author.

Request body:

{
  "id": "a3",
  "name": "Gabriel García Márquez",
  "birthYear": 1927,
  "nationality": "Colombian"
}
Success:

Status code: 201

Response body: the newly created author object

Errors:

400 if a required field is missing

400 if the id already exists

500 if an unexpected server or database error occurs

PUT /authors/:id
Purpose: Update an existing author.

Request body:

JSON
{
  "name": "Gabriel García Márquez",
  "birthYear": 1927,
  "nationality": "Colombian"
}
Success:

Status code: 200

Response body: the updated author object

Errors:

400 if a required field is missing

404 if no author exists with that id

500 if an unexpected server or database error occurs

DELETE /authors/:id
Purpose: Delete an existing author.

Success:

Status code: 204

Response body: none

Errors:

400 if the author still has books referencing their id

404 if no author exists with that id

500 if an unexpected server or database error occurs

Swagger Documentation
Swagger must document every author route, including request body schemas, parameters, success responses, and failure response codes (400, 404, 500).

Deployment Expectations
After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at /api-docs must allow someone to test every author route directly from the browser.



# Books API Week 02 Spec - Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model & Validation
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom string id (e.g., `b1`). **Immutable** (cannot be altered after creation).
- `authorId`: string, required, references the `id` field of an author document.
- `title`: string, required, non-empty string.
- `publicationDate`: string, required, must follow ISO 8601 calendar date format (`YYYY-MM-DD`).

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating (`POST`) or updating (`PUT`) a book, the controller must perform a lookup against the `authors` collection:
- If no author document exists with `id === authorId`, the request must be rejected with status `400 Bad Request`.

### Routes & Implementation Checklist

#### GET /books
- [ ] Query the `books` collection for all documents.
- [ ] **Success Status:** `200 OK`
- [ ] **Success Body:** Array of book objects `[ { "id": "b1", "authorId": "a1", "title": "Example", "publicationDate": "2026-01-15" } ]`.
- [ ] **Error Status:** `500 Internal Server Error` with body `{ "message": "Internal server error" }` on unhandled database exceptions.

#### GET /books/:id
- [ ] Extract `id` parameter from request path.
- [ ] Query `books` collection for a document matching `{ id: req.params.id }`.
- [ ] **Success Status:** `200 OK` with the matching book object.
- [ ] **Error Statuses:**
  - `404 Not Found` with `{ "message": "Book not found" }` if no record exists.
  - `500 Internal Server Error` with `{ "message": "Internal server error" }` on server failure.

#### POST /books
- [ ] Validate presence and non-empty status of required fields: `id`, `authorId`, `title`, `publicationDate`.
- [ ] Validate `publicationDate` format (`YYYY-MM-DD`).
- [ ] Check if `id` already exists in `books` collection.
- [ ] Verify that `authorId` exists in `authors` collection.
- [ ] **Request Body Example:**
  ```json
  {
    "id": "b4",
    "authorId": "a1",
    "title": "Example Book Title",
    "publicationDate": "2026-01-15"
  }

  [ ] Success Status: 201 Created with the newly created book object.

[ ] Error Statuses:

400 Bad Request with structured error messages:

Missing required fields: { "message": "Missing required fields: id, authorId, title, publicationDate" }

Duplicate ID: { "message": "Book with id 'b4' already exists" }

Invalid Date: { "message": "publicationDate must follow YYYY-MM-DD format" }

Non-existent Author: { "message": "Referenced authorId 'a1' does not exist" }

500 Internal Server Error with { "message": "Internal server error" }.

PUT /books/:id
[ ] Extract id parameter from route path.

[ ] Ignore or reject any attempt to modify the resource id within the request body (keep original id).

[ ] Validate presence and types of authorId, title, and publicationDate.

[ ] Verify that authorId exists in authors collection.

[ ] Check if book document with given path id exists in books collection.

[ ] Request Body Example:

JSON
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
[ ] Success Status: 200 OK with updated book object.

[ ] Error Statuses:

400 Bad Request if missing required fields, invalid date format, or invalid authorId.

404 Not Found with { "message": "Book not found" } if target book ID does not exist.

500 Internal Server Error with { "message": "Internal server error" }.

DELETE /books/:id
[ ] Check if book document exists in books collection.

[ ] Delete matching document from books collection.

[ ] Success Status: 204 No Content with an empty response body.

[ ] Error Statuses:

404 Not Found with { "message": "Book not found" }.

500 Internal Server Error with { "message": "Internal server error" }.

Feature 2: Author CRUD Operations
Goal
Implement full CRUD operations for author resources. Author documents will store author details and serve as referenced targets for books. Every author route must be documented and testable in Swagger.

Data Model & Validation
Author documents will be stored in the authors collection.

Required author fields:

id: string, required, custom string id (e.g., a1). Immutable.

name: string, required, non-empty string.

birthYear: number, required, integer between 0 and current year (2026).

nationality: string, required, non-empty string.

Authors will use custom string ids (e.g., a1, a2) instead of MongoDB _id values for route parameters.

Relationship to Books and Referential Integrity Restrictions
An author can be referenced by multiple books via the book's authorId field.

When deleting an author (DELETE /authors/:id):

Perform a count query on books collection: books.countDocuments({ authorId: req.params.id }).

If count > 0, reject request with 400 Bad Request.

Routes & Implementation Checklist
GET /authors
[ ] Query authors collection for all documents.

[ ] Success Status: 200 OK

[ ] Success Body: Array of author objects [ { "id": "a1", "name": "Author Name", "birthYear": 1980, "nationality": "Mexican" } ].

[ ] Error Status: 500 Internal Server Error with { "message": "Internal server error" }.

GET /authors/:id
[ ] Extract id from path parameter.

[ ] Query authors collection for document with { id: req.params.id }.

[ ] Success Status: 200 OK with author object.

[ ] Error Statuses:

404 Not Found with { "message": "Author not found" }.

500 Internal Server Error with { "message": "Internal server error" }.

POST /authors
[ ] Validate presence of required fields: id, name, birthYear, nationality.
[ ] Validate birthYear is a valid integer $\le 2026$.
[ ] Check if id already exists in authors collection.
[ ] Request Body Example:

{
  "id": "a3",
  "name": "Gabriel García Márquez",
  "birthYear": 1927,
  "nationality": "Colombian"
}

[ ] Success Status: 201 Created with newly created author object.

[ ] Error Statuses:

400 Bad Request with specific messages:

Missing fields: { "message": "Missing required fields: id, name, birthYear, nationality" }

Duplicate ID: { "message": "Author with id 'a3' already exists" }

Invalid birthYear: { "message": "birthYear must be a valid integer less than or equal to 2026" }

500 Internal Server Error with { "message": "Internal server error" }.

PUT /authors/:id
[ ] Extract id from route path parameter.

[ ] Ensure request body id modification attempts are ignored/prevented.

[ ] Validate presence and data types of name, birthYear, and nationality.

[ ] Verify target author exists in authors collection.

[ ] Request Body Example:

JSON
{
  "name": "Gabriel García Márquez",
  "birthYear": 1927,
  "nationality": "Colombian"
}
[ ] Success Status: 200 OK with updated author object.

[ ] Error Statuses:

400 Bad Request if payload validation fails.

404 Not Found with { "message": "Author not found" }.

500 Internal Server Error with { "message": "Internal server error" }.

DELETE /authors/:id
[ ] Check if target author exists in authors collection.

[ ] Perform lookup check in books collection for referencing records ({ authorId: req.params.id }).

[ ] Delete author if no referencing books exist.

[ ] Success Status: 204 No Content with empty body.

[ ] Error Statuses:

400 Bad Request with { "message": "Cannot delete author linked to existing books. Remove or reassign books first." }

404 Not Found with { "message": "Author not found" }.

500 Internal Server Error with { "message": "Internal server error" }.

Database Performance & Swagger Requirements
Indexing Recommendations
Create a unique index on authors.id and books.id.

Create a secondary index on books.authorId to optimize foreign-key lookups during POST /books, PUT /books, and DELETE /authors/:id.

OpenAPI / Swagger Standards
Every route above must have an accompanying @openapi annotation in src/router.js (or separate route files).

Interactive testing must pass in Swagger UI (/api-docs) both locally and on Render.