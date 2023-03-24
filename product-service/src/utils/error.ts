export class ErrorResponse extends Error {
    statusCode: number;
    body: string;
    headers: { 'Content-Type': string; };
    constructor(   
        message = 'Server Issues. Check CloudWatch, please',
        statusCode = 500,
    ) {
        super();
        const body = JSON.stringify({ message });
        this.statusCode = statusCode;
        this.body = body;
        this.headers = {
            'Content-Type': 'application/json',
        };
    }
  }