import fs from "fs";
import util from "util";
import { pipeline } from "stream";
import csv from "csvtojson";
import Users from "../../db/models/users.model";
import TeamMemberEmailsTeams from "../../db/models/linkMembersTeams.model.js";

// Use fastify-multipart to parse file
// According to fastify-multipart documentation, one can use just 
// data = await req.file()
// data.file being the stream of the file.

// Assuming that data.file is now readable stream
// Use csvToJson to read the stream and convert to JSON format:
