import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../../db";
import type { IssueQuery } from "../../types";
import type { TIssue } from "./issue.interface";

const createIssueIntoDB = async (payload: TIssue, user: JwtPayload) => {
  const { title, description, type } = payload;
  const { id } = user;

  // create new issue
  const result = await pool.query(
    `
        INSERT INTO issues (title, description, type, status, reporter_id)
        VALUES ($1, $2, $3, 'open', $4)
        RETURNING *
        `,
    [title, description, type, id],
  );

  return result.rows[0];
};

const getAllIssuesFromDB = async (query: IssueQuery) => {
  const { sort = "newest", type, status } = query;

  //   console.log(sort, type, status);
  let sqlQuery = `SELECT * FROM issues WHERE 1=1`;
  const values: any[] = [];
  if (type) {
    values.push(type);
    sqlQuery += ` AND type = $${values.length}`;
  }

  if (status) {
    values.push(status);
    sqlQuery += ` AND status = $${values.length}`;
  }

  sqlQuery += ` ORDER BY created_at ${sort === "oldest" ? "ASC" : "DESC"}`;

  const issueResult = await pool.query(sqlQuery, values);
  const issues = issueResult.rows;
  for (const issue of issues) {
    const reporter = (
      await pool.query(
        `
              SELECT id, name, role FROM users
              WHERE id = $1
              `,
        [issue.reporter_id],
      )
    ).rows[0];
    issue.reporter = reporter;
    delete issue.reporter_id;
  }
  return issues;
};

const getSingleIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `
        SELECT * FROM issues
        WHERE id = $1
        `,
    [id],
  );

  if (result.rows[0]) {
    const reporter = (
      await pool.query(
        `
              SELECT id, name, role FROM users
              WHERE id = $1
              `,
        [result.rows[0].reporter_id],
      )
    ).rows[0];
    result.rows[0].reporter = reporter;
    delete result.rows[0].reporter_id;
  }

  return result;
};

const updateIssueFromDB = async (
  payload: TIssue,
  id: string,
  user: JwtPayload,
) => {
  const { title, description, type } = payload;

  const issueResult = await pool.query(
    `
        SELECT * FROM issues
        WHERE id= $1
        `,
    [id],
  );

  const issue = issueResult.rows[0];

  //   console.log("issue servece", issue);

  if (issue && user.role === "contributor") {
    // check issue
    if (issue.reporter_id !== user.id) {
      throw new Error("Unauthorized!");
    }

    // only open issue
    if (issue.status !== "open") {
      throw new Error("Contributor can only update open issues");
    }
  }

  const result = await pool.query(
    `
          UPDATE issues
          SET
              title = COALESCE($1, title),
              description= COALESCE($2, description),
              type= COALESCE($3, type),
              updated_at = CURRENT_TIMESTAMP
          WHERE id= $4
          RETURNING *
          `,
    [title, description, type, id],
  );
  // console.log(result)
  return result;
};

const updateIssueStatusFromDB = async (status: string, id: string) => {
  const result = await pool.query(
    `
        UPDATE issues
        SET
            status = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
        `,
    [status, id],
  );

  return result;
};

const deleteIssueFromDB = async (id: string) => {
//   console.log(id);
  const result = await pool.query(
    `
        DELETE FROM issues
        WHERE id = $1
        `,
    [id],
  );

  return result;
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueFromDB,
  updateIssueStatusFromDB,
  deleteIssueFromDB,
};
