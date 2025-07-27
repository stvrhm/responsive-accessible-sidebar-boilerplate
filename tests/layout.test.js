import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

// Read the HTML file's content
const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
const dom = new JSDOM(html);
global.document = dom.window.document;

describe("Boilerplate Layout", () => {
	it("should have a header with a logo", () => {
		const logo = document.querySelector(".page-header .logo");
		expect(logo).not.toBeNull();
	});

	it("should have a main content area", () => {
		const main = document.getElementById("main-content");
		expect(main).not.toBeNull();
	});

	it("should have left and right sidebars", () => {
		const leftSidebar = document.getElementById("left-sidebar");
		const rightSidebar = document.getElementById("right-sidebar");
		expect(leftSidebar).not.toBeNull();
		expect(rightSidebar).not.toBeNull();
	});
});
