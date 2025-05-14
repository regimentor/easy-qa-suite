import "reflect-metadata";
import dotenv from "dotenv";
import { main } from "./src/main";

dotenv.config();

main().then(() => console.log(`Application started 🚀`));
