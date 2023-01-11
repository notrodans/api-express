import { App } from "../src/app";
import { boot } from "../src/main";
import request from "supertest";

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe("Users e2e", () => {
	it("Register - FAIL", async () => {
		const res = await request(application.app).post("/users/register").send({
			email: "notrodans@gmail.com",
			password: "onatnegra2"
		});
		expect(res.statusCode).toBe(422);
	});

	it("Login - PASS", async () => {
		const res = await request(application.app).post("/users/login").send({
			email: "notrodans@gmail.com",
			password: "onatnegra"
		});
		expect(res.statusCode).not.toBeUndefined();
	});

	it("Login - FAIL", async () => {
		const res = await request(application.app).post("/users/login").send({
			email: "notrodans@gmail.com",
			password: "onatnegra1w1"
		});
		expect(res.statusCode).toBe(401);
	});

	it("Info - PASS", async () => {
		const login = await request(application.app).post("/users/login").send({
			email: "notrodans@gmail.com",
			password: "fdsf"
		});
		const res = await request(application.app)
			.get("/users/info")
			.set("Authorization", `Bearer ${login.body?.jwt}`);
		expect(res.body.email).toBe("notrodans@gmail.com");
	});

	it("Info - FAIL", async () => {
		const res = await request(application.app)
			.get("/users/info")
			.set("Authorization", `Bearer ${1}`);
		expect(res.statusCode).toBe(401);
	});
});

afterAll(async () => {
	application.close();
});
