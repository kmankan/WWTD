import { createUser } from "./queries";

const user = await createUser("John");
console.log("User created: ", user);
