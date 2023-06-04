"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const server = (0, express_1.default)();
server.use(express_1.default.json());
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let client;
        const connString = process.env.MONGO_URL;
        if (connString) {
            client = yield mongodb_1.MongoClient.connect(connString);
        }
        else {
            console.log("MongoDB connection string not found.");
            process.exit(1);
        }
        const db = client.db("test");
        const collection = db.collection("test");
        console.log("Successfully connected to MongoDB");
        server.get("/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("received GET request");
            try {
                const users = yield collection.find({}).toArray();
                res.send(users);
            }
            catch (error) {
                res.status(500).send(`there was an error: ${error}`);
            }
        }));
        server.post("/post", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { name, age } = req.body;
                console.log(`received POST request: ${JSON.stringify({ name, age })}`);
                const newUser = { _id: new mongodb_1.ObjectId(), name, age };
                yield collection.insertOne(newUser);
                const response = {
                    status: "200",
                    message: "successfully created user",
                    details: newUser,
                };
                res.send(response);
            }
            catch (error) {
                res.status(500).send(`there was an error: ${error}`);
            }
        }));
        server.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log(`received DELETE request: ${JSON.stringify({ id })}`);
                yield collection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                const response = {
                    status: "200",
                    message: "successfully deleted user",
                    details: [],
                };
                res.send(response);
            }
            catch (error) {
                res.status(500).send(`there was an error: ${error}`);
            }
        }));
        server.put("/put/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, age } = req.body;
                console.log(`received PUT request: ${JSON.stringify({ id, name, age })}`);
                const filter = { _id: new mongodb_1.ObjectId(id) };
                const updateObject = {};
                if (name) {
                    updateObject.name = name;
                }
                if (age) {
                    updateObject.age = age;
                }
                yield collection.updateOne(filter, { $set: updateObject });
                const response = {
                    status: "200",
                    message: "successfully updated user",
                    details: [],
                };
                res.send(response);
            }
            catch (error) {
                res.status(500).send(`there was an error: ${error}`);
            }
        }));
        server.listen(3000, () => console.log("Server running on port 3000"));
    }
    catch (error) {
        console.log(`there was an error: ${error}`);
    }
}))();
