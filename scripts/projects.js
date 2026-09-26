export function createProject(projects) {
  const totalProjects = projects.length;
  const projectList = document.querySelector("#projectList");
  const projectTemplate = document.querySelector("#projectTemplate");

  projects.map((project, i) => {
    const element = projectTemplate.content.cloneNode(true);
    element.querySelector(".header_scope-counterIndex").textContent =
      `${i + 1} / ${totalProjects}`;

    projectList.append(element);
  });
}
