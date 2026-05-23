

        import { createRequire } from 'module';

        const require = createRequire(import.meta.url);

        

// src/app.ts
import express from "express";
import cors from "cors";

// src/modules/users/users.route.ts
import { Router } from "express";

// src/db/index.ts
import { Pool } from "pg";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env")
});
var config = {
  port: process.env.PORT,
  connectString: process.env.CONNECTION_STRING,
  jwtSecret: process.env.JWT_SECRET
};
var config_default = config;

// src/db/index.ts
var pool = new Pool({
  connectionString: config_default.connectString
});
var initDB = async () => {
  try {
    await pool.query(`
                CREATE TABLE IF NOT EXISTS users(
                 id SERIAL PRIMARY KEY,
                 name VARCHAR(20),
                 email VARCHAR(30) UNIQUE NOT NULL,
                 password TEXT NOT NULL,
                 role VARCHAR(20) DEFAULT 'contributor',
                 created_at TIMESTAMP DEFAULT NOW(),
                 updated_at TIMESTAMP DEFAULT NOW()
                )
            `);
    await pool.query(`
            CREATE TABLE IF NOT EXISTS issues (
                id SERIAL PRIMARY KEY,

                title VARCHAR(150) NOT NULL,

                description TEXT NOT NULL CHECK (length(description) >= 20),

                type TEXT CHECK (type IN ('bug', 'feature_request')) DEFAULT 'bug',

                status TEXT CHECK (
                status IN ('open', 'resolved', 'in_progress')
                ) DEFAULT 'open',

                reporter_id INTEGER NOT NULL,

                created_at TIMESTAMP DEFAULT NOW(),

                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
  } catch (error) {
    console.log(error, "from db");
  }
};

// src/modules/users/users.service.ts
import bcrypt from "bcrypt";
var usersCreateIntoDB = async (payLoad) => {
  const { name, email, password, role } = payLoad;
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
            INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, COALESCE($4, 'contributor')) RETURNING *
        `,
    [name, email, hashPassword, role]
  );
  delete result.rows[0].password;
  return result;
};
var usersService = {
  usersCreateIntoDB
};

// src/utility/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    error: data.error
  });
};
var sendResponse_default = sendResponse;

// src/modules/users/users.controller.ts
var createUsers = async (req, res) => {
  try {
    const result = await usersService.usersCreateIntoDB(req.body);
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var usersController = {
  createUsers
};

// src/modules/users/users.route.ts
var route = Router();
route.post("/signup", usersController.createUsers);
var userRoute = route;

// src/modules/auth/auth.route.ts
import { Router as Router2 } from "express";

// src/utility/genaretJwtToken.ts
import jwt from "jsonwebtoken";
var generateJwtToken = (payload, singneture, expire) => {
  const token = jwt.sign(payload, singneture, { expiresIn: expire });
  return token;
};
var genaretJwtToken_default = generateJwtToken;

// src/modules/auth/auth.service.ts
import bcrypt2 from "bcrypt";
import "jsonwebtoken";
var authFromDb = async (payload) => {
  const { email, password } = payload;
  const findUser = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email]
  );
  if (findUser.rows.length === 0) {
    throw new Error("Invalid Credentials");
  }
  const user = findUser.rows[0];
  const checkPassword = await bcrypt2.compare(password, user.password);
  if (!checkPassword) {
    throw new Error("Invalid credentials");
  }
  delete user.password;
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  if (!config_default.jwtSecret) {
    throw new Error("JWT Secret is missing");
  }
  const accessToken = genaretJwtToken_default(jwtPayload, config_default.jwtSecret, "1d");
  const userData = {
    token: accessToken,
    user
  };
  return userData;
};
var authService = {
  authFromDb
};

// src/modules/auth/auth.controller.ts
var signInUser = async (req, res) => {
  try {
    const result = await authService.authFromDb(req.body);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var authController = {
  signInUser
};

// src/modules/auth/auth.route.ts
var route2 = Router2();
route2.post("/login", authController.signInUser);
var authRouter = route2;

// src/modules/issues/issues.route.ts
import { Router as Router3 } from "express";

// src/modules/issues/issues.service.ts
var createIssueIntoDB = async (payload) => {
  const { title, description, type, data } = payload;
  const result = await pool.query(`
            INSERT INTO issues(title, description, type, reporter_id) VALUES($1, $2, $3, $4) RETURNING *
        `, [title, description, type, data.id]);
  return result;
};
var getAllIssuesFromDB = async (payload) => {
  let sort = "DESC";
  if (payload.sort === "oldest") {
    sort = "ASC";
  }
  let query = `
            SELECT * FROM issues
        `;
  const conditions = [];
  if (payload.type) {
    conditions.push(`type = '${payload.type}'`);
  }
  if (payload.status) {
    conditions.push(`status = '${payload.status}'`);
  }
  if (conditions.length > 0) {
    query = query + `WHERE ${conditions.join(" AND ")}`;
  }
  query = query + ` ORDER BY created_at ${sort}`;
  const searchData = await pool.query(query);
  const datas = searchData.rows;
  const findDataReporter = await Promise.all(
    datas.map(async (data) => {
      const reporter = await pool.query(`
                SELECT * FROM users WHERE id=$1 
                `, [data.reporter_id]);
      delete data.reporter_id;
      const reporterData = reporter.rows[0];
      return {
        ...data,
        reporter: {
          id: reporterData.id,
          name: reporterData.name,
          role: reporterData.role
        }
      };
    })
  );
  return findDataReporter;
};
var getSingleIssue = async (paylad) => {
  const id = paylad;
  const result = await pool.query(`
            SELECT * FROM issues WHERE id=$1
        `, [id]);
  const reporterId = result.rows[0].reporter_id;
  const reporter = await pool.query(`
                SELECT * FROM users WHERE id=$1
            `, [reporterId]);
  delete result.rows[0].reporter_id;
  return {
    ...result.rows[0],
    reporter: {
      id: reporter.rows[0].id,
      name: reporter.rows[0].name,
      role: reporter.rows[0].role
    }
  };
};
var updateIssue = async (payload, id, updateData) => {
  const decodedUser = payload;
  const issueId = id;
  const data = updateData;
  const findUser = await pool.query(`
            SELECT * FROM users WHERE email = $1
        `, [decodedUser.email]);
  const user = findUser.rows[0];
  if (!user) {
    throw new Error("user not found");
  }
  const findIssue = await pool.query(`
            SELECT * FROM issues WHERE id=$1
        `, [issueId]);
  const issue = findIssue.rows[0];
  if (!issue) {
    throw new Error("Issue not found");
  }
  if (user.id === issue.reporter_id && issue.status === "open" || user.role === "maintainer") {
    const result = await pool.query(`
                    UPDATE issues
                    SET
                    title=COALESCE($1, title),
                    description=COALESCE($2, description),
                    type=COALESCE($3, type),
                    updated_at = NOW()

                    WHERE id=$4 RETURNING *
                `, [data.title, data.description, data.type, issueId]);
    return result;
  } else {
    throw new Error("Unauthorized user");
  }
};
var deleteIssueFromDB = async (id) => {
  const result = await pool.query(`
             DELETE FROM issues
             WHERE id = $1
        `, [id]);
  return result;
};
var issuesService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssue,
  updateIssue,
  deleteIssueFromDB
};

// src/modules/issues/issues.controller.ts
var createIssues = async (req, res) => {
  try {
    const data = req.user;
    const result = await issuesService.createIssueIntoDB({ ...req.body, data });
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "Issue create successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var getAllIssues = async (req, res) => {
  try {
    const data = req.query;
    const result = await issuesService.getAllIssuesFromDB(data);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrived successfully",
      data: result
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var getIssuesById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await issuesService.getSingleIssue(id);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      data: result
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var updateIssuesById = async (req, res) => {
  try {
    const decoded = req.user;
    const { id } = req.params;
    const updateData = req.body;
    const result = await issuesService.updateIssue(decoded, id, updateData);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var deleteIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await issuesService.deleteIssueFromDB(id);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issue Deleted successfully",
      data: result
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var issuesController = {
  createIssues,
  getAllIssues,
  getIssuesById,
  updateIssuesById,
  deleteIssueById
};

// src/middleware/auth.ts
import jwt3 from "jsonwebtoken";
var authVerify = (...roles) => async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      sendResponse_default(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized access"
      });
    }
    const decoded = jwt3.verify(
      token,
      config_default.jwtSecret
    );
    if (!roles.includes(decoded.role)) {
      sendResponse_default(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized access"
      });
    }
    const userData = await pool.query(
      `
     SELECT * FROM users WHERE email=$1   
        `,
      [decoded.email]
    );
    if (userData.rows.length === 0) {
      sendResponse_default(res, {
        statusCode: 404,
        success: false,
        message: "User not found"
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

// src/modules/issues/issues.route.ts
var route3 = Router3();
route3.post("/", authVerify("contributor", "maintainer"), issuesController.createIssues);
route3.get("/", issuesController.getAllIssues);
route3.get("/:id", issuesController.getIssuesById);
route3.patch("/:id", authVerify("contributor", "maintainer"), issuesController.updateIssuesById);
route3.delete("/:id", authVerify("maintainer"), issuesController.deleteIssueById);
var issuesRoute = route3;

// src/middleware/globalError.ts
var globalError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: err,
    forTest: "sazzad"
  });
};
var globalError_default = globalError;

// src/app.ts
var app = express();
app.use(cors());
app.use(express.json());
app.get("/", async (req, res) => {
  res.send("assignment 2 server");
});
app.use("/api/auth", userRoute);
app.use("/api/auth", authRouter);
app.use("/api/issues", issuesRoute);
app.use(globalError_default);
var app_default = app;

// src/server.ts
var port = config_default.port;
var main = () => {
  initDB();
  app_default.listen(port, () => {
    console.log(`server runing on port : ${port}`);
  });
};
main();
//# sourceMappingURL=server.js.map