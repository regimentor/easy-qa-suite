import type { PrismaClient } from "@prisma/client";

export async function usersSeed(client: PrismaClient) {
  // Array of 20 realistic user data
  const users = [
    { firstName: "John", lastName: "Smith", username: "jsmith" },
    { firstName: "Emma", lastName: "Johnson", username: "ejohnson" },
    { firstName: "Michael", lastName: "Williams", username: "mwilliams" },
    { firstName: "Sophia", lastName: "Brown", username: "sbrown" },
    { firstName: "William", lastName: "Jones", username: "wjones" },
    { firstName: "Olivia", lastName: "Garcia", username: "ogarcia" },
    { firstName: "James", lastName: "Miller", username: "jmiller" },
    { firstName: "Ava", lastName: "Davis", username: "adavis" },
    { firstName: "Alexander", lastName: "Rodriguez", username: "arodriguez" },
    { firstName: "Charlotte", lastName: "Martinez", username: "cmartinez" },
    { firstName: "Benjamin", lastName: "Hernandez", username: "bhernandez" },
    { firstName: "Mia", lastName: "Lopez", username: "mlopez" },
    { firstName: "Ethan", lastName: "Gonzalez", username: "egonzalez" },
    { firstName: "Amelia", lastName: "Wilson", username: "awilson" },
    { firstName: "Daniel", lastName: "Anderson", username: "danderson" },
    { firstName: "Isabella", lastName: "Thomas", username: "ithomas" },
    { firstName: "Matthew", lastName: "Taylor", username: "mtaylor" },
    { firstName: "Harper", lastName: "Moore", username: "hmoore" },
    { firstName: "David", lastName: "Jackson", username: "djackson" },
    { firstName: "Evelyn", lastName: "Martin", username: "emartin" }
  ];
  
  // Create user data objects with hashed passwords
  const userData = [];
  
  for (const user of users) {
    // Create password based on username (e.g., "jsmith_pass")
    const password = `${user.username}_pass`;
    // Hash the password
    const password_hash = await Bun.password.hash(password, { algorithm: "bcrypt" });
    
    userData.push({
      username: user.username,
      full_name: `${user.firstName} ${user.lastName}`,
      email: `${user.firstName.charAt(0).toLowerCase()}.${user.lastName.toLowerCase()}@example.com`,
      password_hash
    });
  }
  
  // Create all users in a single batch operation
  const result = await client.user.createMany({
    data: userData,
    skipDuplicates: true
  });
  
  return result;
}