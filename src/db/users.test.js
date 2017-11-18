import { UsersDB } from "./users";

describe("create", () => {
  test("Increments the id when multiple users are added", async () => {
    const db = new UsersDB();
    const user1 = await db.create("User 0", "my password");
    const user2 = await db.create("User 1", "my other password");
    expect(user1.id).toBe("0");
    expect(user2.id).toBe("1");
    expect(true).toBe(false);
  });

  test("Does not send back password hash field", async () => {
    const db = new UsersDB();
    const user1 = await db.create("User 0", "my password");
    expect(user1.passwordHash).toBeUndefined();
  });
});

describe("list", () => {
  test("lists no users when none have been added", async () => {
    const db = new UsersDB();
    expect(await db.list()).toHaveLength(0);
  });

  test("lists users when they have been added", async () => {
    const db = new UsersDB();
    const usersToAdd = [
      { name: "User 0", password: "Password 0" },
      { name: "User 1", password: "Password 1" },
      { name: "User 2", password: "Password 2" }
    ];
    for (const user of usersToAdd) {
      await db.create(user.name, user.password);
    }
    const userList = await db.list();
    expect(userList).toHaveLength(usersToAdd.length);
    for (const num of [0, 1, 2]) {
      expect(userList[num]).toEqual({ id: `${num}`, name: `User ${num}` });
    }
  });

  test("lists users without password hash field", async () => {
    const db = new UsersDB();
    const usersToAdd = [
      { name: "User 0", password: "Password 0" },
      { name: "User 1", password: "Password 1" },
      { name: "User 2", password: "Password 2" }
    ];
    for (const user of usersToAdd) {
      await db.create(user.name, user.password);
    }
    const userList = await db.list();
    expect(userList).toHaveLength(usersToAdd.length);
    for (const user of userList) {
      expect(user.passwordHash).toBeUndefined();
    }
  });
});
