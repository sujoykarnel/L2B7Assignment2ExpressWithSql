import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import sendResponse from "../../utility/sendResponse";

const createIssue = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const result = await issueService.createIssueIntoDB(req.body, user.id);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const query = req.query;
    // console.log(query);
    const result = await issueService.getAllIssuesFromDB(query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
};
