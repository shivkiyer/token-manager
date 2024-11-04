# Token Manager

A full-stack web application for the purpose of simplifying the creation and management of blockchain utilities such as shared wallets, tokens, coins and NFTs. The primary goal of the app is to combine the convenience and functionality of a data driven web application with the transparency and permanency of the blockchain. The app has been built in Test Driven Development (TDD) mode with every feature rigorously tested with unit and integration tests.

### Tech stack
- React Typescript with React Material UI
- Node JS with Sequelize ORM and JWT for authentication
- PostgreSQL database
- Smart contracts written with Solidity, managed and tested with Foundry
- Unit and integration tests using Jest, React Testing Library and Forge

### Installation

- To setup the Node JS backend, in the root directory:  
  npm install
- To setup the React TS frontend, in the client directory:  
  npm install
- To setup Foundry, in the blockchain directory:  
  Follow the process [here](https://book.getfoundry.sh/getting-started/installation)

### Configuration

The app needs a PostgreSQL server. A simple way to create a PostgreSQL server is using Docker. Images for PostgreSQL servers can be downloaded from Docker Hub. A Docker bridge network on the host computer to which all docker containers are connected, ensures communication can be achieved through container names.   
The Node JS backend needs a .env file in the root directory:    
```
# Database configuration
# Development
DB_DEV_HOST=<url or docker container name>
DB_DEV_NAME=<dbname>
DB_DEV_USERNAME=<dbuser>
DB_DEV_PASSWORD=<dbpassword>
DB_DEV_PORT=<dbport>  # For Postgres, default is 5432

# Testing
DB_TEST_HOST=<url or docker container name>
DB_TEST_NAME=<dbname>
DB_TEST_USERNAME=<dbuser>
DB_TEST_PASSWORD=<dbpassword>
DB_TEST_PORT=<dbport>  # For Postgres, default is 5432

# Development server configuration
DEV_SERVER_PORT=<server_port>  # Default is usually 8000

# Authentication
PASSWORD_SALTING=<salt_number>  # Usually 15
JWT_SECRET=<secret_phrase>
SESSION_EXPIRY=<minutes>

# Blockchain
BLOCKCHAIN_BASE_DIR=blockchain
CONTRACT_FACTORY_NAME=TokenManagerFactory
DEV_BLOCKCHAIN_ID=<chain_id>  # If using anvil for hosting local blockchain, chaidId=31337, if using Sepolia, chainId=11155111.
```


## App tour and features

### Authentication
The app features a simple login page with fields for username (email) and password. Only authenticated users can access the dashboard. Authentication is performed using JSON Web Tokens (JWT) which being stateless does not need the creation of a separate database table.

![Screenshot from 2024-11-04 07-13-10](https://github.com/user-attachments/assets/3a4a08ff-466d-44e7-9721-47c4afcb9f05)


### Dashboard
The app dashboard follows a successful login and offers users an interactive UI for managing their crypto assets. Access to the dashboard also results in a request to access the Metamask account with the browser. To get started, users will need to add Metamask ETH accounts to the app. This is to make the management of wallets easier with usernames and account names rather than only ETH addresses.

![Screenshot from 2024-11-04 07-27-11](https://github.com/user-attachments/assets/26ef24b2-bc65-4c00-b0c3-4fa10fa6c28d)

Creating a new ETH account will merely require copying the ETH address of the account from Metamask to the form field in the CREATE tab. Moreover, the account will need to be connected to the frontend, and should not have been added before. Adding an ETH account will result in a new database record.

![Screenshot from 2024-11-04 07-29-53](https://github.com/user-attachments/assets/582465d4-b299-483b-917c-dec81c8ebf0a)

Once accounts have been added to the app, users can create and manage shared wallets.

![Screenshot from 2024-11-04 07-36-54](https://github.com/user-attachments/assets/4fbe7b6e-588c-485b-8e2c-ebb05d7a34a7)

To create a new wallet, the CREATE tab provides a simple form. A new database record is created with the details of the form after the wallet has been successfully deployed in the blockchain. Therefore, the transaction on the blockchain remains the ultimate source of truth, and the walltet contract address that is generated is stored in the local database along with additional details that make the management of these wallets easier. The user creating the shared wallet can choose which ETH account will be the owner of the wallet.

![Screenshot from 2024-11-04 07-41-06](https://github.com/user-attachments/assets/a4e0be30-80a8-4954-933a-4e1c40f45166)


