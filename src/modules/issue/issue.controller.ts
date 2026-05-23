import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import sendResponse from "../../utility/sendResponse";
import type { JwtPayload } from "jsonwebtoken";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.createIssueIntoDB(
      req.body,
      req.user as JwtPayload,
    );

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

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issueService.getSingleIssueFromDB(id as string);
    // console.log(result);

    if (result.rows.length === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: `Issue not found!`,
      });
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: result.rows[0],
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

const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await issueService.updateIssueFromDB(
      req.body,
      id as string,
      req.user as JwtPayload,
    );

    if (result.rows.length === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: `Issue not found!`,
      });
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0],
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

const updateIssueStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const result = await issueService.updateIssueStatusFromDB(
      status,
      id as string,
    );

    if (result.rows.length === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: `Issue not found!`,
      });
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue status updated successfully",
      data: result.rows[0],
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

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issueService.deleteIssueFromDB(id as string);

    if (result.rowCount === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: `Issue not found!`,
      });
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
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
  getSingleIssue,
  updateIssue,
  updateIssueStatus,
  deleteIssue,
};
