export function createProject(projects) {
  const totalProjects = projects.length;
  const projectList = document.querySelector("#projectList");
  const projectTemplate = document.querySelector("#projectTemplate");
  const stackTemplate = document.querySelector("#techStackItem");

  projects.forEach((project, i) => {
    const element = projectTemplate.content.cloneNode(true);
    const projectElement = element.querySelector(".project");
    const stackList = element.querySelector(".footer_details-stackList");

    projectElement.id = project.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");

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

  const projectElements = projectList.querySelectorAll(".project");
  const sectionList = document.querySelector(".section-list");
  let focusFrame;

  const updateActiveProject = () => {
    focusFrame = undefined;

    const usesSectionScroller = window.innerWidth >= 1100;
    const viewport = usesSectionScroller
      ? sectionList.getBoundingClientRect()
      : { top: 0, bottom: window.innerHeight };
    const viewportHeight = viewport.bottom - viewport.top;
    const viewportCenter = viewport.top + viewportHeight / 2;
    const isAtEnd = usesSectionScroller
      ? sectionList.scrollTop + sectionList.clientHeight >=
        sectionList.scrollHeight - 1
      : window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 1;

    let activeProject = isAtEnd
      ? projectElements[projectElements.length - 1]
      : null;
    let activeScore = -Infinity;

    if (!activeProject) {
      projectElements.forEach((project) => {
        const bounds = project.getBoundingClientRect();
        const visibleHeight = Math.max(
          0,
          Math.min(bounds.bottom, viewport.bottom) -
            Math.max(bounds.top, viewport.top),
        );

        if (visibleHeight === 0) return;

        const visibleRatio = visibleHeight / Math.min(bounds.height, viewportHeight);
        const centerDistance =
          Math.abs((bounds.top + bounds.bottom) / 2 - viewportCenter) /
          viewportHeight;
        const score = visibleRatio - centerDistance * 0.15;

        if (score > activeScore) {
          activeProject = project;
          activeScore = score;
        }
      });
    }

    projectElements.forEach((project) => {
      project.classList.toggle("is-active", project === activeProject);
    });
  };

  const scheduleFocusUpdate = () => {
    if (focusFrame) return;
    focusFrame = requestAnimationFrame(updateActiveProject);
  };

  window.addEventListener("scroll", scheduleFocusUpdate, { passive: true });
  window.addEventListener("resize", scheduleFocusUpdate);
  sectionList.addEventListener("scroll", scheduleFocusUpdate, { passive: true });
  scheduleFocusUpdate();
}
