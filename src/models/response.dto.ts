// Base response interface
export interface BaseResponse {
	statusCode: number;
	message: string;
}

// Success responses
export class SuccessResponse implements BaseResponse {
	statusCode: number;
	message: string;

	constructor(message = "Operation successful", statusCode = 200) {
		this.statusCode = statusCode;
		this.message = message;
	}
}

export class DataResponse<T> extends SuccessResponse {
	data: T;

	constructor(data: T, message = "Operation successful", statusCode = 200) {
		super(message, statusCode);
		this.data = data;
	}
}

export class SearchResponse<T> extends DataResponse<T[]> {
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};

	constructor(
		data: T[],
		meta: {
			total: number;
			page: number;
			limit: number;
			totalPages: number;
		},
		message = "Data retrieved successfully",
		statusCode = 200
	) {
		super(data, message, 200);
		this.meta = meta;
		this.statusCode = 200; // Ensure status code is set to 200 OK
	}
}

export class CreatedResponse<T> extends DataResponse<T> {
	constructor(data: T, message = "Resource created successfully") {
		super(data, message, 201);
	}
}

export class LoginResponse extends SuccessResponse {
	access_token: string;

	constructor(accessToken: string, message = "Login successful") {
		super(message, 200);
		this.access_token = accessToken;
	}
}

// Paginated response for lists
export class PaginatedResponse<T> extends SuccessResponse {
	data: T[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};

	constructor(
		data: T[],
		total: number,
		page: number,
		limit: number,
		message = "Data retrieved successfully"
	) {
		super(message, 200);
		this.data = data;
		this.meta = {
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}
}

// Error responses
export class ErrorResponse implements BaseResponse {
	statusCode: number;
	message: string;
	error: string;
	userId?: string;

	constructor(
		message: string,
		error: string,
		statusCode = 500,
		userId?: string
	) {
		this.statusCode = statusCode;
		this.message = message;
		this.error = error;
		this.userId = userId;
	}
}

export class BadRequestResponse extends ErrorResponse {
	constructor(message = "Invalid input", error = "Bad Request") {
		super(message, error, 400);
	}
}

export class InvalidCredentialsResponse extends ErrorResponse {
	userId?: string;
	constructor(message = "Invalid credentials", error = "Unauthorized", userId) {
		super(message, error, 401);
		this.userId = userId;
		this.statusCode = 401; // Ensure status code is set to 401 Unauthorized
	}
}

export class UnauthorizedResponse extends ErrorResponse {
	constructor(message = "Unauthorized access", error = "Unauthorized") {
		super(message, error, 401);
	}
}

export class ForbiddenResponse extends ErrorResponse {
	constructor(message = "Access denied", error = "Forbidden") {
		super(message, error, 403);
	}
}

export class NotFoundResponse extends ErrorResponse {
	constructor(message = "Resource not found", error = "Not Found") {
		super(message, error, 404);
	}
}

export class ConflictResponse extends ErrorResponse {
	constructor(message = "Resource already exists", error = "Conflict") {
		super(message, error, 409);
	}
}
