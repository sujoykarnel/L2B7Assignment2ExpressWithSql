import { pool } from "../../db";
import type { IssueQuery } from "../../types";
import type { IIssue } from "./issue.interface";

const createIssueIntoDB = async (payload: IIssue, id: number) => {
  const { title, description, type } = payload;

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

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
};
