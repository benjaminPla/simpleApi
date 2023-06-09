import express, { Request, Response } from "express";
import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const server = express();
server.use(express.json());

interface IUser {
  _id: ObjectId;
  name: string;
  age: number;
}

interface INewUser {
  name: string;
  age: number;
}

interface IResponseSuccess {
  status: string;
  message: string;
  details?: INewUser | never[];
}

(async () => {
  try {
    let client: MongoClient;
    const connString: string | undefined = process.env.MONGO_URL;
    if (connString) {
      client = await MongoClient.connect(connString);
    } else {
      console.log("MongoDB connection string not found.");
      process.exit(1);
    }

    const db: Db = client.db("test");
    const collection: Collection<IUser> = db.collection("test");

    console.log("Successfully connected to MongoDB");

    server.get("/get", async (req: Request, res: Response) => {
      console.log("received GET request");
      try {
        const users: IUser[] = await collection.find({}).toArray();
        res.send(users);
      } catch (error) {
        res.status(500).send(`there was an error: ${error}`);
      }
    });

    server.post("/post", async (req: Request, res: Response) => {
      try {
        const { name, age }: INewUser = req.body;
        console.log(`received POST request: ${JSON.stringify({ name, age })}`);

        const newUser: IUser = { _id: new ObjectId(), name, age };
        await collection.insertOne(newUser);

        const response: IResponseSuccess = {
          status: "200",
          message: "successfully created user",
          details: newUser,
        };
        res.send(response);
      } catch (error) {
        res.status(500).send(`there was an error: ${error}`);
      }
    });

    server.delete("/delete/:id", async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        console.log(`received DELETE request: ${JSON.stringify({ id })}`);

        await collection.deleteOne({ _id: new ObjectId(id) });

        const response: IResponseSuccess = {
          status: "200",
          message: "successfully deleted user",
          details: [],
        };
        res.send(response);
      } catch (error) {
        res.status(500).send(`there was an error: ${error}`);
      }
    });

    server.put("/put/:id", async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { name, age }: INewUser = req.body;
        console.log(`received PUT request: ${JSON.stringify({ id, name, age })}`);

        const filter = { _id: new ObjectId(id) };

        const updateObject: Partial<IUser> = {};

        if (name) {
          updateObject.name = name;
        }

        if (age) {
          updateObject.age = age;
        }

        await collection.updateOne(filter, { $set: updateObject });

        const response: IResponseSuccess = {
          status: "200",
          message: "successfully updated user",
          details: [],
        };
        res.send(response);
      } catch (error) {
        res.status(500).send(`there was an error: ${error}`);
      }
    });

    server.listen(3000, () => console.log("Server running on port 3000"));
  } catch (error) {
    console.log(`there was an error: ${error}`);
  }
})();
