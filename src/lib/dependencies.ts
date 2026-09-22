export function validateTaskDependency(taskId: string, dependencyId: string) {
  if (taskId === dependencyId) {
    throw new Error("A task cannot depend on itself.");
  }

  return dependencyId;
}
