import { createProject } from "./projects.js";
import { createAsciiVideo } from "./asciiGen.js";

async function main() {
  createAsciiVideo("./assets/video/life-video.mp4");

  const data = await fetch("./data/project.json");
  const projects = await data.json();
  createProject(projects);
}
main();
