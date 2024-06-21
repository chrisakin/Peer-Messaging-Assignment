
### Steps to Start Messaging Backend Project

#### 1. Clone the GitHub Repository

Open your terminal and navigate to the directory where you want to clone your project:

```bash
# Clone your GitHub repository
git clone <repository-url>
```

Replace `<repository-url>` with the URL of your GitHub repository.

#### 2. Navigate to Your Project Directory

```bash
cd <your-project-directory>
```

Replace `<your-project-directory>` with the name of the directory where your project was cloned.

#### 3. Install Dependencies

Once you're inside your project directory, install the necessary dependencies:

```bash
npm install
```

This command installs all dependencies listed in the `package.json` file.

#### 4. Set Up Environment Variables (if applicable)

This Node.js project requires environment variables (e.g., database connection strings, API keys), create a `.env` file in the root of your project and define them there. Example:

PORT=3000
MONGODB_URI=mongodb://localhost:27017/p2p_chat_app //You would need to install MongoDB Compass on your local system to access this database
JWT_SECRET=USE A SECRET


#### 5. Start the Application

After installing dependencies and setting up environment variables (if needed), start your Node.js application. Typically, this involves running a command specified in your `package.json`.

For example, if your `package.json` has a `"start"` script:

```bash
npm run dev
```

This command will execute the start script defined in your `package.json`, which might start your Node.js server using a command like `node app.js` or `nodemon server.js` (depending on your setup).
