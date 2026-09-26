import { createProject } from "./projects.js";

async function main() {
  const data = await fetch("../data/project.json");
  const projects = await data.json();
  createProject(projects);
}
main();
