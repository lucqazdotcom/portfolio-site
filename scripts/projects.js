export function createProject(projects) {
  const totalProjects = projects.length;
  const projectList = document.querySelector("#projectList");
  const projectTemplate = document.querySelector("#projectTemplate");
  const stackTemplate = document.querySelector("#techStackItem");

  projects.map((project, i) => {
    const element = projectTemplate.content.cloneNode(true);
    const stackList = element.querySelector(".footer_details-stackList");

    element.querySelector(".header_scope-counterIndex").textContent =
      `${i + 1} / ${totalProjects}`;
    element.querySelector(".header_projectTitle").textContent = project.title;
    element.querySelector(".content_projectDescription").textContent =
      project.description;
    element.querySelector(".footer_link-anchor").href = project.link;

    project.stack.forEach((item) => {
      const stackElement = stackTemplate.content.cloneNode(true);
      stackElement.querySelector(".stackItem_name").textContent = item;
      stackList.append(stackElement);
    });

    projectList.append(element);
  });
}
