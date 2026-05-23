import { pool } from "../../db";
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

const getAllIssuesFromDB = async () => {
  const issueResult = await pool.query(`
        SELECT * FROM issues
        `);

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
