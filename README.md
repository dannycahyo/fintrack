# Fintrack

Fintrack is a financial tracker application designed to help users manage their finances efficiently. This project leverages modern web technologies to provide a seamless and responsive user experience.

## Features

- Track income and expenses
- Categorize financial transactions
- Generate financial reports
- Visualize financial data with charts and graphs

## Tech Stack

- **Backend**: [Bun](https://bun.sh), [Hono](https://hono.dev)
- **Frontend**: Not specified (assumed to be integrated with the backend)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your machine

### Installation

To install the project dependencies, run:

```sh
bun install
```

### Running the Project

To start the development server, run:

```sh
bun run dev
```

### Running the Tests

To run the tests, run:

```sh
bun test
```

Open your browser and navigate to `http://localhost:3000`.

## REST API Specification

| Endpoint            | HTTP     | Description              |
| ------------------- | -------- | ------------------------ |
| `/transactions`     | `GET`    | Get all transactions     |
| `/transactions/:id` | `GET`    | Get transaction by id    |
| `/transactions`     | `POST`   | Add new transaction      |
| `/transactions/:id` | `PATCH`  | Update transaction by id |
| `/transactions/:id` | `DELETE` | Delete transaction by id |
| `/categories`       | `GET`    | Get all categories       |
| `/categories/:id`   | `GET`    | Get category by id       |
| `/categories`       | `POST`   | Add new category         |
| `/categories/:id`   | `PATCH`  | Update category by id    |
| `/categories/:id`   | `DELETE` | Delete category by id    |

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.
