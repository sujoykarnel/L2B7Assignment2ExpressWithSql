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

export const issueService = {
  createIssueIntoDB,
};
