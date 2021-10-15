type LoggerParams = {
  error?: Error;
  type?: "error" | "info";
  message?: string;
};

/**
 * Logger helps track errors and messages and sends them to sentry
 */
export const logger = ({
  error,
  type = "info",
  message,
}: LoggerParams): void => {
  if (error) {
    console.error(error);
  } else if (type === "error") {
    console.error(message);
  } else if (message) {
    console.log(message);
  }
};

/**
 * Just simle log
 */
export const log = (message): void => {
  logger({ message, type: "info" });
};
