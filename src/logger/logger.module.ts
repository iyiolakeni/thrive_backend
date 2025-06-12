// src/logger/logger.module.ts
import { Module } from "@nestjs/common";
import {
	WinstonModule,
	utilities as nestWinstonModuleUtilities,
} from "nest-winston";
import * as winston from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
	imports: [
		WinstonModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const isProduction = configService.get("NODE_ENV") === "production";

				console.log(
					"LoggerModule is running in",
					isProduction ? "production" : "development",
					"mode"
				);

				// Base transports - always use console
				const transports: winston.transport[] = [
					new winston.transports.Console({
						format: winston.format.combine(
							winston.format.timestamp(),
							nestWinstonModuleUtilities.format.nestLike("Thrive", {
								colors: !isProduction,
								prettyPrint: !isProduction,
							})
						),
					}),
				];

				// Add file transport in production
				if (isProduction) {
					transports.push(
						new DailyRotateFile({
							dirname: "logs",
							filename: "application-%DATE%.log",
							datePattern: "YYYY-MM-DD",
							zippedArchive: true,
							maxSize: "20m",
							maxFiles: "14d",
							format: winston.format.combine(
								winston.format.timestamp(),
								winston.format.json()
							),
							level: "info",
						}),
						// Separate file for errors
						new DailyRotateFile({
							dirname: "logs",
							filename: "error-%DATE%.log",
							datePattern: "YYYY-MM-DD",
							zippedArchive: true,
							maxSize: "20m",
							maxFiles: "14d",
							format: winston.format.combine(
								winston.format.timestamp(),
								winston.format.json()
							),
							level: "error",
						})
					);
				}

				return {
					transports,
					// Optional: customize log levels
					levels: winston.config.npm.levels,
					level: isProduction ? "info" : "debug",
					// Handle uncaught exceptions
					exceptionHandlers: [
						new winston.transports.Console(),
						...(!isProduction
							? []
							: [
									new winston.transports.File({
										filename: "logs/exceptions.log",
									}),
							  ]),
					],
					exitOnError: false,
				};
			},
		}),
	],
	exports: [WinstonModule],
})
export class LoggerModule {}
